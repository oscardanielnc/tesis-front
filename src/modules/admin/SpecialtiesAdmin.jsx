import { useState } from "react";
import Section from "../../components/Section";
import "./scss/Admin.scss";
import Card from "../../components/Card";
import OptionsIcon from "../../components/OptionsIcon";
import useAuth from "../../hooks/useAuth";
import InputText from "../../components/Inputs/InputText";
import InputCheck from "../../components/Inputs/InputCheck";
import Header from "../../components/Header";
import ModalBasic from "../../components/Modals/ModalBasic";
import invokeToast from "../../utils/invokeToast";
import Button from "../../components/Inputs/Button";
import { createSpecialtyApi, getSpecialtiesApi, updateSpecialtyApi } from "../../api/specialty";
import { updateProfessorApi } from "../../api/professor";
import Loading from "../../components/Loading";

const speDummy = {
    value: '',
    name: '',
    cycles: '1',
    active: true,
}

export default function SpecialtiesAdmin () {
    const {user} = useAuth()
    const [form, setForm] = useState({name: '', admin: true})
    const [show, setShow] = useState(false)
    const [data, setData] = useState([])
    const [elem, setElem] = useState(null)
    const [execute, setExecute] = useState("edit")
    const [showSpe, setShowSpe] = useState(false)
    const [spe, setSpe] = useState(speDummy)
    const [loading, setLoading] = useState(false)

    const search = async () => {
        setLoading(true)
        const response = await getSpecialtiesApi(form);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
        setLoading(false)
    }

    const getOptions = (prof) => {
        return [
            {
                icon: 'bi bi-briefcase-fill',
                color: !prof.coordinator? '#666666': '#0FA958', 
                text: 'Coordinador',
                fn: ()=> evaluateCoordinator(prof)
            },
            {
                icon: !prof.active? 'bi bi-check-circle-fill': 'bi bi-exclamation-octagon-fill',
                color: !prof.active? '#198754': '#dc3545', 
                text: !prof.active? 'Activar': 'Desactivar',
                fn: ()=> evaluateActivate(prof)
            },
        ]
    }

    const evaluateCoordinator = prof => {
        if(!prof.active) {invokeToast('warning', 'Solo se puede asignar el rol de coordinador a un profesor activo'); return}
        if(prof.coordinator) {invokeToast('warning', 'Debe asignar el rol de coordinator a otro profesor'); return}
        {setElem(prof); setShow(true); setExecute("coor")}
    }
    const evaluateActivate = prof => {
        if(prof.coordinator && prof.active) {invokeToast('warning', 'No puede dejar inactivo a un coordinador'); return}
        {setElem(prof); setShow(true); setExecute("act")}
    }

    const fnExecute = async () => {
        if(execute==='coor' || execute==='act' ) {
            const req = {
                active: execute==='act'? !elem.active: elem.active, 
                coordinator: execute==='coor', 
                id: elem.id,
                specialty: elem.id_specialty
            }
            const response = await updateProfessorApi(req)
            if(response.success && response.result) {
                window.location.reload()
            } else invokeToast("error", response.message)
        } else {
            if(spe.name==='') {
                invokeToast('warning', 'El nombre no puede ser un campo vacío'); return;
            }
            if(spe.cycles==='') {
                invokeToast('warning', 'Debe colocar el número de ciclos de esta especialidad'); return;
            }
            if (execute==='edit' ) {
                const response = await updateSpecialtyApi(spe)
                if(response.success && response.result) {
                    window.location.reload()
                } else invokeToast("error", response.message)
            } else if (execute==='add' ) {
                const response = await createSpecialtyApi(spe)
                if(response.success && response.result) {
                    window.location.reload()
                } else invokeToast("error", response.message)
            }
        }
    }
    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="single-cont">
                <Section title={"Buscar especialidades"}>
                    <div className="box-to-search">
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                        <i className="bi bi-search" onClick={search}></i>
                    </div>
                    <div className="profile_container_principal_plus">
                        <Button title={`Nueva especialidad`}
                            icon={"bi bi-plus"}
                            variant={"primary"}
                            circle
                            handleClick={()=> {setShowSpe(true); setExecute("add"); setSpe(speDummy)}}
                        />
                    </div>
                    <div className="box-to-result">
                        {!loading && 
                            data.map((item, key)=> (
                                <div className="specialty-admin" key={key}>
                                    <div className="specialty-admin_title">
                                        <div className="psp-card_details_text4">
                                            <i className="bi bi-circle-fill" style={{color: item.active? "#198754": "#dc3545"}}></i> 
                                            <span>{item.active? "(Activo)": "(Inactivo)"}</span>
                                        </div>
                                        <strong>{`${item.name} (${item.cycles} ciclos)`}</strong>
                                        <i className={`bi bi-pencil-fill pencil`}
                                            onClick={()=> {setShowSpe(true); setExecute("edit"); setSpe(item)}}></i>
                                    </div>
                                    <div className="specialty-admin_professors">
                                        {
                                            item.professors.map((prof, index)=> (
                                                <Card key={index} 
                                                    text1={`${prof.name} ${prof.last_name} (${prof.coordinator? "Coordinador": "Supervisor"})`}
                                                    text3={`Actualización de privilegios: ${prof.update_date}`}
                                                    text4={prof.active? '(Activo)': '(Inactivo)'}
                                                    photo={prof.photo}
                                                    circleState={prof.active? 1: -1}
                                                >
                                                    <OptionsIcon size="22px" visibleText verticalIcons
                                                        listIcons={getOptions(prof)} 
                                                    />
                                                </Card>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        {loading && <Loading size={180} />}
                    </div>
                </Section>
                {elem && <ModalBasic handleClick={fnExecute} setShow={setShow} show={show} title={`Modificar estado de ${elem.name} ${elem.last_name}`}>
                    {execute==="act" && <span>{elem.name} {elem.last_name} pasará a tener estado {elem.active? 'Inactivo': 'Activo'}</span>}
                    {execute==="coor" && <span>{elem.name} {elem.last_name} pasará a ser el coordinador del curso</span>}
                </ModalBasic>}
                <ModalBasic handleClick={fnExecute} setShow={setShowSpe} show={showSpe} title={`${execute==="add"? "Crear una nueva": "Modificar"} especialidad`}>
                    <div>
                        <Section title={"Nombre"} small>
                            <InputText data={spe} setData={setSpe} attribute={"name"}/>
                        </Section>
                        <Section title={"Ciclos"} small>
                            <InputText data={spe} setData={setSpe} attribute={"cycles"} isNumber maxLength={2}/>
                        </Section>
                        <Section title={"Estado"} small>
                            <div className="specialty-admin_modal_state">
                                <InputCheck data={spe} setData={setSpe} attribute={"active"} withInput/>
                                <span>{spe.active? "(Activo)": "(Inactivo)"}</span>
                            </div>
                        </Section>
                    </div>
                </ModalBasic>
            </div>
        </div>
    )
}