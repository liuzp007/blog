import React, { useState, useRef } from 'react'
import './index.scss'
const useMediaRecorder = () => {
  const [mediaUrl, setMediaUrl] = useState('');

  const mediaStream = useRef();
  const mediaRecorder = useRef();
  const mediaBlobs = useRef([]);
  //点击开始
  const startRecord = async () => {
    // 读取输入流
    mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    // 生成 MediaRecorder 对象
    mediaRecorder.current = new MediaRecorder(mediaStream.current);

    // 将 stream 转成 blob 来存放
    mediaRecorder.current.ondataavailable = (blobEvent) => {
      mediaBlobs.current.push(blobEvent.data);
    }
    // 停止时生成预览的 blob url
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(mediaBlobs.current, { type: 'audio/wav' })
      const url = URL.createObjectURL(blob);
      setMediaUrl(url);
    }

    mediaRecorder.current?.start();
  }

  const pauseRecord = async () => {
    mediaRecorder.current?.pause();
  }

  const resumeRecord = async () => {
    mediaRecorder.current?.resume()
  }
  // 结束，不仅让 MediaRecorder 停止，还要让所有音轨停止

  const stopRecord = async () => {
    mediaRecorder.current?.stop()
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    mediaBlobs.current = [];
  }

  return {
    mediaUrl, //录音结束返回生成的URL
    startRecord, //开始
    pauseRecord,//暂停
    resumeRecord, //恢复
    stopRecord, // 停止
    clearBlobUrl: () => { // 每次 URL.createObjectURL 后都会生成一个 url -> blob 的引用，这样的引用也是会占用资源内存的，所以可以提供一个方法来销毁这个引用。
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
      setMediaUrl('');
    }
  }
}
// 从上面可以看到，首先从 getUserMedia 获取输入流 mediaStream，以后还可以打开 video: true 来同步获取视频流。

// 然后将 mediaStream 传给 mediaRecorder，通过 ondataavailable 来存放当前流中的 blob 数据。

// 最后一步，调用 URL.createObjectURL 来生成预览链接，这个 API 在前端非常有用，比如上传图片时也可以调用它来实现图片预览，而不需要真的传到后端才展示预览图片。


const App = () => {
  const { mediaUrl, startRecord, resumeRecord, pauseRecord, stopRecord } = useMediaRecorder();

  return (
    <div style={{ color: "black" }}>
      <h1>react 录音</h1>

      <audio src={mediaUrl} controls />

      <button onClick={startRecord}>开始</button>
      <button onClick={pauseRecord}>暂停</button>
      <button onClick={resumeRecord}>恢复</button>
      <button onClick={stopRecord}>停止</button>
    </div>
  );
}
export default App