import { useEffect, useMemo, useRef, useState } from 'react'
import { load as AMapLoad } from '@amap/amap-jsapi-loader'
import { Button } from 'antd'
import {
  FOOTMARK_ROUTE_POINTS,
  FOOTMARK_STORY_NODES,
  getFootmarkCityById,
  getFootmarkWorksByCityId,
  type FootmarkStoryNode
} from '../footmarkContent'

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY?.trim()

interface FootmarkMapSceneProps {
  progress: number
  active: boolean
  quality: 'desktop' | 'mobile'
  activeCityId?: string | null
  onCitySelect?: (cityId: string) => void
}

type AMapNS = any

function readElementCssVar(element: HTMLElement, name: string, fallback: string) {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return value || fallback
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export default function FootmarkMapScene({
  progress,
  active,
  quality,
  activeCityId,
  onCitySelect
}: FootmarkMapSceneProps) {
  const isMobile = quality === 'mobile'
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const AMapRef = useRef<AMapNS | null>(null)
  const routePolylineRef = useRef<any>(null)
  const passedPolylineRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const initializedRef = useRef(false)
  const focusIndexRef = useRef(-1)
  const progressRef = useRef(progress)
  const qualityRef = useRef(quality)
  const activeCityIdRef = useRef(activeCityId)
  const detachMarkerListenerRef = useRef<(() => void) | null>(null)
  const [focusedNode, setFocusedNode] = useState<FootmarkStoryNode>(FOOTMARK_STORY_NODES[0])
  const [mapStatus, setMapStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [mapError, setMapError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const routePath = useMemo(
    () => FOOTMARK_ROUTE_POINTS.map(item => [item.lng, item.lat] as [number, number]),
    []
  )

  useEffect(() => {
    progressRef.current = progress
    qualityRef.current = quality
    activeCityIdRef.current = activeCityId
  }, [progress, quality, activeCityId])

  const syncMapState = (
    nextProgress: number,
    nextQuality: 'desktop' | 'mobile',
    nextActiveCityId?: string | null
  ) => {
    if (!initializedRef.current || !mapRef.current) return

    const safeProgress = clamp01(nextProgress)
    const revealIndex = Math.max(1, Math.round(safeProgress * (routePath.length - 1)))
    passedPolylineRef.current?.setPath(routePath.slice(0, revealIndex + 1))

    const progressIndex = Math.min(
      FOOTMARK_STORY_NODES.length - 1,
      Math.floor(safeProgress * FOOTMARK_STORY_NODES.length)
    )
    const activeIndex = nextActiveCityId
      ? Math.max(
          FOOTMARK_STORY_NODES.findIndex(item => item.id === nextActiveCityId),
          0
        )
      : progressIndex

    if (activeIndex !== focusIndexRef.current) {
      focusIndexRef.current = activeIndex
      const nextNode = FOOTMARK_STORY_NODES[activeIndex]
      setFocusedNode(nextNode)
      mapRef.current.setZoomAndCenter(
        nextQuality === 'mobile' ? 5 : 5.8,
        [nextNode.lng, nextNode.lat],
        true
      )
    }

    const currentMarkers = markersRef.current
    for (let i = 0; i < currentMarkers.length; i += 1) {
      const node = FOOTMARK_STORY_NODES[i]
      const isActive = nextActiveCityId ? i === activeIndex : i <= activeIndex
      currentMarkers[i].setContent(`
        <div class="footmark-mapMarker ${isActive ? 'is-active' : ''} footmark-mapMarker--${node.tone}" data-index="${i}">
          <span class="footmark-mapMarker__pulse"></span>
          <span class="footmark-mapMarker__dot"></span>
          <span class="footmark-mapMarker__label">${node.city}</span>
        </div>
      `)
    }
  }

  useEffect(() => {
    if (!active || initializedRef.current || !containerRef.current) return

    let alive = true

    const init = async () => {
      setMapStatus('loading')
      setMapError('')

      try {
        if (!AMAP_KEY) {
          throw new Error('未配置 VITE_AMAP_KEY，地图暂时无法加载。')
        }

        const AMap = await AMapLoad({
          key: AMAP_KEY,
          version: '2.0',
          plugins: ['AMap.MoveAnimation']
        })
        if (!alive || !containerRef.current) return

        AMapRef.current = AMap
        const map = new AMap.Map(containerRef.current, {
          viewMode: '3D',
          zoom: quality === 'mobile' ? 4.2 : 4.7,
          center: routePath[0],
          mapStyle: 'amap://styles/darkblue',
          pitch: quality === 'mobile' ? 20 : 34,
          rotation: quality === 'mobile' ? 0 : -12,
          resizeEnable: true
        })
        const routeStrokeColor = readElementCssVar(
          containerRef.current,
          '--footmark-line-progress-active',
          'lightskyblue'
        )
        const activeRouteStrokeColor = readElementCssVar(
          containerRef.current,
          '--footmark-marker-default',
          'cyan'
        )

        const routePolyline = new AMap.Polyline({
          path: routePath,
          showDir: true,
          strokeColor: routeStrokeColor,
          strokeWeight: quality === 'mobile' ? 4 : 6,
          strokeStyle: 'solid',
          lineJoin: 'round',
          lineCap: 'round'
        })

        const passedPolyline = new AMap.Polyline({
          path: [routePath[0]],
          showDir: true,
          strokeColor: activeRouteStrokeColor,
          strokeWeight: quality === 'mobile' ? 5 : 7,
          strokeStyle: 'solid',
          lineJoin: 'round',
          lineCap: 'round'
        })

        const markers = FOOTMARK_STORY_NODES.map((node, index) => {
          const marker = new AMap.Marker({
            position: [node.lng, node.lat],
            offset: new AMap.Pixel(-18, -18),
            content: `
              <div class="footmark-mapMarker footmark-mapMarker--${node.tone}" data-index="${index}">
                <span class="footmark-mapMarker__pulse"></span>
                <span class="footmark-mapMarker__dot"></span>
                <span class="footmark-mapMarker__label">${node.city}</span>
              </div>
            `,
            zIndex: 20 + index
          })
          marker.setMap(map)
          return marker
        })

        map.add(routePolyline)
        map.add(passedPolyline)
        map.setFitView([routePolyline], false, [80, 120, 80, 80])

        mapRef.current = map
        routePolylineRef.current = routePolyline
        passedPolylineRef.current = passedPolyline
        markersRef.current = markers
        initializedRef.current = true
        setMapStatus('ready')

        const handleMarkerClick = (event: Event) => {
          const target = event.target as HTMLElement | null
          const markerNode = target?.closest?.('.footmark-mapMarker') as HTMLElement | null
          const indexAttr = markerNode?.dataset?.index
          if (!indexAttr) return
          const markerIndex = Number(indexAttr)
          const targetNode = FOOTMARK_STORY_NODES[markerIndex]
          if (!targetNode) return
          onCitySelect?.(targetNode.id)
        }

        containerRef.current.addEventListener('click', handleMarkerClick)
        detachMarkerListenerRef.current = () => {
          containerRef.current?.removeEventListener('click', handleMarkerClick)
        }

        requestAnimationFrame(() => {
          syncMapState(progressRef.current, qualityRef.current, activeCityIdRef.current)
        })
      } catch (error) {
        if (!alive) return
        initializedRef.current = false
        setMapStatus('error')
        setMapError(error instanceof Error ? error.message : '地图加载失败，请稍后重试。')
      }
    }

    init()

    return () => {
      alive = false
    }
  }, [active, onCitySelect, quality, reloadToken, routePath])

  useEffect(() => {
    syncMapState(progress, quality, activeCityId)
  }, [activeCityId, progress, quality, routePath])

  const focusedCity = useMemo(() => getFootmarkCityById(focusedNode.id), [focusedNode.id])
  const focusedWorks = useMemo(
    () => (focusedCity ? getFootmarkWorksByCityId(focusedCity.id) : []),
    [focusedCity]
  )

  useEffect(() => {
    return () => {
      const currentMarkers = markersRef.current
      for (let i = 0; i < currentMarkers.length; i += 1) {
        currentMarkers[i]?.setMap?.(null)
      }
      passedPolylineRef.current?.setMap?.(null)
      routePolylineRef.current?.setMap?.(null)
      mapRef.current?.destroy?.()
      detachMarkerListenerRef.current?.()
      initializedRef.current = false
      focusIndexRef.current = -1
      markersRef.current = []
      passedPolylineRef.current = null
      routePolylineRef.current = null
      mapRef.current = null
      detachMarkerListenerRef.current = null
    }
  }, [])

  return (
    <div className={`footmark-mapScene ${active ? 'is-interactive' : ''}`}>
      <div className="footmark-mapScene__canvas" ref={containerRef}>
        {mapStatus !== 'ready' ? (
          <div
            className="footmark-mapScene__fallback absolute inset-6 z-[1] grid content-center gap-3 rounded-[24px] px-6 py-5 text-center backdrop-blur-md max-[640px]:inset-4 max-[640px]:px-4"
            role={mapStatus === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            <strong>{mapStatus === 'loading' ? '地图加载中' : '地图暂不可用'}</strong>
            <p>
              {mapStatus === 'loading'
                ? '正在连接地图服务并绘制足迹路线。'
                : mapError || '地图服务暂时不可用，你仍然可以先查看当前城市与作品信息。'}
            </p>
            {mapStatus === 'error' ? (
              <Button onClick={() => setReloadToken(value => value + 1)}>重试地图加载</Button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="footmark-mapScene__card">
        <span className="footmark-mapScene__eyebrow ui-tag">{focusedNode.eyebrow}</span>
        <h3 className="footmark-mapScene__title ui-card-title">{focusedNode.city}</h3>
        <p className="footmark-mapScene__desc ui-body-text">
          {isMobile
            ? focusedCity?.story[0] || focusedCity?.summary || focusedNode.detail
            : focusedCity?.summary || focusedNode.detail}
        </p>

        <div className="footmark-mapScene__meta mt-4 grid gap-2 max-[640px]:mt-3 max-[640px]:grid-cols-2 max-[640px]:gap-x-[10px] max-[640px]:gap-y-1.5">
          <span>{focusedWorks.length} 组作品</span>
          <span>{focusedNode.title}</span>
        </div>

        <Button
          type="primary"
          className="footmark-mapScene__action"
          onClick={() => onCitySelect?.(focusedNode.id)}
          disabled={!focusedWorks.length}
        >
          {isMobile ? '打开作品记录' : '查看这座城市留下的作品'}
        </Button>
      </div>
    </div>
  )
}
