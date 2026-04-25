import { useState, useRef, useCallback, useEffect } from 'react'

interface MediaRecorderParams {
  audio?: boolean
  video?: boolean
  screen?: boolean
  askPermissionOnMount?: boolean
}

const useMediaRecorder = (params: MediaRecorderParams) => {
  const {
    audio = true,
    video = false,
    screen = false,
    askPermissionOnMount: _askPermissionOnMount = false
  } = params

  const [_mediaUrl, setMediaUrl] = useState('')

  const mediaStream = useRef<MediaStream | null>(null)
  const audioStream = useRef<MediaStream | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const mediaBlobs = useRef<Blob[]>([])

  // 组件卸载时自动清理资源
  useEffect(() => {
    return () => {
      mediaRecorder.current?.stop()
      mediaStream.current?.getTracks().forEach(track => track.stop())
      audioStream.current?.getTracks().forEach(track => track.stop())
      mediaBlobs.current = []
    }
  }, [])

  const getMediaStream = useCallback(async () => {
    if (screen) {
      // 录屏接口
      mediaStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true })
      mediaStream.current?.getTracks()[0].addEventListener('ended', () => {
        //   stopRecord()
      })
      if (audio) {
        // 添加音频输入流
        audioStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioStream.current
          ?.getAudioTracks()
          .forEach(audioTrack => mediaStream.current?.addTrack(audioTrack))
      }
    } else {
      // 普通的录像、录音流
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ video, audio })
    }
  }, [screen, video, audio])

  // 开始录
  const startRecord = async () => {
    // 获取流
    await getMediaStream()

    if (mediaStream.current) {
      mediaRecorder.current = new MediaRecorder(mediaStream.current)
      mediaRecorder.current.ondataavailable = blobEvent => {
        mediaBlobs.current.push(blobEvent.data)
      }
      mediaRecorder.current.onstop = () => {
        const [chunk] = mediaBlobs.current
        const blobProperty = Object.assign(
          { type: chunk.type },
          video ? { type: 'video/mp4' } : { type: 'audio/wav' }
        )
        const blob = new Blob(mediaBlobs.current, blobProperty)
        const url = URL.createObjectURL(blob)
        setMediaUrl(url)
        // onStop(url, mediaBlobs.current);
      }

      mediaRecorder.current?.start()
    }
  }

  // 返回保持一致的接口，便于示例引用
  return {
    startRecord
  }
}
export default useMediaRecorder
