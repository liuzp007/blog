import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import './index.css'

export default function NotFound() {
  const history = useHistory()

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/')
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [history])
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
