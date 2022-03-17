import React, { useEffect } from 'react'
import './index.scss'

function setCanvas(id, x = 30, y = 80) {

  // 使用id来寻找canvas元素
  var myCanvas = document.getElementById(id);
  if (myCanvas.getContext) {
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
      ctx.fillStyle = '#E4EF00';
      ctx.strokeStyle = "red";
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



export default function Header() {
  useEffect(() => {
    // setCanvas('canvas1')
    // setCanvas('canvas2')
  }, [])
  return (
    <div className={'headerWarp'}>
      <div className='header'>
        <div className='logo'>
          <canvas id='canvas1'>

          </canvas>
          <canvas id='canvas2'>

          </canvas>
        </div>
      </div>
    </div>
  )
}
