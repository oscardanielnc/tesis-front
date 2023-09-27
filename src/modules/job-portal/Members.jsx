import Header from "../../components/Header";
import {useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import InputText from "../../components/Inputs/InputText";
import Button from "../../components/Inputs/Button";
import InputCheck from "../../components/Inputs/InputCheck";
import { changePrivToEmployedApi, getEmployeesApi } from "../../api/employed";
import CardProfile from "../../components/CardProfile";
import ModalBasic from "../../components/Modals/ModalBasic";
import invokeToast from "../../utils/invokeToast";
import { getDateByDate, modifyItemOfArray } from "../../utils/generical-functions";

const formDummy = {
    name: '',
    job: '',
    reader: false,
    signatory: false,
    recruiter: false,
    flag: false,
}

export default function SearchJob () {
    const {user} = useAuth();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)
    const [modalPriv, setModalPriv] = useState(false);
    const [employedPriv, setEmployedPriv] = useState({});

    const onSearch = async () => {
        const response = await getEmployeesApi(form);
        if(response.success) {
            setData(response.result)
        }
    }

    const getPrivilegies = (employed) => {
        return [
            {
                icon: employed.reader? 'bi bi-check-circle-fill': 'bi bi-exclamation-octagon-fill', 
                color: employed.reader? '#198754': '#dc3545', 
                text: employed.reader? 'Verificado': 'No Verificado',
                fn: ()=>showModalEmployed(employed,1)
            },
            {
                icon: 'bi bi-badge-ad-fill', 
                color: employed.recruiter? '#699BF7': '#666', 
                text: employed.recruiter? 'Reclutador': 'No Reclutador',
                fn: ()=>showModalEmployed(employed,2)
            },
            {
                icon: 'bi bi-file-earmark-richtext-fill', 
                color: employed.signatory? '#699BF7': '#666', 
                text: employed.signatory? 'Firmante': 'No Firmante',
                fn: ()=>showModalEmployed(employed,3)
            },
        ]
    }

    const showModalEmployed = (employed,priv) => {
        if(user.role!=='ENTERPRISE') return;
        if(!employed.reader && priv!==1) {
            invokeToast("warning", "Antes de asignar un privilegio debe verificar al empleado")
            return;
        }
        else if(priv===1 && employed.reader) {
            setEmployedPriv({
                ...employed,
                reader: false,
                recruiter: false,
                signatory: false
            })
        } else if (priv===1 && !employed.reader) {
            setEmployedPriv({
                ...employed,
                reader: true
            })
        } else if(priv===2) {
            setEmployedPriv({
                ...employed,
                recruiter: !employed.recruiter
            })
        } else if(priv===3) {
            setEmployedPriv({
                ...employed,
                signatory: !employed.signatory
            })
        }
        setModalPriv(true)
    }
    const changePrivToEmployed = async () => {
        const response = await changePrivToEmployedApi(employedPriv)
        if(response.success && response.result) {
            setData(modifyItemOfArray(data, employedPriv, 'user_id'))
            setModalPriv(false)
            invokeToast("success", "Privilegio actualizado")
        } else {
            invokeToast("error", response.message)
        }
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Nombre`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                    </Section>
                    <Section title={`Puesto de trabajo`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"job"}/>
                    </Section>
                    <Section title={`Privilegios`} small shadow>
                        <div>
                            <InputCheck withInput data={form} setData={setForm} attribute={"reader"} 
                                states={[{icon: 'bi bi-check-circle-fill', color: '#198754', text: 'Lector (usuario verificado)'},
                                        {icon: 'bi bi-exclamation-octagon-fill', color: '#dc3545', text: 'Lector (usuario verificado)'}]}
                            />
                            <InputCheck withInput data={form} setData={setForm} attribute={"recruiter"} 
                                states={[{icon: 'bi bi-badge-ad-fill', color: '#699BF7', text: 'Reclutador'},
                                        {icon: 'bi bi-badge-ad-fill', color: '#666', text: 'Reclutador'}]}
                            />
                            <InputCheck withInput data={form} setData={setForm} attribute={"signatory"} 
                                states={[{icon: 'bi bi-file-earmark-richtext-fill', color: '#699BF7', text: 'Firmante'},
                                        {icon: 'bi bi-file-earmark-richtext-fill', color: '#666', text: 'Firmante'}]}
                            />
                            <InputCheck withInput data={form} setData={setForm} attribute={"flag"} 
                                states={[{text: 'Mostrar los que coincidan con las selecciones'},
                                        {text: 'Ocultar los que coincidan con las selecciones'}]}
                            />
                        </div>
                    </Section>
                    
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Resultados"}>
                        {
                            data.length===0 && <span>...</span>
                        }
                        {
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.name}`}
                                    text2={`${item.job}`}
                                    text3={`Actualización de privilegios: ${getDateByDate(item.date_update)}`}
                                    userId={item.user_id}
                                    photo={item.user_photo}
                                    circleState={-2}
                                >
                                    <OptionsIcon listIcons={getPrivilegies(item)}/>
                                </Card>
                            ))
                        }
                    </Section>
                    <ModalBasic setShow={setModalPriv} show={modalPriv} 
                        handleClick={changePrivToEmployed} title={"Cambiar privilegios"}>
                            <div style={{display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr'}}>
                                <CardProfile idUser={employedPriv.user_id} name={employedPriv.name} profile={"employed"}
                                    photo={employedPriv.user_photo} subTitle={employedPriv.job}/>
                                <div>
                                    <span>Privilegios resultantes:</span>
                                    <InputCheck data={employedPriv} attribute={"reader"} 
                                        states={[{icon: 'bi bi-check-circle-fill', color: '#198754', text: 'Lector (usuario verificado)'},
                                                {icon: 'bi bi-exclamation-octagon-fill', color: '#dc3545', text: 'Lector (usuario verificado)'}]}
                                    />
                                    <InputCheck data={employedPriv} attribute={"recruiter"} 
                                        states={[{icon: 'bi bi-badge-ad-fill', color: '#699BF7', text: 'Reclutador'},
                                                {icon: 'bi bi-badge-ad-fill', color: '#666', text: 'Reclutador'}]}
                                    />
                                    <InputCheck data={employedPriv} attribute={"signatory"} 
                                        states={[{icon: 'bi bi-file-earmark-richtext-fill', color: '#699BF7', text: 'Firmante'},
                                                {icon: 'bi bi-file-earmark-richtext-fill', color: '#666', text: 'Firmante'}]}
                                    />
                                </div>
                            </div>
                    </ModalBasic>
                </div>
            </div>
        </div>
    )
}
