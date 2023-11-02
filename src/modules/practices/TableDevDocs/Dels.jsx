import {useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Section from "../../../components/Section";
import OptionsIcon from "../../../components/OptionsIcon";
import Card from "../../../components/Card";
import { createAssessmentsCycleApi, deleteDocumentCycleApi } from "../../../api/deliverable";
import ModalBasic from "../../../components/Modals/ModalBasic";
import InputText from "../../../components/Inputs/InputText";
import InputTextarea from "../../../components/Inputs/InputTextarea";
import Button from "../../../components/Inputs/Button";
import "../scss/Practices.scss"
import invokeToast from "../../../utils/invokeToast";
import { uploadDocCycleApi } from "../../../api/doc";
import { getDateByNumber } from "../../../utils/generical-functions";
import InputDate from "../../../components/Inputs/InputDate";
import { useNavigate } from "react-router-dom";

const docDummy = {
    title: '',
    descripcion: '',
    date_end: ''
}
export default function Dels({assessments,cycle}) {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(docDummy)

    const createDeliv = async () => {
        if(form.title=='') {
            invokeToast("warning", "Debe agregar un título a este entregable")
            return;
        }
        if(form.descripcion=='') {
            invokeToast("warning", "Debe ingresar una descripción para este entregable")
            return;
        }
        if(form.date_end=='') {
            invokeToast("warning", "Debe ingresar una fecha de entrega")
            return;
        }
        const req = {
            ...form,
            specialty: user.specialty,
            cycle: cycle,
            id_profesor: user.id,
        }
        const response = await createAssessmentsCycleApi(req)
        if(response.success && response.result) {
            invokeToast("success", "Entregable creado!")
            window.location.reload()
        } else invokeToast("error", response.message)
    }

    const getState = item => {
        if(user.role==='STUDENT') {
            let str = item.state
            if(item.state==='Entregado') str += ` el ${item.update_date}`
            return str
        } else return ''
    }

    return (
        <Section title={"Documentos del curso"}>
            {user.role==="PROFESSOR" && user.coordinator && <div className="profile_container_principal_plus">
                <Button title={`Añadir entregable`}
                    icon={"bi bi-plus"}
                    variant={"primary"}
                    circle
                    handleClick={()=>setModal(true)}
                />
            </div>}
            <div>
                {
                    assessments.map((item,index)=> (
                        <Card key={index} 
                            text1={`${item.title}`}
                            text2={item.descripcion}
                            text3={`Fecha límite de entrega: ${getDateByNumber(item.date_end)}`}
                            text4={getState(item)}
                            circleState={item.state==='Entregado'? 1: 0}
                        >
                            <OptionsIcon listIcons={[{icon: 'bi bi-box-arrow-in-right', text: "Revisar",
                                            fn: ()=> navigate(`/practices/deliver/${item.id_assessment}/${cycle}`)}]} visibleText/>
                        </Card>
                    ))
                }
            </div>
            <ModalBasic handleClick={createDeliv} setShow={setModal} show={modal} title={`Crear entregable`}>
                <Section title={"Título"} small>
                    <InputText attribute={"title"} data={form} setData={setForm} />
                </Section>
                <Section title={"Descripción"} small>
                    <InputTextarea cols={80} rows={6} attribute={"descripcion"} data={form} setData={setForm} />
                </Section>
                <Section title={"Fecha límite de entrega"} small>
                    <InputDate data={form} setData={setForm} attribute={"date_end"}/>
                </Section>
            </ModalBasic>
        </Section>
    )
}