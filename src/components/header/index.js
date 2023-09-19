import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import Vinyl from '../vinyl'
import './index.scss'

function setCanvas(id, x = 30, y = 80) {

  // 使用id来寻找canvas元素
  var myCanvas = document.getElementById(id);
  if (myCanvas?.getContext) {
    // 创建context对象
    // getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法
    var ctx = myCanvas.getContext("2d");
    var horn = 5; // 画5个角
    var angle = 360 / horn; // 五个角的度数
    // 两个圆的半径
    var R = 20;
    var r = 12;
    // 坐标
    var x = x;
    var y = y;
    var rot = 10;

    function drawStar(ctx, R, r, rotate) {
      // beginPath：开始绘制一段新的路径
      ctx.beginPath();
      for (var i = 0; i < horn; i++) {
        // 角度转弧度：角度/180*Math.PI
        var roateAngle = i * angle - rotate; // 旋转动起来
        // 外圆顶点坐标
        ctx.lineTo(Math.cos((18 + roateAngle) / 180 * Math.PI) * R + x, -Math.sin((18 + roateAngle) / 180 * Math.PI) * R + y);
        // 內圆顶点坐标
        ctx.lineTo(Math.cos((54 + roateAngle) / 180 * Math.PI) * r + x, -Math.sin((54 + roateAngle) / 180 * Math.PI) * r + y);
      }
      // closePath：关闭路径，将路径的终点与起点相连
      ctx.closePath();
      ctx.lineWidth = "3";
      ctx.fillStyle = '';
      ctx.strokeStyle = "gray";
      ctx.fill();
      ctx.stroke();
    }
    drawStar(ctx, R, r, 20);

    // setInterval(function (){
    //     ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    //     drawStar(ctx, R, r, rot);
    //     rot += 2;
    // }, 30);

    // 更加流畅的动画：window.requestAnimationFrame
    function step() {
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      drawStar(ctx, R, r, rot);
      rot += 1;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

}



export default function Header({ history }) {
  const [topNum, setTopNum] = useState('-110px')
  useEffect(() => {
    setCanvas('canvas1')
    setCanvas('canvas2')
  }, [])
  const toHome = () => {
    history.push('/')
  }
  return (
    <div className={'headerWrap'}>
      <div className='header'>
        <div className='logo' >
          <Vinyl className='spanbg'/>
         {/* <Tooltip title={'TO home'} placement="right" >
         <span className='spanbg' onClick={toHome}>这是一个logo</span>
         </Tooltip> */}
          {/* <canvas id='canvas1'>
          </canvas>
          <canvas id='canvas2'>
          </canvas> */}
          <svg t="1657693978223" className="icon" viewBox="0 0 1024 1024" version="1.1" widths={55} height={55} xmlns="http://www.w3.org/2000/svg" p-id="3545" >
            <path d="M334.848 343.04q22.528-28.672 49.152-50.176 22.528-18.432 50.176-33.792t57.344-13.312q43.008 3.072 71.68 20.48t45.568 43.008 23.04 58.368 4.096 66.56-13.312 64.512-27.136 57.856-34.304 49.664-36.864 40.96q-27.648 28.672-58.368 54.784t-58.368 46.08-49.664 31.744-32.256 11.776q-12.288 0-32.256-12.288t-44.544-32.256-52.224-46.08-55.296-52.736q-17.408-17.408-38.912-39.424t-40.448-48.128-32.256-57.344-14.336-67.072q-2.048-34.816 7.168-66.048t27.136-55.808 44.032-41.472 58.88-24.064 65.024 6.656 58.88 33.28q30.72 22.528 58.368 54.272zM611.328 245.76q13.312 0 25.6 1.024 11.264 1.024 23.552 3.072t21.504 6.144 19.456 10.752 19.456 12.8l20.48 16.384q6.144-6.144 13.312-11.264 13.312-10.24 35.84-23.552 12.288-7.168 28.672-10.752t33.28-2.56 33.28 6.656 27.648 17.92q31.744 33.792 37.888 66.048t-1.536 60.416-23.04 49.664-27.648 33.792q-23.552 23.552-44.544 40.96t-51.712 39.936q-16.384 11.264-34.304 19.456t-27.136 8.192q-9.216 1.024-19.968-7.68t-26.112-19.968q-7.168-5.12-13.312-12.288l-12.288-11.264-12.288-12.288q11.264-20.48 18.432-46.08 6.144-21.504 9.216-50.688t-3.072-62.976q-7.168-31.744-18.944-55.296t-23.04-37.888q-13.312-17.408-28.672-28.672z" p-id="3546"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
