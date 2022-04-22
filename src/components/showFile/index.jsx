import React, { Component } from "react";
import FileViewer from 'react-file-viewer'

// function readFile(name) { // name为文件所在位置
//     let xhr = new XMLHttpRequest(),
//     okStatus = document.location.protocol === "file:" ? 0 : 200;
//     xhr.open('GET', name, false);
//     xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
//     xhr.send(null);
//     return xhr.status === okStatus ? xhr.responseText : null;
// }
// console.log(readFile('../../assets/test.pdf'))
// console.log(fs)

// const View = () => {
//     const filePath = "https://zjyddev.oss-cn-beijing.aliyuncs.com/zjyd-front-img/%E6%96%B0%E5%BB%BA%20DOC%20%E6%96%87%E6%A1%A3.doc";
//     const type = filePath.split(".")[filePath.split(".").length - 1]
//     return <div className='view'>
//         {
//             false ?
//                 <br
//                     // fileType={type}
//                     // filePath={filePath} 
//                     // onError={()=>{}}
//                 />
//                 : <div>
//                     暂无文件预览
//                 </div>
//         }

//     </div>
// }
// export default View






export default class MyComponent extends Component {
    state = {
        fileLocalURL: null,
        type: ''
    }
    changeFile(e){
        console.log(e)
        let file  = e.curentTarget.files[0];
        let fileName = file.name
        console.log(file)
        window.URL = window.URL || window.webkitURL;
        this.setState({
            fileLocalURL:window.URL.createObjectURL(file),
            file:fileName.substring(fileName.lastIndexOf('.') + 1 ,fileName.length)
        })
    }
    render() {
        const {fileLocalURL, type} = this.state
        return (
            <div>
                {
                    fileLocalURL && <FileViewer
                    fileType={type}
                    filePath={fileLocalURL} 
                     onError={this.onError}
                     errorComponent={<div>错误</div>}
                     />

                }
            </div>
        )
    }
}