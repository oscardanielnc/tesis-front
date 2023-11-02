import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import Button from "../../components/Inputs/Button";
import { getEnterpriseBlackListApi } from "../../api/enterprise";
import { useParams } from "react-router-dom";
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";
import CardProfile from "../../components/CardProfile";
import "./scss/Practices.scss"
import InputTextarea from "../../components/Inputs/InputTextarea";
import { uploadBlackListApi } from "../../api/doc";
import { getDateByNumber } from "../../utils/generical-functions";
import Document from "../../components/Document";

export default function EnterpriseBlackList () {
    const {user} = useAuth();
    const {id} = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        async function fetchData() {
            setLoading(true)
            const response = await getEnterpriseBlackListApi(id);
            if(response.success) {
                setData(response.result)
            }
            setLoading(false)
        }
        fetchData();
    },[])

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="psp_container">
                <div className="psp_container_form">
                    {data && 
                    <Section title={"Empresa"} shadow>
                        <CardProfile name={data.enterprise.name} score={data.enterprise.score} photo={data.enterprise.photo} 
                            profile={"enterprise"} idUser={data.id} circleState={data.enterprise.state==='A'? 1: data.enterprise.state==='B'? -1: 0}
                            subTitle={`Estado ${data.enterprise.state==='A'? "Activo": data.enterprise.state==='B'? "En lista negra": "En análisis"}`} 
                        />
                    </Section>}
                </div>
                <div className="psp_container_results">
                    {data && <CreateComment onlyOne={data.comments.length===0} id={id} state={data.enterprise.state}/>}
                    {
                        data &&
                        data.comments.map((item,key)=> (
                            <Section shadow key={key} style={{marginTop: "16px"}}>
                                <Card 
                                    text1={`${item.name}`}
                                    text2={item.role}
                                    text3={`Publicado el ${getDateByNumber(item.update_date)}`}
                                    photo={item.photo}
                                ></Card>
                                <div style={{marginTop: '16px'}}>
                                    {item.action===1 && <>
                                        <span>{item.text}</span>
                                        {item.document_path!='' && <Document name={item.document_name} path={item.document_path} placeholder={`...`} />}
                                    </>
                                    }
                                    {
                                       item.action!==1 && <TagState active={item.action===3} />
                                    }
                                </div>
                            </Section>
                        ))
                    }
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}

const formDUmmy = {
    text: '',
    document_name: '',
    action: ''
}
function CreateComment({onlyOne,id,state}) {
    const [createMode, setCreateMode] = useState(false)
    const [form, setForm]  = useState(formDUmmy)
    const [file, setFile] = useState(null)
    const {user} = useAuth()

    const getRole = () => {
        console.log(user)
        if(user.role==="EVALUATOR") return "Evaluador de la institución educativa"
        if(user.role==="ENTERPRISE") return "Empresa"
        const r = user.coordinator? "Coordinador de ": "Supervisor de "
        return `${r} ${user.specialty_name}`
    }
    const getOptions = () => {
        const up = {
            icon: 'up', 
            text: 'Subir Doc.', 
            fn: (updatedList)=> setDocName(updatedList[0])
        }
        const save = {
            icon: 'bi bi-check-circle-fill',
            text: 'Guardar',
            fn: createComment
        }
        const can = {
            icon: 'bi bi-x',
            text: 'Cancelar',
            fn: ()=> setCreateMode(false)
        }
        const act = {
            icon: 'bi bi-record-circle',
            text: state==='B' ? 'Activar': 'Agr. a Lista Negra',
            color: state==='B' ? '#198754': '#dc3545',
            fn: () => addBlackList(state==='B')
        }
        const arr = [up,save,can]
        if(user.role==="EVALUATOR") arr.push(act)
        return arr
    }
    const setDocName = doc => {
        setFile(doc)
        setForm({
            ...form,
            document_name: doc.name
        })
    }
    const createComment = async () => {
        if(form.text=='') {
            invokeToast("warning", "Comentario vacío")
            return;
        }
        const req = {
            ...form,
            id_enterprise: id,
            id_user: user.id,
            name: `${user.name} ${user.lastname}`,
            role: getRole(),
            photo: user.photo,
            action: 1,
            state: state
        }
        const response = await uploadBlackListApi(file?[file]:[],req)
        if(response.success && response.result) {
            invokeToast("success", "Publicado!")
            window.location.reload()
        } else invokeToast("error", response.message)
    }
    const addBlackList = async isInBL => {
        const req = {
            ...form,
            id_enterprise: id,
            id_user: user.id,
            name: `${user.name} ${user.lastname}`,
            role: getRole(),
            photo: user.photo,
            action: isInBL? 3: 2,
            state: state
        }
        const response = await uploadBlackListApi([],req)
        if(response.success && response.result) {
            invokeToast("success", "Publicado!")
            window.location.reload()
        } else invokeToast("error", response.message)
    }

    if(createMode) return (
        <Section shadow>
            <Card 
                text1={`${user.name} ${user.lastname}`}
                text2={getRole()}
                photo={user.photo}
            >
                <OptionsIcon visibleText verticalIcons
                    listIcons={getOptions()} 
                />
            </Card>
            <InputTextarea rows={4} attribute={"text"} data={form} setData={setForm} />
            {file && <div style={{display: "flex", gap: '8px'}}>
                <strong>Documento: </strong>
                <span>{form.document_name}</span>
            </div>}
        </Section>
    )

    if(onlyOne) return (
        <Section shadow>
            <div className="black-list-only">
                <span>Esta empresa no ha sido observada con anterioridad.</span>
                <div className="profile_container_principal_plus">
                    <Button title={`Iniciar proceso de análisis`}
                        icon={"bi bi-plus"}
                        variant={"primary"}
                        circle
                        handleClick={()=>setCreateMode(true)}
                    />
                </div>
            </div>
        </Section>
    )

    return (
        <div className="profile_container_principal_plus">
            <Button title={`Continuar discusión`}
                icon={"bi bi-plus"}
                variant={"primary"}
                circle
                handleClick={()=>setCreateMode(true)}
            />
        </div>
    )
}

function TagState({active}) {

    return (
        <div className="tag-state-bl" style={{background: active? "#0FA95824": '#dc354524'}}>
            <i className="bi bi-record-circle" style={{color: active? "#0FA958": '#dc3545'}}></i>
            <span>{active? "¡Empresa absuelta. Pasa a estado activo!": "Se ha añadido a la empresa en la lista negra"}</span>
        </div>
    )
}