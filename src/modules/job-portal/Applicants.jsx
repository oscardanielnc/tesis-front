import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import Section from "../../components/Section";
import Button from "../../components/Inputs/Button";
import CardProfile from "../../components/CardProfile";
import ModalBasic from "../../components/Modals/ModalBasic"
import {getJobByCodeApi} from "../../api/job"
import { useNavigate, useParams } from "react-router-dom";
import { getLanguagesApi, getLocationsApi } from "../../api/sysData";
import { getSpecialtiesApi } from "../../api/specialty";
import { addingInitArr, modifyItemOfArray } from "../../utils/generical-functions";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import InputMultiSelect from "../../components/Inputs/InputMultiSelect";
import { orderByApplicants, typeOfApplicants } from "../../utils/global-consts";
import { contractStudentApi, getStudentsApi } from "../../api/student";
import Card from "../../components/Card";
import OptionsIcon from "../../components/OptionsIcon";
import invokeToast from "../../utils/invokeToast";

const formDummy = {
    student: '',
    location: '',
    languages: [],
    specialty: '',
    oderby: '',
    type: ''
}

export default function Applicants () {
    const {user} = useAuth();
    const {code} = useParams();
    const [form, setForm] = useState(formDummy)
    const [data, setData] = useState({})
    const [rDetails, setRDetails] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [locations, setLocations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [modalContract, setModalContract] = useState(false);
    const [studentCont, setStudentCont] = useState({});
    const navigate = useNavigate(); 

    useEffect(() => {
        async function fetchData() {
            const response = await getSpecialtiesApi()
            if(response.success) {
                const specialtiesPre = response.result;
                setSpecialties(specialtiesPre)
                if(specialtiesPre.length>0) {
                    setForm({
                        ...form,
                        specialty: specialtiesPre[0].value,
                        cycle: 1,
                    })
                }
            }
        }
        fetchData();
      }, []);

    useEffect(() => {
        async function fetchData() {
            const response = await getJobByCodeApi(code);
            if(response.success) {
                setData(response.result)
            }
        }
        fetchData();
    }, [])
    useEffect(() => {
        async function fetchData() {
            //locations
            const response1 = await getLocationsApi();
            if(response1.success) {
                setLocations(response1.result)
            }
            //languages
            const response2 = await getLanguagesApi();
            if(response2.success) {
                setLanguages(response2.result)
            }
        }
        fetchData();
    }, [])

    const onSearch = async () => {
        const response = await getStudentsApi(form);
        if(response.success) {
            setRDetails(response.result)
        }
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
    const getOptions = (student) => {
        return [
            {
                text: student.hired? 'Contratado': 'Contratar',
                icon: 'bi bi-briefcase-fill',
                color: student.hired? '#198754': '#666',
                fn: () => showModalContract(student)
            },
            {
                text: 'Descargar CV',
                icon: 'bi bi-download',
                color: '#666'
            },
            {
                text: 'Ver perfil',
                icon: 'bi bi-person-fill',
                color: '#666',
                fn: () => navigate(`/profile/student/${student.id}`)
            },
        ]
    }

    const showModalContract = (student) => {
        if(student.hired) {
            invokeToast("warning", "Este estudiante ya fue contratado")
            return;
        } else if(user.role!=='EMPLOYED' || !user.signatory) {
            invokeToast("warning", "Solo pueden contratar los empleados con privilegio de Firmante")
            return;
        }
        else if(!student.hired) {
            setStudentCont(student)
            setModalContract(true)
        }
    }
    const contractStudent = async () => {
        const response = await contractStudentApi({student: studentCont.id, enterprise: data.enterprise_id})
        if(response.success && response.result) {
            setRDetails(modifyItemOfArray(rDetails, {...studentCont, hired: true}, 'id'))
            setModalContract(false)
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
                    <Section title={`Nombre del postulante`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"student"}/>
                    </Section>
                    <Section title={"Idiomas de la empresa"} small shadow>
                        <InputMultiSelect list={addingInitArr(languages)} setData={setForm} attribute={"languages"} data={form} />
                    </Section>
                    <Section title={"Ubicación"} small shadow>
                        <InputCombo list={locations} setData={setForm} attribute={"location"} data={form} />
                    </Section>
                    <Section title={"Especialidad"} small shadow>
                        <InputCombo list={addingInitArr(specialties)} setData={setForm} attribute={"specialty"} data={form} />
                    </Section>
                    <Section title={"Tipo de postulantes"} small shadow>
                        <InputCombo list={typeOfApplicants} setData={setForm} attribute={"type"} data={form} />
                    </Section>
                    <Section title={"Ordenar por"} small shadow>
                        <InputCombo list={orderByApplicants} setData={setForm} attribute={"oderby"} data={form} />
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section title={`${data.job_title} (${data.code})`}>
                        <div className="job_description">
                            <div className="job_description_place">
                                <div><strong>Sueldo:</strong> <span>{data.salary}$</span></div>
                                <div><strong>Modalidad:</strong> <span>{data.modality}</span></div>
                                <div><strong>Vacantes:</strong> <span>{data.vacancies}</span></div>
                            </div>
                            <div className="job_description_place">
                                <div><strong>Fin de postulación:</strong> <span>{data.date_end}</span></div>
                                <div><strong>Postulantes registrados:</strong> <span>{data.registered} / {data.max_applicants}</span></div>
                                <div><strong>Periodo laboral:</strong> <span>desde el {data.job_start} hasta el {data.job_end}</span></div>
                            </div>
                        </div>
                        <Section title={"Resultados"}>
                            { 
                                rDetails.map((item, index) => (
                                    <Card key={index} 
                                        text1={`${item.name}`}
                                        text2={`${item.specialty} - ${item.cycle}° ciclo`}
                                        text3={`Idiomas: ${getStrLanguages(item.languages)}`}
                                        text4={`Última modificación de CV: ${item.cv_update}`}
                                        photo={item.photo}
                                        circleState={-2}
                                    >
                                        <OptionsIcon listIcons={getOptions(item)} visibleText verticalIcons/>
                                    </Card>
                                ))
                            }
                        </Section>
                        <ModalBasic setShow={setModalContract} show={modalContract} 
                            handleClick={contractStudent} title={"Contratar estudiante"}>
                                <CardProfile idUser={studentCont.id} name={studentCont.name} profile={"student"}
                                    photo={studentCont.photo} subTitle="Esta acción es irreversible"/>
                        </ModalBasic>
                    </Section>
                </div>
            </div>
        </div>
    )
}
