import "./scss/Card.scss"
import Card from "./Card";
import OptionsIcon from "./OptionsIcon";
import { getDateByDate, getDateByNumber, modifyItemOfArray } from "../utils/generical-functions";
import { useState } from "react";
import ModalBasic from "./Modals/ModalBasic";
import CardProfile from "./CardProfile";
import Loading from "./Loading";
import useAuth from "../hooks/useAuth";
import invokeToast from "../utils/invokeToast";
import { contractStudentApi } from "../api/student";
import { useNavigate } from "react-router-dom";

export default function CardApplicant ({item, data, setRDetails, rDetails}) {
    const {user} = useAuth()
    const [view, setView] = useState(false)
    const [exp, setExp] = useState(false)
    const [modalContract, setModalContract] = useState(false);
    const [studentCont, setStudentCont] = useState({});
    const [loadingPriv, setLoadingPriv] = useState(false)
    const navigate = useNavigate()

    const getCV = (name, cv_path) => {
        if(cv_path && cv_path!='') return `${cv_path}/${name} - CV`
        else return ''
    }
    const getOptions = () => {
        return [
            {
                text: 'Descargar CV',
                icon: 'down',
                color: '#666',
                fn: () => getCV(item.name, item.cv_path)
            },
            {
                text: 'Ver perfil',
                icon: 'bi bi-person-fill',
                color: '#666',
                fn: () => navigate(`/profile/student/${item.id}`)
            },
        ]
    }
    const getStrLanguages = (arr) => {
        let str = '';
        let start = true;
        for (let elem of arr) {
            if(!start) {
                str+=', '
            }
            str += `${elem.name} (${elem.level})`
            start = false
        }
        return str;
    }

    const showModalContract = (type) => {
        if(item.hired) {
            invokeToast("warning", "Este estudiante ya fue contratado")
            return;
        } else if(user.role!=='EMPLOYED' || !user.signatory) {
            invokeToast("warning", "Solo pueden contratar los empleados con privilegio de Firmante")
            return;
        }
        if(item.relation===type) {
            invokeToast("warning", "Seleccione otro estado")
            return;
        }
        setStudentCont({...item, type: type})
        setModalContract(true)
    }
    const contractStudent = async () => {
        setLoadingPriv(true)
        const req = {
            name: data.job_title, 
            id_student: studentCont.id,
            id_enterprise: data.enterprise_id, 
            code: data.code,
            init_date: data.job_start,
            end_date: data.job_end,
            relation: studentCont.type
        }
        const response = await contractStudentApi(req)
        if(response.success && response.result) {
            const newStu = {...studentCont, hired: studentCont.type==='C', relation:studentCont.type}
            setRDetails(modifyItemOfArray(rDetails, newStu, 'id'))
            setModalContract(false)
            invokeToast("success", "Estado actualizado")
        } else invokeToast("error", response.message);
        setLoadingPriv(false)
    }

    const getState = (st) => {
        if(st==='P') return 'Postulante'
        if(st==='R') return 'Precalificado'
        if(st==='C') return 'Contratado'
        return 'CV no apto'
    }
    return (
        <div className="psp-card-applicant">
            <Card text1={`${item.name}`}
                text2={`${item.specialty} - ${item.cycle!=100? `${item.cycle}° ciclo`: 'Egresado'}`}
                text3={`Edad: ${item.age}. Vive en ${item.location}`}
                text4={`Última modificación de CV: ${item.cv_update!=''? getDateByDate(item.cv_update): 'No tiene'}`}
                photo={item.photo}
                noBorder
                circleState={-2}
            >
                <OptionsIcon listIcons={getOptions(item)} visibleText verticalIcons/>
            </Card>
            <div className="psp-card-applicant_extra">
                <div className="psp-card-applicant_extra-left">
                    <div className="psp-card-applicant_extra-left-data">
                        <li>Correo: {item.email}</li>
                        <li>Teléfono: {item.phone}</li>
                        <li>DNI: {item.dni}</li>
                        <li>Idiomas: {getStrLanguages(item.languages)}</li>
                    </div>
                    <div className="psp-card-applicant_extra-left-exp">
                        <div className="psp-card-applicant_extra-left-exp-title" onClick={()=>setExp(!exp)}>
                            <i className="bi bi-caret-down-fill"></i>
                            <span>Experiencia laboral: {item.experience===0? 'No registra': ''}</span>
                        </div>
                        {exp && <div className="psp-card-applicant_extra-left-exp-options">
                            {
                                item.experience.map((item,key) => (
                                    <li className="psp-card-applicant_extra-left-exp-options-item" key={key}>
                                        <span><i className="bi bi-circle-fill"></i> {item.title} ({item.enterprise_name})</span>
                                        <strong>Desde el {getDateByNumber(item.date_init)} hasta {item.date_end!=''? getDateByNumber(item.date_end): 'la actualidad'}</strong>
                                    </li>
                                ))
                            }
                        </div>}
                    </div>
                </div>
                <div className="psp-card-applicant_extra-right">
                    <strong>Estado:</strong>
                    <div className="psp-card-applicant_extra-right-tabs">
                        <div className={`psp-card-applicant_extra-right-tabs-selected ${item.relation}`} 
                            onClick={()=>setView(!view)}>
                            <i className="bi bi-caret-down-fill"></i>
                            <span>{getState(item.relation)}</span>
                        </div>
                        {view && <div className="psp-card-applicant_extra-right-tabs-options">
                            <div className="psp-card-applicant_extra-right-tabs-options-item" 
                                onClick={()=> showModalContract('P')}>Postulante</div>
                            <div className="psp-card-applicant_extra-right-tabs-options-item" 
                                onClick={()=> showModalContract('R')}>Precalificado</div>
                            <div className="psp-card-applicant_extra-right-tabs-options-item" 
                                onClick={()=> showModalContract('C')}>Contratado</div>
                            <div className="psp-card-applicant_extra-right-tabs-options-item" 
                                onClick={()=> showModalContract('N')}>CV no apto</div>
                        </div>}
                    </div>
                    <ModalBasic setShow={setModalContract} show={modalContract} noButtons={loadingPriv}
                            handleClick={contractStudent} title={`Cambiar el estado a: ${getState(studentCont.type)}`}>
                                {!loadingPriv && <CardProfile idUser={studentCont.id} name={studentCont.name} profile={"student"}
                                    photo={studentCont.photo} subTitle={studentCont.type==='C'? "Esta acción es irreversible": "El estado puede cambiarse después"}/>}
                                {loadingPriv && <Loading size={150} />}
                    </ModalBasic>
                </div>
            </div>
        </div>
    )
}