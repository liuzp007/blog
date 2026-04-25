import ProjectCanvasExperience from '@/components/project-canvas-experience'

export default function FractalCosmos() {
  return (
    <ProjectCanvasExperience
      eyebrow="Fractal / Infinite Detail"
      title="分形宇宙"
      summary="把 About 页里的分形环形生成器做成单独作品页，让递归、旋转和层层细节成为完整观看对象。"
      tags={['GLSL', 'Shader Art']}
      variant="fractal"
      concept="这个作品更偏图形秩序本身。通过重复、扰动和旋转，让有限的几何规则不断长出接近“宇宙结构”的层级感。"
      highlights={[
        '环形递归与波动扰动制造出持续推进的细节',
        '画面会不断旋转生长，形成越看越深的空间感',
        '适合作为后续 shader art 系列的独立展示入口'
      ]}
    />
  )
}
