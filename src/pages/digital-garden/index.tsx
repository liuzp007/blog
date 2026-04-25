import ProjectCanvasExperience from '@/components/project-canvas-experience'

export default function DigitalGarden() {
  return (
    <ProjectCanvasExperience
      eyebrow="Garden / Spatial Growth"
      title="数字花园"
      summary="把 About 页中的“数字花园”线性生长图形扩展成一页作品展示，让结构、旋转和节点发光成为主体。"
      tags={['Three.js', 'Interactive']}
      variant="garden"
      concept="这里展示的是数字花园的核心图形语言：从中心向外生长的结构、旋转中的节点、以及像装置一样不断展开的空间秩序。"
      highlights={[
        '中心向外生长的结构强化了“花园”概念',
        '节点和枝干共同形成装置感的空间骨架',
        '适合作为未来更完整 3D 数字花园的前导页'
      ]}
    />
  )
}
