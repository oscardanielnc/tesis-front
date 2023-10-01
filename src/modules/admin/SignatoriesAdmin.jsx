import { useState } from "react";
import Section from "../../components/Section";
import "./scss/Admin.scss";
import Card from "../../components/Card";
import OptionsIcon from "../../components/OptionsIcon";
import useAuth from "../../hooks/useAuth";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import Header from "../../components/Header";
import ModalBasic from "../../components/Modals/ModalBasic";
import { modifyItemOfArray } from "../../utils/generical-functions";
import invokeToast from "../../utils/invokeToast";
import { addSignatoryApi, getSignatoriesApi, updateSignatoryApi } from "../../api/signatory";
import Button from "../../components/Inputs/Button";
import { rolesByProfessor } from "../../utils/global-consts";
import Loading from "../../components/Loading";



export default function SysDataAdmin () {
    const {user} = useAuth()
    const [form, setForm] = useState({value: ''})
    const [show, setShow] = useState(false)
    const [data, setData] = useState([])
    const [elem, setElem] = useState(null)
    const [newSig, setNewSig] = useState({name:'', last_name:'', email:'', role: 'SIGNATORY'})
    const [showSig, setShowSig] = useState(false)
    const [loading, setLoading] = useState(false)

    const search = async () => {
        setLoading(true)
        const response = await getSignatoriesApi(form);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
        setLoading(false)
    }

    const changeState = async () => {
        const newElem = {...elem, active: !elem.active}
        const response = await updateSignatoryApi(newElem)
        if(response.success && response.result) {
            setData(modifyItemOfArray(data, newElem, 'id'))
            setShow(false)
            invokeToast('success',  `Se ha actualizado el estado de ${newElem.name}`)
        } else invokeToast("error", response.message)
    }
    const sendInvitation = async () => {
        if(newSig.name==='') {
            invokeToast('warning', 'El nombre no puede ser un campo vacío'); return;
        }
        if(newSig.last_name==='') {
            invokeToast('warning', 'El apellido no puede ser un campo vacío'); return;
        }
        if(newSig.email==='') {
            invokeToast('warning', 'El email no puede ser un campo vacío'); return;
        }
        const response = await addSignatoryApi(newSig)
        if(response.success && response.result) {
            window.location.reload()
        }else invokeToast("error", response.message)
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="single-cont">
                <Section title={"Buscar miembros de la institución educativa"}>
                    <div className="box-to-search">
                        <InputText data={form} setData={setForm} attribute={"value"}/>
                        <i className="bi bi-search" onClick={search}></i>
                    </div>
                    <div className="profile_container_principal_plus">
                        <Button title={`Invitar a nuevo miembro`}
                            icon={"bi bi-plus"}
                            variant={"primary"}
                            circle
                            handleClick={()=> setShowSig(true)}
                        />
                    </div>
                    <div className="box-to-result">
                        {!loading && 
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.name} ${item.last_name} (${item.role==='SIGNATORY'? 'FIRMANTE': 'EVALUADOR'})`}
                                    text2={`Correo: ${item.email}`}
                                    text3={`Actualización de privilegios: ${item.update_date}`}
                                    text4={item.active? '(Activo)': '(Inactivo)'}
                                    photo={item.photo}
                                    circleState={item.active? 1: -1}
                                >
                                    <OptionsIcon size="22px" visibleText verticalIcons
                                        listIcons={[{icon: !item.active? 'bi bi-check-circle-fill': 'bi bi-exclamation-octagon-fill',
                                                    color: !item.active? '#198754': '#dc3545', 
                                                    text: !item.active? 'Activar': 'Desactivar',
                                                    fn: ()=> {setElem(item); setShow(true)}}]} 
                                    />
                                </Card>
                            ))
                        }
                        {loading && <Loading size={180} />}
                    </div>
                </Section>
                <ModalBasic handleClick={changeState} setShow={setShow} show={show} title={"Modificar estado del firmante"}>
                    {elem && <span>{elem.name} {elem.last_name} pasará a tener estado {elem.active? 'Inactivo': 'Activo'}</span>}
                </ModalBasic>
                <ModalBasic handleClick={sendInvitation} setShow={setShowSig} show={showSig} title={"Invitar a nuevo usuario firmante"}>
                    <div>
                        <Section title={"Nombres"} small>
                            <InputText data={newSig} setData={setNewSig} attribute={"name"}/>
                        </Section>
                        <Section title={"Apellidos"} small>
                            <InputText data={newSig} setData={setNewSig} attribute={"last_name"}/>
                        </Section>
                        <Section title={"Correo electrónico"} small>
                            <InputText data={newSig} setData={setNewSig} attribute={"email"}/>
                        </Section>
                        <Section title={"Rol del usaurio"} small>
                            <InputCombo data={newSig} setData={setNewSig} attribute={"role"} list={rolesByProfessor}/>
                        </Section>
                    </div>
                </ModalBasic>
            </div>
        </div>
    )
}