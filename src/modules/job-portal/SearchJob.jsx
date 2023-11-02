import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import { getLanguagesApi, getLocationsApi, getSectorsApi } from "../../api/sysData";
import { modalitiesType } from "../../utils/global-consts";
import Button from "../../components/Inputs/Button";
import { addingInitArr, getDateByDate } from "../../utils/generical-functions";
import InputRange from "../../components/Inputs/InputRange";
import { getJobsApi } from "../../api/job";
import { useNavigate } from "react-router-dom";
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";

const formDummy = {
    job: '',
    enterprise: '',
    location: '',
    languages: [],
    modality: '',
    sector: '',
    salary_min: '',
    salary_max: '',
    date_init: '',
    date_end: ''
}

export default function SearchJob () {
    const {user} = useAuth();
    const [isStudent, setIsStudent] = useState(user.role === 'STUDENT')
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)
    const [locations, setLocations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            //locations
            const response1 = await getLocationsApi({name: '', active:true});
            if(response1.success) {
                setLocations(response1.result)
            }
            //languages
            // const response2 = await getLanguagesApi({name: '', active: true});
            // if(response2.success) {
            //     setLanguages(response2.result)
            // }
            //sector
            const response3 = await getSectorsApi({name: '', active: true});
            if(response3.success) {
                setSectors(response3.result)
            }
        }
        fetchData();
    }, [])

    const onSearch = async () => {
        setLoading(true)
        const req = {
            ...form,
            iamEnterprise: user.role==="ENTERPRISE" || user.role==="EMPLOYED",
            enterprise_id: user.enterprise_id
        }
        const response = await getJobsApi(req);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
        setLoading(false)
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Puesto de trabajo ${!isStudent? "o código": ""}`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"job"}/>
                    </Section>
                    {isStudent && <Section title={"Empresa"} small shadow>
                        <InputText data={form} setData={setForm} attribute={"enterprise"}/>
                    </Section>}
                    {isStudent && <Section title={"Ubicación"} small shadow>
                        <InputCombo list={locations} setData={setForm} attribute={"location"} data={form} />
                    </Section>}
                    {/* {isStudent && <Section title={"Idiomas de la empresa"} small shadow>
                        <InputMultiSelect list={addingInitArr(languages)} setData={setForm} attribute={"languages"} data={form} />
                    </Section>} */}
                    <Section title={"Modalidad"} small shadow>
                        <InputCombo list={modalitiesType} setData={setForm} attribute={"modality"} data={form} />
                    </Section>
                    {isStudent && <Section title={"Sector de la empresa"} small shadow>
                        <InputCombo list={sectors} data={form} setData={setForm} attribute={"sector"}/>
                    </Section>}
                    <Section title={"Rango salarial"} small shadow>
                        <InputRange data={form} setData={setForm} attribute1={"salary_min"} attribute2={"salary_max"}/>
                    </Section>
                    <Section title={"Fecha de fin de postulación"} small shadow>
                        <InputRange data={form} setData={setForm} attribute1={"date_init"} attribute2={"date_end"} type="date"/>
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"} title={"Resultados"}>
                        {user.role==="EMPLOYED" && user.recruiter && 
                        <div className="div_plus">
                            <Button title={"Nueva convocatoria"}
                                icon={"bi bi-plus"}
                                variant={"primary"}
                                circle
                                handleClick={()=> navigate('/job-portal/create')}
                            />
                        </div>}
                        {!loading && 
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.job_title} (C${item.code}) - ${item.salary} S/.`}
                                    text2={`${item.enterprise_name} (${item.location}) • ${item.modality}`}
                                    text3={`Postulación: desde el ${getDateByDate(item.date_init)} hasta el ${getDateByDate(item.date_end)}`}
                                    text4={item.description+'...'}
                                    userId={item.enterprise_id}
                                    profile={"enterprise"}
                                    photo={item.enterprise_photo}
                                    circleState={-2}
                                >
                                    <OptionsIcon visibleText listIcons={[{icon: 'bi bi-box-arrow-in-right', 
                                        text: 'Ver', fn: ()=> navigate(`/job-portal/job/${item.code}`)}]} />
                                </Card>
                            ))
                        }
                        {loading && <Loading size={180} />}
                    </Section>
                </div>
            </div>
        </div>
    )
}
