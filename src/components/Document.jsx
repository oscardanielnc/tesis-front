import "./scss/Icons.scss"
import { API_VERSION, BASE_PATH } from "../config"

export default function Document({path,name, placeholder="Sin documento..."}) {

    if(!path && path=='') return (
        <div className={`document-psp`} >
            <i className={"bi bi-file-earmark-text-fill"}></i>
            <span style={{marginLeft: '12px'}}>{placeholder}</span>
        </div>
    )
    const getName = () => {
        if(!path || path=='') return ''
        const extention = path.split('.')[1]
        return `${name.replace('/', '')}.${extention}`
    }

    return (
        <div className={`document-psp`} >
            <a href={`http://${BASE_PATH}/api/${API_VERSION}/doc/${path}/${name.replace('/', '')}`} className={`document-psp_link`}>
                <i className={"bi bi-file-earmark-text-fill"}></i>
                <span>{getName()}</span>
            </a>
        </div>
    )
}