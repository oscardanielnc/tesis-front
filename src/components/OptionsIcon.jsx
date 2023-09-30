import { useState } from "react"
import "./scss/Icons.scss"
import { API_VERSION, BASE_PATH } from "../config"

export default function OptionsIcon (props) {
    const {listIcons, vertical=false, size='24px', visibleText=false, verticalIcons=false, reverse=false, onlyRead=false} = props
    return (
        <div className={`options-icon ${vertical && 'vertical'}`}>
            {
                listIcons.map((item, key) => (
                    <IconFn key={key} item={item} visibleText={visibleText} size={size}
                        verticalIcons={verticalIcons} reverse={reverse} onlyRead={onlyRead} />
                ))
            }
        </div>
    )
}

function IconFn({item, size, visibleText, verticalIcons, reverse, onlyRead}) {

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [newFile];
            item.fn(updatedList)
        }
    }

    if(item.icon==='up') return (
        <div>
            <button id='doc_button' onClick={()=> document.getElementById('doc_upload').click()} 
                className={`options-icon_file options-icon_icon ${verticalIcons && 'vertical'} ${reverse && 'reverse'} ${onlyRead && 'onlyRead'}`} >
                {visibleText && <span>{item.text}</span>}
                <i className={"bi bi-cloud-upload"}
                    style={{color: item.color, fontSize: size}}>
                </i>
            </button>
            <input type="file" id="doc_upload" onChange={onFileDrop} name="doc_upload" hidden/>
        </div>
    )

    if(item.icon==='down') return (
        <div className={`options-icon_file options-icon_icon ${verticalIcons && 'vertical'} ${reverse && 'reverse'} ${onlyRead && 'onlyRead'}`} >
            <a href={`http://${BASE_PATH}/api/${API_VERSION}/doc/${item.fn()}`}>
                {visibleText && <span>{item.text}</span>}
                <i className={"bi bi-download"}
                    style={{color: item.color, fontSize: size}}>
                </i>
            </a>
        </div>
    )

    return (
        <div onClick={item.fn? item.fn: ()=>{}}
            className={`options-icon_icon ${verticalIcons && 'vertical'} ${reverse && 'reverse'} ${onlyRead && 'onlyRead'}`}
        >
            {visibleText && <span>{item.text}</span>}
            <i className={item.icon}
                style={{color: item.color, fontSize: size}}>
            </i>
        </div>
    )
}