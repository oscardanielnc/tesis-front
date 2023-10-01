import { signAgreementApi } from "../../api/agreement"
import Button from "../../components/Inputs/Button"
import useAuth from "../../hooks/useAuth"
import invokeToast from "../../utils/invokeToast"
import "./scss/Agreements.scss"

export default function DrawFunction ({id, list}) {
    const {user} = useAuth()

    const newSign = () => {
        
    }

    const executeSign = async () => {
        const req = {
            id_agreement: id,
            iam: user.role, 
            myId: user.id,
            completed: (!!list && list.length===2)
        }
        const response = await signAgreementApi(req)
        if(response.success && response.result) {
            window.location.reload()
        } else invokeToast("error", response.message)
    }

    const signed = () => {
        if(!list) return false
        const myAttr = user.role==="STUDENT"? "Estudiante": user.role==="SIGNATORY"? "Institución Educativa": "Empresa"
        for(let item of list) {
            if(item.attr==myAttr) return true
        }
        return false
    }
    return (
        <div className="draw-function">
            <div className="draw-function_canva">

            </div>
            <div className="draw-function_options">
                <Button handleClick={newSign} icon={"bi bi-file-earmark-plus"} title={"Nueva firma"} disabled={true} />
                <Button handleClick={executeSign} icon={"bi bi-pencil-square"} title={"Firmar"} disabled={signed()} />
            </div>
        </div>
    )
}
