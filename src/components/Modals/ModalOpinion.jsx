import { useEffect, useState } from "react";
import "../scss/Modal.scss"
import ModalBasic from "./ModalBasic";
import invokeToast from "../../utils/invokeToast"
import InputTextarea from "../Inputs/InputTextarea";
import Score from "../Score";
import { setMyOpinionApi, updateMyOpinionApi } from "../../api/opinion";

function ModalOpinion({opinion,show,setShow,type,photo}) { 
    const [form, setForm] = useState({});

    useEffect(() => {
        setForm(opinion)
    }, [opinion.id])

    const handleClick = async () => {
        if(form.score !== 0) {
            if(type==='edit') {
                const response = await setMyOpinionApi(form)
                if(response.success && response.result) {
                    window.location.reload()
                }
            } else if(type==='add') {
                const response = await updateMyOpinionApi(form)
                if(response.success && response.result) {
                    window.location.reload()
                }
            }
        } else {
            invokeToast("warning", "Debe colocar una calificación a la empresa")
        }
    }

  return (
      <ModalBasic title={`${type==='edit'? "Modificar": "Añadir"} mi experiencia en la empresa`} show={show} setShow={setShow} handleClick={handleClick}>
        <div className="modal-certificates">
            <div className="modal-certificates_left" style={{textAlign: "center", gap: "0px"}}>
                <div className="modal-certificates_left_photo">
                    <figure>
                        <img src={photo} alt="photo" />
                    </figure>
                </div>
                <strong>{form.enterprise_name}</strong>
                <span>RUC: {form.ruc}</span>
            </div>
            <div className="modal-certificates_right">
                <Score score={form.score} data={form} setData={setForm}/>
                <InputTextarea cols={50} rows={6} attribute={"description"} data={form} setData={setForm} />
            </div>
        </div>
      </ModalBasic>
  );
}

export default ModalOpinion;