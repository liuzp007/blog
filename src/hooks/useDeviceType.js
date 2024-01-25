// useDeviceType.js
import { useState, useEffect } from 'react';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.match(/android|webos|iphone|ipad|ipod|blackberry|windows phone/i)) {
        if (userAgent.match(/ipad/i)) {
          setDeviceType('pad');
        } else {
          setDeviceType('phone');
        }
      } else {
        setDeviceType('pc');
      }
    };

    detectDeviceType();

    // 添加事件监听，以便在窗口大小变化时重新检测设备类型
    window.addEventListener('resize', detectDeviceType);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', detectDeviceType);
    };
  }, []);

  return deviceType;
}

export default useDeviceType;
