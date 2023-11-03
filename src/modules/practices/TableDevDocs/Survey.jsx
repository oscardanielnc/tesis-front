import {useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Section from "../../../components/Section";
import ModalBasic from "../../../components/Modals/ModalBasic";
import InputTextarea from "../../../components/Inputs/InputTextarea";
import Button from "../../../components/Inputs/Button";
import "../scss/Practices.scss"
import invokeToast from "../../../utils/invokeToast";
import InputSurvey from "../../../components/Inputs/InputSurvey";
import { sendSurveyApi } from "../../../api/deliverable";

export default function Survey({opinion,person}) {
    const {user} = useAuth();
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(opinion)

    const getItems = () => {
        let arr = []
        for(let i=1; i<=8; i++) {
            const item = {
                value: i,
                text: surveyForm[`${person}${i}`]
            }
            arr.push(item)
        }
        return arr
    }
    const openModal = () => {
        for(let i=1; i<=8; i++) {
            const attr = `${person}${i}`
            const value = form[attr]
            if(!value || value=='' || value==0) {
                invokeToast("warning", `Falta responder la pregunta ${i}`)
                return;
            }
        }

        setModal(true)
    }
    const sendForm = async () => {
        const response =  await sendSurveyApi({...form, person: person})
        if(response.success && response.result) {
            invokeToast("success", "Formulario registrado!")
            window.location.reload()
        } else invokeToast("error", response.message)
    }

    if(!opinion) return <span>Falta registrar empresa...</span>

    return (
        <Section>
            <div className="survey-form">
                <strong>{surveyForm[`${person}t`]}</strong>
                <div className="survey-form-box">
                    {
                        getItems().map((item,key)=> (
                            <div className="survey-form-box-item" key={key}>
                                <li>{item.text}</li>
                                <InputSurvey attribute={`${person}${item.value}`} data={form} setData={setForm} 
                                    disabled={form[`${person==='s'? 'student': 'enterprise'}_date`]!=0} />
                            </div>
                        ))
                    }
                </div>
                <div className="survey-form-comments">
                    {form[`${person==='s'? 'student': 'enterprise'}_date`]==0 &&
                    <InputTextarea attribute={`comment_${person==='s'? "student": "entersprise"}`} rows={4} 
                        data={form} setData={setForm} placeholder="Comentario libre..."/>}
                    {form[`${person==='s'? 'student': 'enterprise'}_date`]!=0 &&
                        <span className="survey-form-comments_span">
                            {form[`comment_${person==='s'? "student": "entersprise"}`]}
                        </span>}
                    {form[`${person==='s'? 'student': 'enterprise'}_date`]==0 && 
                        <div style={{display: "flex", justifyContent: 'end'}}>
                            <Button handleClick={openModal} title={"Guardar"}/>
                    </div>}
                </div>
            </div>
            
            <ModalBasic handleClick={sendForm} setShow={setModal} show={modal} title={`Enviar formulario`}>
                <p>¿Está seguro que desea enviar su formulario de retroalimentación?</p>
            </ModalBasic>
        </Section>
    )
}

const surveyForm = {
    st: "En base a la experiencia del estudiante durante su periodo de prácticas en la empresa. Se registra el grado en que se cumplió con lo siguiente:",
    et: "En base al desempeño del estudiante durante su periodo de prácticas, califique su nivel o grado de:",
    s1: "Se asignaron tareas de acuerdo a lo establecido en el convenio de prácticas",
    s2: "Las tareas asignadas contribuyen al desarrollo profesional del estudiante",
    s3: "Se brinda capacitación oportuna sobre las labores y actividades",
    s4: "Las actividades asignadas pueden cumplirse dentro del plazo exigido",
    s5: "La carga de trabajo no supera las 30 horas semanas",
    s6: "Los jefes directos mantienen buena comunicación con los practicantes",
    s7: "Las instalaciones de la empresa se encuentran en óptimas condiciones",
    s8: "El ambiente laboral es saludable",
    e1: "Puntualidad",
    e2: "Cumplimiento de actividades según su convenio de prácticas",
    e3: "Responsabilidad para entregar oportunamente las tareas asignadas",
    e4: "Capacidad para resolver problemas",
    e5: "Compromiso con las normas y valores de la empresa",
    e6: "Iniciativa para proponer mejoras",
    e7: "La buena disposición para trabajar en equipo",
    e8: "La buena disposición para recibir comentarios y sugerencias",
}