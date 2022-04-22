import React, { useEffect, useRef, useState } from 'react'
import File from '../../components/showFile'
import { PDFObject } from 'react-pdfobject'
export default function Index() {
  const [url, setURL] = useState('../../assets/test.pdf')
  const fileRef = useRef(null)
  useEffect(() => {

    // let script = document.createElement('script')
    // script.setAttribute('type','text/javascript')
    // script.setAttribute('src','pdfobject.min.js')
    // document.querySelector('body').appendChild(script)

    if(PDFObject.supportsPDFs){
      console.log('是的，此浏览器支持内联PDF。',PDFObject())
      // PDFObject.embed.bind(this);
      
      PDFObject.embed("@/assets/test.pdf", "#example1",{fallbackLink: false});

   } else {
      console.log("Boo，此浏览器不支持内联PDF");
   }

  }, [])

  return (
    <div>
      {/* <File ref={fileRef} /> */}
      {/* <input type='file' onChange={changeFile} id='inputFile' /> */}

      <div id='example1'></div>
    </div>
  )
}
