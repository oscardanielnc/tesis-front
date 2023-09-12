import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import Section from "../../components/Section";
import Button from "../../components/Inputs/Button";
import CardProfile from "../../components/CardProfile";

import {applyJobApi, getJobByCodeApi} from "../../api/job"
import { useNavigate, useParams } from "react-router-dom";
import EditJob from "./EditJob";

export default function Job () {
    const {user} = useAuth();
    const {code} = useParams();
    const [data, setData] = useState([])
    const [isMyEnterprise, setIsMyEnterprise] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const response = await getJobByCodeApi(code);
            if(response.success) {
                setData(response.result)
                if(user.role==='ENTERPRISE') setIsMyEnterprise(user.id===response.result.enterprise_id)
                else if(user.role==='EMPLOYED') setIsMyEnterprise(user.enterprise_id===response.result.enterprise_id && user.reader)
            }
        }
        fetchData();
    }, [])

    const handleClick = async () => {
        const response = await applyJobApi({idUser: user.id, code});
        if(response.success && response.result) {
            window.location.reload()
        }
    }


    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} idEnterprise={user.enterprise_id}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Empresa`} small shadow>
                        <CardProfile name={data.enterprise_name} score={data.enterprise_score} photo={data.enterprise_photo} profile={"enterprise"}
                        subTitle={`${data.enterprise_sector}, ubicado en ${data.enterprise_location}`} idUser={data.enterprise_id}/>
                    </Section>
                    
                    <Section shadow>
                        {user.role === "STUDENT" && (new Date(data.date_end) < new Date()) && 
                            <Button variant={data.alredy_applied? "danger":"primary"} center handleClick={handleClick}
                            icon={data.alredy_applied? "bi bi-bookmark-x-fill": "bi bi-bookmark-check-fill"} 
                            title={data.alredy_applied? "Cancelar postulación": "Postular"}/>}
                        {!isMyEnterprise && (new Date(data.date_end) > new Date()) && 
                            <span>Oferta laboral finalizada</span>}
                        <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
                            {isMyEnterprise && (user.role === "EMPLOYED" && !user.recluiter) && !editMode && 
                                (new Date(data.date_end) < new Date()) && <Button variant={"primary"} title={"Editar"}
                                handleClick={()=>setEditMode(true)} icon={"bi bi-pencil-fill"}/>}
                            {isMyEnterprise && <Button variant={"primary"} handleClick={()=>navigate(`/job-portal/applicants/${code}`)}
                                icon={"bi bi-file-text-fill"} 
                                title={"Ver postulates"}/>}
                        </div>
                    </Section>
                </div>
                <div className="psp_container_results">
                    {!editMode && <Section title={`${data.job_title} (${data.code})`}>
                        <div className="job_description">
                            <div className="job_description_place">
                                <div><strong>Sueldo:</strong> <span>{data.salary}$</span></div>
                                <div><strong>Modalidad:</strong> <span>{data.modality}</span></div>
                                <div><strong>Vacantes:</strong> <span>{data.vacancies>0? data.vacancies: 'No especificado'}</span></div>
                            </div>
                            <div className="job_description_place">
                                <div><strong>Fin de postulación:</strong> <span>{data.date_end}</span></div>
                                <div><strong>Postulantes registrados:</strong> <span>{data.registered} {data.max_applicants>0? `/ ${data.max_applicants}`: ''}</span></div>
                                <div><strong>Periodo laboral:</strong> <span>desde el {data.job_start} hasta el {data.job_end}</span></div>
                            </div>
                        </div>
                        <div className="job_benefits">
                            { data.sections && 
                                data.sections.map((item, key) => (
                                    <Section title={item.title} key={key} small icon={"bi bi-justify-left"}>
                                        <p className="job_benefits_p">{item.description}</p>
                                    </Section>
                                ))
                            }
                        </div>
                    </Section>}
                    {editMode && <EditJob initForm={data} setEditMode={setEditMode}/>}
                </div>
            </div>
        </div>
    )
}
