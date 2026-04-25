import ProjectCanvasExperience from '@/components/project-canvas-experience'

export default function FluidForm() {
  return (
    <ProjectCanvasExperience
      eyebrow="Fluid / WebGL Mood"
      title="流体形态"
      summary="把 About 页卡片里的流体画面单独拉成一页，让色团扩散、叠加和呼吸节奏成为主角。"
      tags={['WebGL', 'Generative Art']}
      variant="fluid"
      concept="这个页面不是跳去旧作品，而是把 About 页里那张“流体形态”卡片本身发展成独立展示。核心重点就是流动、透明、扩散和暖色空间层次。"
      highlights={[
        '径向色团持续叠加，形成具有呼吸感的流体氛围',
        '画面会自动演化，适合长时间停留观看',
        '保持轻量 canvas 实现，适合作品集独立展示页'
      ]}
    />
  )
}
