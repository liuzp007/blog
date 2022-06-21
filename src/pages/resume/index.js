import React, { useEffect, useRef, useState } from 'react'
import File from '../../components/showFile';

import { Upload, Button, Icon } from 'antd';
import './index.scss';

class MyUpload extends React.Component {
  state = {
    fileList: [
    //   {
    //   uid: -1,
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'http://www.baidu.com/xxx.png',
    // }
  ],
  }
  handleChange = (info) => {
    let fileList = info.fileList;
    info.file.name='test'
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    // fileList = fileList.filter((file) => {
    //   if (file.response) {
    //     return file.response.status === 'success';
    //   }
    //   return true;
    // });
    this.setState({ fileList },()=>{
      console.log(this.state.fileList)
    });
    debugger

  }
  render() {
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange: this.handleChange,
      multiple: true,
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> upload
        </Button>
      </Upload>
    );
  }
}

export default function Resume() {
  const [url, setURL] = useState('../../assets/test.pdf')
  const fileRef = useRef(null)
  useEffect(() => {

    //url="../../assets/text.pdf"
  }, [])
  // console.log(require('public/text.pdf'))
  return (
    <div className={'resumeWrap'}>
      {/* <File src={'https://zjyddev.oss-cn-beijing.aliyuncs.com/zjyd-front-img/0522.pdf'} /> */}
      {/* <File src={'./test.pdf'} /> */}
      <MyUpload/>
    </div>
  )
}




