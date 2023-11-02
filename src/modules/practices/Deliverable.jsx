import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import Document from "../../components/Document";
import { useNavigate, useParams } from "react-router-dom";
import invokeToast from "../../utils/invokeToast"
import Loading from "../../components/Loading";
import { getDateByNumber } from "../../utils/generical-functions";
import { getAssessmentDataApi, insertCommentDelivApi } from "../../api/deliverable";
import "./scss/Practices.scss"
import InputTextarea from "../../components/Inputs/InputTextarea";
import Button from "../../components/Inputs/Button";
import { uploadDeliverApi } from "../../api/doc";

export default function Deliverable () {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const {assessment,cycle} = useParams()
    const [form, setForm] = useState({comment: ''})
    const [loading, setLoading] = useState(false)
    const [deliverView, setDeliverView] = useState(null)

    useEffect(()=> {
        async function fetchData() {
            setLoading(true)
            const req = {
                id_assessment: assessment,
                id_student: user.role==='STUDENT'? user.id: null,
                cycle: cycle,
                specialty: user.specialty,
                id_supervisor: user.role==='PROFESSOR' && !user.coordinator? user.id: null,
            }
            const response = await getAssessmentDataApi(req);
            if(response.success) {
                setData(response.result)
                console.log(response.result)
                if(user.role==='PROFESSOR' && response.result.delivers.length>0) {
                    setDeliverView(response.result.delivers[0])
                } else if(user.role==='STUDENT') {
                    setDeliverView(response.result.myDeliver)
                }
            }
            setLoading(false)
        }
        fetchData();
    },[])


    const getOptions = item => {
        const view = {
            icon: 'bi bi-eye-fill',
            color: deliverView && item.id_student===deliverView.id_student? '#0FA958': '#666',
            fn: ()=> setDeliverView(item)
        }
        return [view]
    }

    const sendComment = async () => {
        if(!deliverView.id_deliver) {
            invokeToast("warning", "El estudiante aún no ha realizado entregas que se puedan comentar")
            return;
        }
        if(form.comment==='') {
            invokeToast("warning", "Comentario vacío")
            return;
        }
        setLoading(true)
        const req = {
            id_deliver: deliverView.id_deliver,
            descripcion: form.comment
        }
        const response = await insertCommentDelivApi(req)
        if(response.success && response.result) {
            invokeToast("success", "Comentario agregado!")
            setLoading(false)
            window.location.reload()
        } else {
            invokeToast("error", response.message)
            setLoading(false)
        }
    }
    const uploadMyDeliver = async (list) => {
        const ext = list[0].name.split('.')[1]
        setLoading(true)
        const req = {
            id_deliver: deliverView.id_deliver? deliverView.id_deliver: null,
            name: `${user.code}_${data.assessment.title.replace(/\s+/g, '')}.${ext}`,
            id_student: user.id,
            id_assessment: assessment
        }
        const response = await uploadDeliverApi(list,req)
        if(response.success && response.result) {
            invokeToast("success", "Documento entregado!")
            setLoading(false)
            window.location.reload()
        } else {
            invokeToast("error", response.message)
            setLoading(false)
        }

    }


    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className={user.role==="PROFESSOR"? "psp_container": 'single-cont'}>
                {user.role==="PROFESSOR" && <div className="psp_container_form">
                    <Section title={"Lista de entregas"} >
                        {data.delivers && 
                            data.delivers.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.student_name}`}
                                    text4={`${item.id_deliver? "Entregado": "Pendiente"}`}
                                    userId={item.id_student}
                                    photo={item.photo}
                                    profile={"student"}
                                    circleState={item.id_deliver? 1: 0}
                                    background={deliverView && item.id_student===deliverView.id_student? "#0fa9580f": null}
                                >
                                    <OptionsIcon listIcons={getOptions(item)}/>
                                </Card>
                            ))
                        }
                    </Section>
                </div>}
                <div className="psp_container_results">
                    {data.assessment && <Section title={data.assessment.title}>
                        <Section title={"Descripción"} small>
                            <p>{data.assessment.descripcion}</p>
                        </Section>
                        <div className="deliverable-view">
                            <div>
                                <strong>Fecha límite de entrega: </strong>
                                <span>{getDateByNumber(data.assessment.date_end)}</span>
                            </div>
                            <div>
                                <strong>Fecha de sudida por el alumno: </strong>
                                <span>{deliverView.update_date!=-1? getDateByNumber(deliverView.update_date): '-'}</span>
                            </div>
                        </div>
                        <div className="deliverable-view">
                            <Document name={deliverView.name_doc} path={deliverView.path} placeholder={`${deliverView.name_doc}...`} />
                        </div>
                        <Section title={"Observaciones del supervisor"} small>
                            {
                                deliverView.comments.map((item,key)=> (
                                    <div className="deliverable-view-comment" key={key}>
                                        <strong>{getDateByNumber(item.date)}</strong>
                                        <span>{item.descripcion}</span>
                                    </div>
                                ))
                            }
                            {
                                deliverView.comments.length===0 && <span>Sin comentarios...</span>
                            }
                            {user.role==="PROFESSOR" && !user.coordinator && <div style={{marginTop: '12px'}}>
                                <InputTextarea attribute={'comment'} rows={4} data={form} setData={setForm}/>
                            </div>}
                            {user.role==="PROFESSOR" && !user.coordinator && <div className="deliverable-view-button">
                                <Button handleClick={sendComment} title={"Comentar"} />
                            </div>}
                            {user.role==="STUDENT" && <div className="deliverable-view-button">
                                <OptionsIcon visibleText listIcons={[{ icon: 'up', text: 'Subir Doc.',
                                        fn: (list)=> uploadMyDeliver(list), color: "#699BF7"
                                }]} verticalIcons size={"32px"}/>
                            </div>}
                        </Section>
                    </Section>}
                    {!data.assessment && <span>Entregable no existe...</span>}
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}