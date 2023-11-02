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
import Loading from "../../components/Loading";
import CardApplicant from "../../components/CardApplicant";

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
    // const [modalContract, setModalContract] = useState(false);
    // const [studentCont, setStudentCont] = useState({});
    const [loading, setLoading] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    // const [loadingPriv, setLoadingPriv] = useState(false)
    const navigate = useNavigate(); 

    useEffect(() => {
        async function fetchData() {
            const response = await getSpecialtiesApi({active: true, name: ''})
            if(response.success) {
                const specialtiesPre = response.result;
                setSpecialties(specialtiesPre)
            }
        }
        fetchData();
      }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const response = await getJobByCodeApi(code);
            if(response.success) {
                setData(response.result)
            } else invokeToast("error", response.message)
            setLoading(false)
        }
        fetchData();
    }, [])
    useEffect(() => {
        async function fetchData() {
            //locations
            const response1 = await getLocationsApi({name: '', active:true});
            if(response1.success) {
                setLocations(response1.result)
            }else invokeToast("error", response1.message)
            //languages
            const response2 = await getLanguagesApi({name: '', active: true});
            if(response2.success) {
                setLanguages(response2.result)
            }else invokeToast("error", response2.message)
        }
        fetchData();
    }, [])

    const onSearch = async () => {
        setLoadingSearch(true)
        const response = await getStudentsApi({...form,code});
        if(response.success) {
            setRDetails(response.result)
        } else invokeToast("error", response.message)
        setLoadingSearch(false)
    }

    
    

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Empresa`} small shadow>
                        <CardProfile name={data.enterprise_name} score={data.enterprise_score} photo={data.enterprise_photo} profile={"enterprise"}
                        subTitle={`${data.enterprise_sector}, ubicado en ${data.enterprise_location}`} idUser={data.enterprise_id}/>
                    </Section>
                    <Section title={`Nombre del postulante`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"student"}/>
                    </Section>
                    <Section title={"Idiomas que domina"} small shadow>
                        <InputMultiSelect list={addingInitArr(languages)} setData={setForm} attribute={"languages"} data={form} />
                    </Section>
                    <Section title={"Ubicación"} small shadow>
                        <InputCombo list={addingInitArr(locations)} setData={setForm} attribute={"location"} data={form} />
                    </Section>
                    <Section title={"Especialidad"} small shadow>
                        <InputCombo list={addingInitArr(specialties)} setData={setForm} attribute={"specialty"} data={form} />
                    </Section>
                    <Section title={"Estado del postulante"} small shadow>
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
                    <Section title={`${data.job_title} (C${data.code})`}>
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
                            { !loadingSearch && 
                                rDetails.map((item, index) => (
                                    <CardApplicant item={item} key={index} data={data} setRDetails={setRDetails} rDetails={rDetails}/>
                                ))
                            }
                            {loadingSearch && <Loading size={180} />}
                        </Section>
                        
                    </Section>
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}
