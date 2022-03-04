import React, {Component, forwardRef} from "react";
import E from "wangeditor";
import "./index.css";
import {uploadImgAccept, highConfig, middleConfig, lowConfig} from "./config";
import { FolderEnum, uploadFile } from '@/api/uploadFile';


//cnpm i wangeditor@4.5.3 -S
/**
 * html 富文本的初始内容
 * height 富文本高度
 * isFocus 设置内容时是否获取焦点
 * placeholder 提示信息
 * oss OSS实例
 * maxCount 内容长度最大值
 * zIndex z-index
 * uploadImgMaxLength 设置一次最多长传几张图片
 * isStat 是否统计用户输入字符个数
 * montedNode（挂载的div的id名称）：必传 把edtior挂载的div，名字最好自定义，不重复
 * disabled  是否禁用
 */

export default class Editor extends Component {
    state = {
        count: 0,
        isOut: false, //输入字符是否超过最大值
        html: "",
        oldHtml:''
    };

    componentDidMount() {
        this.init();
        if(this.props.isBlur){
            document.addEventListener("mousedown",this.packup)
        }

    }

    componentWillUnmount(){
        document.removeEventListener("mousedown",this.packup)
    }

    packup = (e)=>{
        let myEditor = document.getElementById(this.props.montedNode).parentNode.parentNode;
        if(e.target === myEditor || myEditor.contains(e.target)){
        }else{
            this.props.isBlur && this.props.blur(true)
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.oss) {
            this.client = nextProps.oss;
        }
        this.setState({oldHtml:this.props.html},()=>{
            if (this.state.oldHtml !== nextProps.html) {
                this.setValue(nextProps.html || nextProps.value);
            }
        })
    }
    //change
    change = (currentCount, maxCount, html) => {
        currentCount > maxCount
            ? this.setState({isOut: true, count: currentCount, html})
            : this.setState({isOut: false, count: currentCount, html});
    };

    //设置内容
    setValue(val) {
        this.editor.txt.html(val); //设置富文本内容
    }

    //初始化
    init = () => {
        const {
            html,
            height,
            isFocus = true,
            placeholder,
            zIndex,
            configList = highConfig,
            maxCount,
            value,
            onChange,
            uploadImgMaxLength,
            montedNode,
            disabled
        } = this.props;
        const editor = new E(`#${montedNode}`); //获取富文本实例
        this.editor = editor;
        editor.config.height = height;
        editor.config.placeholder = placeholder;
        zIndex && (editor.config.zIndex = zIndex);
        editor.config.focus = isFocus;
        editor.config.onchange = (html) => {
            let l = editor.txt.text().trim().replace(/&nbsp;/ig, "").length;
            let v = html.trim();
            onChange && onChange(v)
            this.change(l, maxCount, v);
        };
        // this.setClient();
        editor.config.menus = configList.menu; //配置菜单
        editor.config.showFullScreen = configList.isFullScreen; //配置是否可以全屏
        editor.config.uploadImgAccept = uploadImgAccept; //可上传图片的文件类型
        editor.config.uploadImgMaxLength = uploadImgMaxLength; //限制一次能上传几张图片
        editor.config.customUploadImg = (resultFiles, insertImgFn) => {

            //自定义上传图片
            Array.from(resultFiles).forEach(async (file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', FolderEnum.US)
                const {fpName,mediaType} = await uploadFile(formData)
                insertImgFn(window.$$imgSrc(fpName))
                // insertImgFn(window.$$imgSrc(fpName)+'_m.'+mediaType)
            });
        };
        editor.create();
        this.setValue(html ? html : value ? value : "");
        disabled && this.editor.disable();
    };
    //清空富文本内容
    clear = () => {
        this.editor.txt.clear();
    };
    //全屏
    fullScreen = () => {
        this.editor.fullScreen();
    };
    //取消全屏
    unFullScreen = () => {
        this.editor.unFullScreen();
    };
    //禁用
    disable = () => {
        this.editor.disable();
    };
    //接触禁用
    enable = () => {
        this.editor.enable();
    };

    render() {
        const {count} = this.state;
        const {maxCount, isStat, montedNode,style} = this.props;
        return (
            <div className="my_editor" style={style}>
                <div id={montedNode} style={{resize:"both"}}>
                </div>
                {isStat ? (
                    <div className="count">
            <span className={count > maxCount ? "out_active" : ""}>
              {count}
            </span>
                        /{maxCount}
                    </div>
                ) : null}
            </div>
        );
    }
}
Editor.defaultProps = {
    html: "",
    height: 500,
    isFocus: false,
    placeholder: "",
    maxCount: 5000,
    uploadImgMaxLength: 5,
    isStat: false,
};

export const HighEditor = forwardRef((props, ref) => {
    return <Editor {...props} ref={ref} configList={highConfig}/>;
});
export const MiddleEditor = forwardRef((props, ref) => {
    return <Editor {...props} ref={ref} configList={middleConfig}/>;
});
export const LowEditor = forwardRef((props, ref) => {
    return <Editor {...props} ref={ref} configList={lowConfig}/>;
});
