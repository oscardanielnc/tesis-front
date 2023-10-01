import "./scss/Icons.scss"
import { API_VERSION, BASE_PATH } from "../config"

export default function Document({path,name, placeholder="Sin documento..."}) {

    if(!path && path=='') return (
        <span>{placeholder}</span>
    )
    const getName = () => {
        if(!path || path=='') return ''
        const extention = path.split('.')[1]
        return `${name}.${extention}`
    }

    return (
        <div className={`document-psp`} >
            <a href={`http://${BASE_PATH}/api/${API_VERSION}/doc/${path}/${name}`} className={`document-psp_link`}>
                <i className={"bi bi-file-earmark-text-fill"}></i>
                <span>{getName()}</span>
            </a>
        </div>
    )
}