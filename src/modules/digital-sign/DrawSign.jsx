import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Agreements.scss"
import Section from "../../components/Section";
import InputTextarea from "../../components/Inputs/InputTextarea";
import CardProfile from "../../components/CardProfile";

import { useNavigate, useParams } from "react-router-dom";
import { getAgreementStateApi } from "../../api/agreement";
import Card from "../../components/Card";
import OptionsIcon from "../../components/OptionsIcon";
import DrawFunction from "./DrawFunction";
import invokeToast from "../../utils/invokeToast";

export default function DrawSign () {
    const {user} = useAuth();
    const {code} = useParams();
    const [data, setData] = useState([])
    const [isMyEnterprise, setIsMyEnterprise] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const iam = user.role==='EMPLOYED'? "ENTERPRISE": user.role
            const response = await getAgreementStateApi(code,iam);
            if(response.success) {
                setData(response.result)
            } else invokeToast("error", response.message)
        }
        fetchData();
    }, [])

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Empresa`} small shadow>
                        {(user.role==='STUDENT' || user.role==='PROFESSOR') && <CardProfile name={data.enterprise_name} 
                        score={data.enterprise_score} photo={data.enterprise_photo} profile={"enterprise"} 
                        subTitle={`${data.enterprise_sector}, ubicado en ${data.enterprise_location}`} idUser={data.enterprise_id}/>}
                        {(user.role==='ENTERPRISE' || user.role==='EMPLOYED') && <CardProfile name={data.student_name} 
                        photo={data.student_photo} profile={"student"} idUser={data.student_id}/>}
                    </Section>
                    
                    <Section shadow title={`${data.job_title} (C${data.code})`}>
                        <div className="job_description_place">
                            <div><strong>Sueldo:</strong> <span>{data.salary}$</span></div>
                            <div><strong>Modalidad:</strong> <span>{data.modality}</span></div>
                        </div>
                    </Section>
                    <Section shadow title={`Listado de firmas`}>
                        {(!data.list || data.list.length===0) && <span>Sin firmas</span>}
                        {data.list &&
                            data.list.map((item, key) => (
                                <Card key={key} 
                                    text1={`${item.name} (${item.attr})`}
                                    photo={item.photo}
                                    userId={item.id}
                                    text4={`Firmado el: ${item.date}`}
                                    circleState={1}
                                >
                                    <OptionsIcon visibleText
                                        listIcons={[{icon: 'bi bi-person-fill', text: "Ver perfil", 
                                            fn: ()=> navigate(`/profile/${item.role.toLowerCase()}/${item.id}`)}]} 
                                    />
                                </Card>
                            ))
                        }
                    </Section>

                </div>
                <div className="psp_container_results">
                    <DrawFunction />
                    <Section small title={`Observaciones de la institución educativa`} icon={"bi bi-justify-left"}>
                        <div className="draw-sign_date">
                            <span>{data.observation_date_ie===''? 'Sin observaciones': 'Actualizado el: '}{data.observation_date_ie}</span>
                            {user.role==="SIGNATORY" && 
                                <i className={`bi bi-check-circle-fill`} onClick={()=>saveChanges('ie')}></i>}
                        </div>
                        {user.role==="SIGNATORY" && 
                            <InputTextarea rows={6} attribute={"observation_ie"} setData={setData} data={data}/>}
                            {(user.role!=="SIGNATORY") && 
                                <p>{data.observation_ie}</p>}
                    </Section>
                    <Section small title={`Observaciones del estudiante`} icon={"bi bi-justify-left"}>
                        <div className="draw-sign_date">
                            <span>{data.observation_date_st===''? 'Sin observaciones': 'Actualizado el: '}{data.observation_date_st}</span>
                            {user.role==="STUDENT" && user.id===data.student_id &&
                                <i className={`bi bi-check-circle-fill`} onClick={()=>saveChanges('st')}></i>}
                        </div>
                        {user.role==="STUDENT" && user.id===data.student_id &&
                            <InputTextarea rows={6} attribute={"observation_student"} setData={setData} data={data}/>}
                            {(user.role!=="STUDENT" || user.id!==data.student_id) && 
                                <p>{data.observation_student}</p>}
                    </Section>
                </div>
            </div>
        </div>
    )
}
