import React from 'react'
import clsx from 'clsx'
import TiltCard from '@/components/ui/tilt-card'
import '../../../styles/3_components/ui/media-card.css'

interface MediaCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  as?: React.ElementType
  media: React.ReactNode
  meta?: React.ReactNode
  title: React.ReactNode
  titleAs?: React.ElementType
  description?: React.ReactNode
  descriptionAs?: React.ElementType
  footer?: React.ReactNode
  cta?: React.ReactNode
  mediaClassName?: string
  bodyClassName?: string
  metaClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  footerClassName?: string
  ctaClassName?: string
  maxTilt?: number
  scale?: number
  lift?: number
}

export default function MediaCard({
  as = 'article',
  media,
  meta,
  title,
  titleAs: TitleTag = 'h3',
  description,
  descriptionAs: DescriptionTag = 'p',
  footer,
  cta,
  className = '',
  mediaClassName = '',
  bodyClassName = '',
  metaClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  footerClassName = '',
  ctaClassName = '',
  maxTilt = 8,
  scale = 1.02,
  lift = 8,
  ...rest
}: MediaCardProps) {
  return (
    <TiltCard
      as={as}
      className={clsx(
        'media-card relative flex min-h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[var(--media-card-border)] bg-[var(--media-card-bg)] shadow-[var(--media-card-shadow)] transition-[transform,border-color,box-shadow] duration-300 hover:border-[var(--media-card-border-hover)] hover:shadow-[var(--media-card-shadow-hover)] focus-within:border-[var(--media-card-border-hover)] focus-within:shadow-[var(--media-card-shadow-hover)]',
        className
      )}
      maxTilt={maxTilt}
      scale={scale}
      lift={lift}
      {...rest}
    >
      <div className={clsx('media-card__media relative z-[2] overflow-hidden', mediaClassName)}>
        {media}
      </div>
      <div className={clsx('media-card__body relative z-[2] flex flex-1 flex-col', bodyClassName)}>
        {meta ? (
          <div
            className={clsx('media-card__meta flex flex-wrap items-center gap-2.5', metaClassName)}
          >
            {meta}
          </div>
        ) : null}
        <TitleTag className={clsx('media-card__title m-0', titleClassName)}>{title}</TitleTag>
        {description ? (
          <DescriptionTag className={clsx('media-card__description m-0', descriptionClassName)}>
            {description}
          </DescriptionTag>
        ) : null}
        {footer || cta ? (
          <div
            className={clsx(
              'media-card__footer mt-auto flex items-center justify-between gap-3.5',
              footerClassName
            )}
          >
            <div className="media-card__footer-main min-w-0">{footer}</div>
            {cta ? (
              <div
                className={clsx(
                  'media-card__cta inline-flex items-center gap-2 whitespace-nowrap',
                  ctaClassName
                )}
              >
                {cta}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </TiltCard>
  )
}
