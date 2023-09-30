import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Agreements.scss"
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import { getLocationsApi } from "../../api/sysData";
import { agreementStatesType, modalitiesType } from "../../utils/global-consts";
import Button from "../../components/Inputs/Button";
import InputRange from "../../components/Inputs/InputRange";
import { getAgreementsApi } from "../../api/agreement";
import { useNavigate } from "react-router-dom";
import invokeToast from "../../utils/invokeToast"

const formDummy = {
    job: '',
    enterprise: '',
    student: '',
    employed: '',
    location: '',
    modality: '',
    salary_min: '',
    salary_max: '',
    state: '',
    date_end: '',
    date_init: ''
}

export default function Agreements () {
    const {user} = useAuth();
    const [isStudent, setIsStudent] = useState(user.role === 'STUDENT')
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)
    // const [locations, setLocations] = useState([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         //locations
    //         const response1 = await getLocationsApi({name: '', active:true});
    //         if(response1.success) {
    //             setLocations(response1.result)
    //         }
    //     }
    //     fetchData();
    // }, [])

    const onSearch = async () => {
        const req = {
            ...form,
            iam: user.role==='EMPLOYED'? "ENTERPRISE": user.role,
            myId: user.role==='EMPLOYED'? user.enterprise_id: user.id,
        }
        const response = await getAgreementsApi(req);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
    }

    const getOptions = item => {
        const download = {
            icon: 'bi bi-download',
            text: 'Descargar',
            fn: ()=> {},
        }
        const sign = {
            icon: 'bi bi-file-earmark-richtext-fill',
            text: 'Firmar',
            fn: ()=>navigate(`/digital-sign/draw/${item.id_agreement}`),
        }
        const upload = {
            icon: 'bi bi-cloud-upload',
            text: 'Subir Conv.',
            fn: ()=> {},
        }
        const arr = []

        if(user.role==="EMPLOYED" && user.signatory && (item.state_id==3 || item.state_id==4 || item.state_id==5 || item.state_id==6)) {
            arr.push(upload)
        }
        if(item.doc_path && item.doc_path!='') {
            arr.push(download)
        }
        if(item.doc_path && item.doc_path!='') {
            arr.push(sign)
        }
        return arr
    }
    const getSubName = (item) => {
        if(user.role==='SIGNATORY') return ` con ${item.enterprise_name}`
        return item.location && item.location!=''? `(${item.location})`: ''
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={"Puesto de trabajo o código"} small shadow>
                        <InputText data={form} setData={setForm} attribute={"job"}/>
                    </Section>
                    {(user.role==='STUDENT' || user.role==='SIGNATORY') && <Section title={"Empresa"} small shadow>
                        <InputText data={form} setData={setForm} attribute={"enterprise"}/>
                    </Section>}
                    {(user.role==='EMPLOYED' || user.role==='ENTERPRISE') && <Section title={"Nombre del postulante"} small shadow>
                        <InputText data={form} setData={setForm} attribute={"student"}/>
                    </Section>}
                    {/* {!isStudent && <Section title={"Firmante de la empresa"} small shadow>
                        <InputText data={form} setData={setForm} attribute={"employed"}/>
                    </Section>} */}
                    {/* {isStudent && <Section title={"Ubicación"} small shadow>
                        <InputCombo list={locations} setData={setForm} attribute={"location"} data={form} />
                    </Section>} */}
                    <Section title={"Estado del convenio"} small shadow>
                        <InputCombo list={agreementStatesType} setData={setForm} attribute={"state"} data={form} />
                    </Section>
                    <Section title={"Modalidad"} small shadow>
                        <InputCombo list={modalitiesType} setData={setForm} attribute={"modality"} data={form} />
                    </Section>
                    <Section title={"Rango salarial"} small shadow>
                        <InputRange data={form} setData={setForm} attribute1={"salary_min"} attribute2={"salary_max"}/>
                    </Section>
                    <Section title={"Perido de trabajo"} small shadow>
                        <InputRange data={form} setData={setForm} attribute1={"date_init"} attribute2={"date_end"} type="date"/>
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Resultados"}>
                        {
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.job_title} (C${item.code}) - ${item.salary}$`}
                                    text2={`${item.user_name} ${getSubName(item)}`}
                                    text3={`desde ${item.job_start} al ${item.job_end}`}
                                    text4={`(${item.state})`}
                                    userId={item.user_id}
                                    photo={item.user_photo}
                                    profile={user.role==="STUDENT"? "enterprise": "student"}
                                    circleState={item.state_id==2 || item.state_id==6? -1: item.state_id}
                                >
                                    <OptionsIcon listIcons={getOptions(item)} visibleText verticalIcons size='20px'/>
                                </Card>
                            ))
                        }
                    </Section>
                </div>
            </div>
        </div>
    )
}