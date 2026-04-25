import ContentWrapper from '../../components/content-wrapper'
import SimpleContentCard from '../../components/simple-content-card'
import { MAIN_HOME_ITEMS } from './contentSeeds'

export default function MainHome() {
  return (
    <ContentWrapper title="技术分享" subtitle="探索前端开发的艺术">
      <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {MAIN_HOME_ITEMS.map(item => (
          <SimpleContentCard key={item.id} item={item} />
        ))}
      </div>
    </ContentWrapper>
  )
}
