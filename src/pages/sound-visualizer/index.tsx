import ProjectCanvasExperience from '@/components/project-canvas-experience'

export default function SoundVisualizer() {
  return (
    <ProjectCanvasExperience
      eyebrow="Audio / Pulse System"
      title="声波可视化"
      summary="把 About 页里那段纵向脉冲的音频画面单独做成一页，聚焦节奏、能量和波形表现。"
      tags={['Canvas', 'Audio Visualizer']}
      variant="audio"
      concept="这一页把声音能量抽象成节奏脉冲。没有接真实音频输入，重点在于让可视化本身先成立，形成具有舞台感的纵向波形系统。"
      highlights={[
        '纵向脉冲变化直接对应能量波动感',
        '多层频率叠加让画面更像正在演奏中的舞台',
        '适合后续继续接入实时音频数据源'
      ]}
    />
  )
}
