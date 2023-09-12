import { useEffect, useState } from "react";
import { setMyCertificateApi, updateMyCertificateApi } from "../../api/sysData";
import "../scss/Modal.scss"
import ModalBasic from "./ModalBasic";
import invokeToast from "../../utils/invokeToast"
import InputText from "../Inputs/InputText";
import InputRange from "../Inputs/InputRange";
import InputRUC from "../Inputs/InputRUC";
import InputTextarea from "../Inputs/InputTextarea";
import IconSystem from "../IconSystem";



function ModalCerfiticates({show, setShow, type, camp, item}) { 
    const [form, setForm] = useState({});

    useEffect(() => {
        setForm({
            ...item,
            rucVerified: item.enterprise_photo!==''
        })
    }, [item.id])

    const handleClick = async () => {
        let body = {}
        let listName = 'experience'
        if(camp.includes("xperien")) {
            body = {
                ...form,
                type: 1
            }
        } else {
            body = {
                ...form,
                type: 2
            }
            listName = 'certificates'
        }
        if(validateForm()) {
            if(type==='edit') {
                const response = await updateMyCertificateApi(body)
                if(response.success) {
                    window.location.reload()
                }
            } else if(type==='add') {
                const response = await setMyCertificateApi(body)
                if(response.success && response.result.success) {
                    window.location.reload()
                }
            }
        }
    }

    const validateForm = () => {
        if(form.enterprise_name === '') 
            {invokeToast("warning", "El nombre de su empresa no puede ser campo vacío"); return false}
        if(form.title === '') 
            {invokeToast("warning", "El título de su certificado o experiencia laboral no puede estar vacío"); return false}
        if(form.date_init === '') 
            {invokeToast("warning", "Debe escoger la fecha de inicio de actividades"); return false}
        if(new Date(form.date_init) > new Date()) 
            {invokeToast("warning", "La fecha de inicio no puede ser mayor a la fecha actual"); return false}
        if(form.date_end !== '' && (new Date(form.date_init) > new Date(form.date_end))) 
            {invokeToast("warning", "La fecha de inicio no puede ser mayor a la fecha de fin de actividades"); return false}
        return true
    }

    const changeIcon = (plus) => {
        let rIcon = form.icon + plus
        if(!form.rucVerified) {
            if(rIcon< -1) rIcon = 5
            if(rIcon> 5) rIcon = -1
        } else {
            rIcon=-1
        }
        setForm({
            ...form,
            icon: rIcon
        })
    }

  return (
      <ModalBasic title={`${type==='edit'? "Modificar": "Añadir"} ${camp}`} show={show} setShow={setShow} handleClick={handleClick}>
        <div className="modal-certificates">
            <div className="modal-certificates_left">
                <div className="modal-certificates_left_photo">
                    <div className="modal-certificates_left_photo_controls">
                        <i className="bi bi-caret-up-fill" onClick={()=> changeIcon(+1)}></i>
                        <i className="bi bi-caret-down-fill" onClick={()=> changeIcon(-1)}></i>
                    </div>
                    {form.icon===-1 && form.enterprise_photo!=='' && <figure>
                        <img src={form.enterprise_photo} alt="photo" />
                    </figure>}
                    {form.icon!==-1 && <IconSystem type={form.icon} size="60px"/>}
                    {form.icon===-1 && form.enterprise_photo==='' && <IconSystem type={form.icon} size="60px"/>}
                </div>
                <InputText attribute={"enterprise_name"} data={form} setData={setForm} 
                    maxLength={20} placeholder="Empresa" disabled={form.rucVerified}/>
                <InputRUC data={form} setData={setForm}/>

            </div>
            <div className="modal-certificates_right">
                <InputText attribute={"title"} data={form} setData={setForm} maxLength={40} placeholder="Nombre del puesto de trabajo"/>
                <InputRange attribute1={"date_init"} attribute2={"date_end"} data={form} setData={setForm} type="date"/>
                <InputTextarea cols={50} rows={6} attribute={"description"} data={form} setData={setForm} />
            </div>
        </div>
      </ModalBasic>
  );
}

export default ModalCerfiticates;