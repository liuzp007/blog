import React,{useEffect}from 'react';
import './index.scss'
export default function NotFound({history}) {
    useEffect(()=>{
    let timer = setTimeout(()=>{
        history.push('/')
    },5000)
        return ()=>{
            clearTimeout(timer)
        }
    },[])
    return (
        <>
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
        </>


    )
}
