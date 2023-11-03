import {useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Section from "../../../components/Section";
import OptionsIcon from "../../../components/OptionsIcon";
import Card from "../../../components/Card";
import { deleteDocumentCycleApi, registerEnterpriseFormApi } from "../../../api/deliverable";
import ModalBasic from "../../../components/Modals/ModalBasic";
import InputText from "../../../components/Inputs/InputText";
import InputTextarea from "../../../components/Inputs/InputTextarea";
import Button from "../../../components/Inputs/Button";
import "../scss/Practices.scss"
import invokeToast from "../../../utils/invokeToast";
import InputRUC from "../../../components/Inputs/InputRUC";
import IconSystem from "../../../components/IconSystem";
import Survey from "./Survey";
import { getDateByNumber } from "../../../utils/generical-functions";


const enterpriseDummy = {
    ruc: '',
    rucVerified: false,
    enterprise_name: '',
    enterprise_photo: '',
    enterprise_id: '',
    icon: -1
}
export default function Form({myForm,cycle,listOpinions}) {
    const {user} = useAuth();
    const [modal, setModal] = useState(false)
    const [enterForm, setEnterForm] = useState(enterpriseDummy)

    const register = async () => {
        const req = {
            ...enterForm,
            id_studentxperiod: myForm.periodStudent.id_studentxperiod,
            id_student: user.id
        }
        const response =  await registerEnterpriseFormApi(req)
        if(response.success && response.result) {
            invokeToast("success", "Empresa registrada")
            window.location.reload()
        } else invokeToast("error", response.message)
    }
    const openModal = async () => {
        if(!enterForm.rucVerified) {
            invokeToast("warning", "RUC inválido. Empresa no encontrada.")
            return;
        }
        setModal(true)
    }

    const getState = (item) => {
        if(!item.enterprise_name || item.enterprise_name=='') {
            return `Empresa no registrada`
        } else if(item.form_student && item.form_enterprise) {
            return `Se han completado los dos formularios`
        } else if(item.form_student) {
            return `Empresa falta completar formulario`
        } else if(item.form_enterprise) {
            return `Estudiante falta completar formulario`
        } else {
            return `Tanto la empresa como el estudiante faltan completar formularios`
        }
    }
    return (
        <Section title={user.role==='STUDENT'? "Formulario de retroalimentación sobre la práctica": "Lista de formualrios"}>
            <div className="form-deldoc-enterprise">
                {myForm && !myForm.opinion && <div className="form-deldoc-enterprise-box">
                    {enterForm.icon===-1 && enterForm.enterprise_photo!=='' && <figure>
                        <img src={enterForm.enterprise_photo} alt="photo" />
                    </figure>}
                    {enterForm.icon!==-1 && <IconSystem type={enterForm.icon} size="60px"/>}
                    {enterForm.icon===-1 && enterForm.enterprise_photo==='' && <IconSystem type={enterForm.icon} size="60px"/>}
                    <div className="form-deldoc-enterprise-box-details">
                        <strong>Empresa: {enterForm.enterprise_name}</strong>
                        <InputRUC data={enterForm} setData={setEnterForm}/>
                    </div>
                </div>}

                {myForm && myForm.opinion && <div className="form-deldoc-enterprise-box">
                    <figure>
                        <img src={myForm.periodStudent.enterprise_photo} alt="photo" />
                    </figure>
                    <div className="form-deldoc-enterprise-box-details">
                        <strong>Empresa: {myForm.periodStudent.enterprise_name}</strong>
                        <span>RUC: {myForm.periodStudent.ruc}</span>
                    </div>
                </div>}

                {myForm && <div className="form-deldoc-enterprise-btn">
                  <Button title={"Registrar empresa"} handleClick={openModal} disabled={myForm.opinion}/>
                </div>}
            </div>
            {user.role==='STUDENT' && <Survey myForm={myForm.opinion} person={'s'} />}

            {
                listOpinions.map((item,key)=> (
                    <Card key={key}
                        text1={`${item.name} ${item.lastname}`}
                        text2={`Empresa: ${item.enterprise_name && item.enterprise_name!=''?item.enterprise_name: 'No registrada'}`}
                        text3={`Feha de respuesta del estudiante: ${item.opinion && item.opinion.student_date && item.opinion.student_date!=0? getDateByNumber(item.opinion.student_date): 'Formulario no respondido'}`}
                        text4={getState(item)}
                        photo={item.photo}
                        circleState={item.form_student && item.form_enterprise? 1: item.form_student || item.form_enterprise? 0: -1}
                    >
                        {/* <OptionsIcon listIcons={getOptions(item)} visibleText verticalIcons/> */}
                    </Card>
                ))
            }

            <ModalBasic handleClick={register} setShow={setModal} show={modal} title={`Registrar empresa`}>
                <p>¿Está seguro que desea registrar a {enterForm.enterprise_name} como su empresa para el presente ciclo?</p>
            </ModalBasic>
        </Section>
    )
}