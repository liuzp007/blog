import { useEffect, useMemo, useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Drawer, Image, Modal, Tag } from 'antd'
import { getFootmarkMediaByIds, type FootmarkCity, type FootmarkWork } from '../footmarkContent'

interface FootmarkCityDetailProps {
  city: FootmarkCity | null
  works: FootmarkWork[]
  open: boolean
  isMobile: boolean
  onClose: () => void
}

function clampIndex(nextIndex: number, total: number) {
  if (!total) return 0
  if (nextIndex < 0) return total - 1
  if (nextIndex >= total) return 0
  return nextIndex
}

function DetailBody({ city, works }: { city: FootmarkCity; works: FootmarkWork[] }) {
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)

  useEffect(() => {
    setActiveWorkIndex(0)
  }, [city.id, works.length])

  const activeWork = works[activeWorkIndex]
  const activeMedia = useMemo(() => getFootmarkMediaByIds(activeWork?.mediaIds || []), [activeWork])

  return (
    <div className="footmark-detail grid gap-6 max-[640px]:gap-[18px]">
      <div className="footmark-detail__head grid gap-2.5">
        <span className="footmark-detail__eyebrow ui-tag">{city.eyebrow}</span>
        <h2 className="footmark-detail__cityTitle ui-display-title">{city.name}</h2>
        <p className="footmark-detail__citySummary ui-lead-text">{city.summary}</p>
      </div>

      <div className="footmark-detail__body grid gap-6 min-[901px]:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="footmark-detail__media">
          {activeMedia.length > 0 ? (
            <Image.PreviewGroup>
              <div
                className={`footmark-detail__mediaGrid grid gap-3 ${
                  activeMedia.length > 1
                    ? 'min-[641px]:grid-cols-2 max-[640px]:grid-cols-1'
                    : 'grid-cols-1'
                }`}
              >
                {activeMedia.map(media => (
                  <div key={media.id} className="footmark-detail__mediaCard">
                    <Image
                      src={media.src}
                      alt={media.alt}
                      preview
                      className="footmark-detail__image"
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          ) : (
            <div className="footmark-detail__placeholder grid min-h-[360px] content-center gap-2.5 p-6 text-center">
              <strong>这座城市的作品还没上传完成</strong>
              <span>内容模型已经就位，后续替换成你的真实照片或作品即可。</span>
            </div>
          )}
        </div>

        <div className="footmark-detail__content grid content-start gap-4 px-5 py-[18px] max-[640px]:p-4">
          <div className="footmark-detail__workTop flex items-start justify-between gap-3 max-[640px]:flex-col">
            <div>
              <span className="footmark-detail__label ui-meta-text">当前作品</span>
              <h3 className="footmark-detail__workTitle ui-card-title">
                {activeWork?.title || '待补充作品'}
              </h3>
            </div>

            {works.length > 1 ? (
              <div className="footmark-detail__pager inline-flex items-center gap-2.5">
                <Button
                  shape="circle"
                  icon={<LeftOutlined />}
                  onClick={() => setActiveWorkIndex(prev => clampIndex(prev - 1, works.length))}
                />
                <span>
                  {activeWorkIndex + 1} / {works.length}
                </span>
                <Button
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={() => setActiveWorkIndex(prev => clampIndex(prev + 1, works.length))}
                />
              </div>
            ) : null}
          </div>

          {activeWork?.shotAt ? (
            <p className="footmark-detail__shotAt">{activeWork.shotAt}</p>
          ) : null}

          <p className="footmark-detail__description ui-body-text">
            {activeWork?.description || city.detail}
          </p>

          {activeWork?.tags?.length ? (
            <div className="footmark-detail__tags flex flex-wrap gap-2">
              {activeWork.tags.map(tag => (
                <Tag key={tag} className="ui-tag">
                  {tag}
                </Tag>
              ))}
            </div>
          ) : null}

          {works.length > 1 ? (
            <div className="footmark-detail__workRail flex flex-wrap gap-2.5">
              {works.map((work, index) => (
                <Button
                  key={work.id}
                  className={`footmark-detail__workChip ${index === activeWorkIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveWorkIndex(index)}
                >
                  {work.title}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="footmark-detail__story grid gap-2.5">
            {city.story.map(line => (
              <p key={line} className="footmark-detail__storyText ui-body-text">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FootmarkCityDetail({
  city,
  works,
  open,
  isMobile,
  onClose
}: FootmarkCityDetailProps) {
  if (!city) return null

  const content = <DetailBody city={city} works={works} />

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        placement="bottom"
        height="82vh"
        className="footmark-detailDrawer"
        title={`${city.name} · 作品记录`}
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1080}
      className="footmark-detailModal"
      title={`${city.name} · 作品记录`}
      destroyOnClose
    >
      {content}
    </Modal>
  )
}
