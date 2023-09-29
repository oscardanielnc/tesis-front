import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Button from "../../components/Inputs/Button";
import InputCombo from "../../components/Inputs/InputCombo";
import InputText from "../../components/Inputs/InputText";
import Section from "../../components/Section";
import useAuth from "../../hooks/useAuth";
import { optionsToSysConfig } from "../../utils/global-consts";
import Card from "../../components/Card";
import { getEmailsSystemApi, getLanguagesApi, getLocationsApi, 
    getSectorsApi, maintenanceSysDataApi, updateEmailsSystemApi } from "../../api/sysData";
import OptionsIcon from "../../components/OptionsIcon";
import ModalBasic from "../../components/Modals/ModalBasic"
import IconSystem from "../../components/IconSystem";
import invokeToast from "../../utils/invokeToast"

const formDummy = {
    option: 'IDIOMAS',
    name: ''
}
const elemDummy = {
    value: '',
    name: '',
    type: ''
}

export default function SysDataAdmin () {
    const [form, setForm] = useState(formDummy)
    const [data, setData] = useState([]);
    const [config, setConfig] = useState({support: "",domain: ""})
    const [elemAfect, setElemAfect] = useState(elemDummy)
    const [executeType, setExecuteType] = useState("edit")
    const [show, setShow] = useState(false)
    const {user} = useAuth()

    useEffect(()=> {
        async function fetchData() {
            const response = await getEmailsSystemApi();
            if(response.success) {
                let configuration = {}
                for(let item of response.result) {
                    configuration[item.attr] = item.value
                }
                setConfig(configuration)
            }
        }
        fetchData();
    }, [])

    useEffect(()=> {
        setData([])
    }, [form.option])

    const onSearchSave = async () => {
        let fnSearch = updateEmailsSystemApi;
        let req = form
        if(form.option==='UBICACIONES') fnSearch = getLocationsApi;
        else if (form.option==='IDIOMAS') fnSearch = getLanguagesApi;
        else if (form.option==='SECTORES') fnSearch = getSectorsApi;
        else if (form.option==='PARÁMETROS') req = config;
        const response = await fnSearch(req);
        if(form.option==='PARÁMETROS' && response.success && response.result) {
            invokeToast('success', 'Se han actualizado los parámetros del sistema')
            return;
        }

        if(response.success) {
            setData(response.result)
            return;
        }

        invokeToast("error", response.message)
    }

    const getOptionsItem = item => {
        const trash = {
            icon: 'bi bi-trash-fill',
            fn: ()=> activateOptions('delete',item)
        }
        const pencil = {
            icon: 'bi-pencil-fill',
            fn: ()=> activateOptions('edit',item)
        }
        const arr = []
        if(data.length>1) arr.push(trash)
        arr.push(pencil)

        return arr
    }
    const activateOptions = (exType, item) => {
        const iType = form.option==='IDIOMAS'? 'lan': form.option==='UBICACIONES'? 'loc': 'sec'
        setElemAfect({...item, type: iType})
        setExecuteType(exType)
        setShow(true)
    }

    const execute = async () => {
        if(elemAfect.name==='') {
            invokeToast('warning', 'El nombre no puede ser un campo vacío')
            return;
        }
        const response = await maintenanceSysDataApi({...elemAfect, execute: executeType})
        if(response.success && response.result) {
            window.location.reload()
        }
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`CONFIGURACIÓN`} shadow>
                        <InputCombo data={form} setData={setForm} attribute={"option"} list={optionsToSysConfig}/>
                    </Section>
                    {form.option!=='PARÁMETROS' && <Section title={`Nombre`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                    </Section>}
                    <Section shadow>
                        <Button variant={"primary"} icon={form.option!=='PARÁMETROS'? "bi bi-search": 'bi bi-check-circle-fill'} 
                            title={form.option!=='PARÁMETROS'? "Buscar": 'Guardar'} center handleClick={onSearchSave}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    {form.option!=='PARÁMETROS' && <Section icon={"bi bi-justify-left"}
                        title={"Resultados"}>
                        <div className="profile_container_principal_plus">
                            <Button title={`Nuev${form.option==='IDIOMAS'? 'o idioma': form.option==='UBICACIONES'? 'a ubicación': 'o sector'}`}
                                icon={"bi bi-plus"}
                                variant={"primary"}
                                circle
                                handleClick={()=>activateOptions('add', elemDummy)}
                            />
                        </div>
                        {
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.name}`}
                                    icon={-1}
                                    circleState={-2}
                                >
                                    <OptionsIcon listIcons={getOptionsItem(item)}/>
                                </Card>
                            ))
                        }
                    </Section>}
                    {form.option==='PARÁMETROS' && <Section icon={"bi bi-justify-left"}
                        title={"Parámetros del sistema"}>
                        <Section title={`Dominio institucional`} small>
                            <InputText data={config} setData={setConfig} attribute={"domain"}/>
                        </Section>
                        <Section title={`Email de contacto/soporte`} small>
                            <InputText data={config} setData={setConfig} attribute={"support"}/>
                        </Section>
                    </Section>}
                    <ModalBasic setShow={setShow} show={show} handleClick={execute} 
                        title={`${executeType==='edit'? 'Modificar': executeType==='add'? 'Añadir': 'Eliminar'} ${elemAfect.type==='lan'? 'lenguage': elemAfect.type==='loc'? 'ubicación': 'sector'}`}>
                            <div style={{display: 'grid', gap: '16px'}}>
                                {executeType!=='delete' && <div style={{display: 'flex', gap: '12px'}}>
                                    <IconSystem type={-1} />
                                    <InputText data={elemAfect} setData={setElemAfect} attribute={"name"}/>
                                </div>}
                                {executeType==='delete' && <span>Se eliminará "{elemAfect.name}"</span>}
                            </div>
                    </ModalBasic>
                </div>
            </div>
        </div>
    )
}