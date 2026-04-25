import { useEffect } from 'react'
import '../../styles/3_components/ui/not-found.css'
interface NotFoundProps {
  history: { push: (path: string) => void }
}
export default function NotFound({ history }: NotFoundProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/')
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [])
  return (
    <div className="notFoundPage">
      {/* <h2 className='timeOutBlack'>三秒后将返回首页</h2> */}
      <div className="rail">
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
        <div className="stamp four">4</div>
        <div className="stamp zero">0</div>
      </div>
      <div className="world">
        <div className="forward">
          <div className="box">
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
