import React, {useState, useRef, useCallback} from 'react'

const useMediaRecorder = (params) => {
    const {
      audio = true,
      video = false,
      screen = false,
      askPermissionOnMount = false,
    } = params;
  
    const [mediaUrl, setMediaUrl] = useState('');
  
    const mediaStream = useRef();
    const audioStream = useRef();
    const mediaRecorder = useRef();
    const mediaBlobs = useRef([]);
  
    const getMediaStream = useCallback(async () => {
      if (screen) {
        // 录屏接口
        mediaStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true });
        mediaStream.current?.getTracks()[0].addEventListener('ended', () => {
        //   stopRecord()
        })
        if (audio) {
          // 添加音频输入流
          audioStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
          audioStream.current?.getAudioTracks().forEach(audioTrack => mediaStream.current?.addTrack(audioTrack));
        }
      } else {
        // 普通的录像、录音流
        mediaStream.current = await navigator.mediaDevices.getUserMedia(({ video, audio }))
      }
    }, [screen, video, audio])
    
    // 开始录
    const startRecord = async () => {
      // 获取流
      await getMediaStream();
  
      mediaRecorder.current = new MediaRecorder(mediaStream.current);
      mediaRecorder.current.ondataavailable = (blobEvent) => {
        mediaBlobs.current.push(blobEvent.data);
      }
      mediaRecorder.current.onstop = () => {
        const [chunk] = mediaBlobs.current;
        const blobProperty= Object.assign(
          { type: chunk.type },
          video ? { type: 'video/mp4' } : { type: 'audio/wav' }
        );
        const blob = new Blob(mediaBlobs.current, blobProperty)
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        // onStop(url, mediaBlobs.current);
      }
  
      mediaRecorder.current?.start();
    }
    
 
  }
export default useMediaRecorder