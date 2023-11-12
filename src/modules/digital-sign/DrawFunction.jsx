import { useEffect, useRef, useState } from "react"
import { signAgreementApi } from "../../api/agreement"
import Button from "../../components/Inputs/Button"
import useAuth from "../../hooks/useAuth"
import invokeToast from "../../utils/invokeToast"
import "./scss/Agreements.scss"
import SignatureCanvas from 'react-signature-canvas'

export default function DrawFunction ({id, list, setLoading, enterprise_name, job_title}) {
    const {user} = useAuth()
    const sigCanvas = useRef({})
    const [text, settext] = useState(false)


    const verificationSign = () => {
        if(sigCanvas.current.getTrimmedCanvas) {
            const nSign = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
            if(nSign.length>=32768) {
                invokeToast("warning", "Firma demaciado larga. Debe dibujarla de nuevo.")
                return false
            }
        }
        return true
    }

    const newSign = () => {
        settext(false)    
        sigCanvas.current.clear()
    }

    const executeSign = async () => {
        if(verificationSign()) {
            const nSign = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
            const fSign = nSign==='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC'? '': nSign
    
            const myListP = {
                id: user.id,
                photo: user.photo,
                name: `${user.name} ${user.lastname}`,
                role: user.role,
                date: new Date().toLocaleDateString(),
            }
            const nlist = []
            for(let i of list) {
                nlist.push(i)
            }
            nlist.push(myListP)
            const agreedata = {
                job_title,
                enterprise_name,
                list: nlist
            }
            setLoading(true)
            const req = {
                id_agreement: id,
                iam: user.role, 
                myId: user.id,
                completed: (nlist.length===3),
                sign: fSign,
                data: agreedata
            }
            const response = await signAgreementApi(req)
            if(response.success && response.result) {
                window.location.reload()
            } else invokeToast("error", response.message)
            setLoading(false)
        }
    }

    const signed = () => {
        if(!list) return false
        const myAttr = user.role==="STUDENT"? "Estudiante": user.role==="SIGNATORY"? "Institución Educativa": "Empresa"
        for(let item of list) {
            if(item.attr==myAttr) return true
        }
        return false
    }

    const textVerication = () => {
        settext(true)
        verificationSign()
    }
    return (
        <div className="draw-function">
            <div className="draw-function_canva">
                {/* {signMode? <img src={user.sign} className="draw-function_canva_img"/>: */}
                <SignatureCanvas canvasProps={{width: "768px", height: "300px"}} 
                    ref={sigCanvas} onEnd={textVerication}/>
            </div>
            <div className="draw-function_options">
                <Button handleClick={newSign} icon={"bi bi-file-earmark-plus"} title={"Limpiar"} disabled={!text} />
                <Button handleClick={executeSign} icon={"bi bi-pencil-square"} title={"Firmar"} disabled={!(!signed() && text)} />
            </div>
        </div>
    )
}
