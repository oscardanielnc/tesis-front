import { useState } from "react";
import Section from "../../components/Section";
import "./scss/Admin.scss";
import Card from "../../components/Card";
import { getEnterprisesApi, updateEnterpriseApi } from "../../api/enterprise";
import OptionsIcon from "../../components/OptionsIcon";
import useAuth from "../../hooks/useAuth";
import InputText from "../../components/Inputs/InputText";
import Header from "../../components/Header";
import ModalBasic from "../../components/Modals/ModalBasic";
import { modifyItemOfArray } from "../../utils/generical-functions";
import { useNavigate } from "react-router-dom";
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";

export default function EnterprisesAdmin () {
    const {user} = useAuth()
    const [form, setForm] = useState({value: ''})
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)
    const [elem, setElem] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const search = async () => {
        setLoading(true)
        const response = await getEnterprisesApi(form);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
        setLoading(false)
    }

    const getOptions = item => {
        return [
            {
                icon: !item.active? 'bi bi-check-circle-fill': 'bi bi-exclamation-octagon-fill', 
                color: !item.active? '#198754': '#dc3545', 
                text: !item.active? 'Activar': 'Desactivar',
                fn: ()=> {setElem(item); setShow(true)}
            },
            {
                icon: 'bi bi bi-person-fill',
                text: 'Ver Perfil',
                fn: ()=> navigate(`/profile/enterprise/${item.id}`)
            },
        ]
    }

    const changeState = async () => {
        const newElem = {...elem, active: !elem.active}
        const response = await updateEnterpriseApi(newElem)
        if(response.success && response.result) {
            setData(modifyItemOfArray(data, newElem, 'id'))
            setShow(false)
            invokeToast('success',  `Se ha actualizado el estado de la empresa`)
        } else invokeToast("error", response.message)
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="single-cont">
                <Section title={"Buscar empresas"}>
                    <div className="box-to-search">
                        <InputText data={form} setData={setForm} attribute={"value"}/>
                        <i className="bi bi-search" onClick={search}></i>
                    </div>
                    <div className="box-to-result">
                        {!loading && 
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={item.name}
                                    text2={`RUC: ${item.ruc}`}
                                    text3={`Actualización de privilegios: ${item.update_date}`}
                                    text4={item.active? '(Activo)': '(Inactivo)'}
                                    photo={item.photo}
                                    userId={item.id}
                                    profile={"enterprise"}
                                    circleState={item.active? 1: -1}
                                >
                                    <OptionsIcon size="22px" visibleText verticalIcons
                                        listIcons={getOptions(item)} 
                                    />
                                </Card>
                            ))
                        }
                        {loading && <Loading size={180} />}
                    </div>
                </Section>
                <ModalBasic handleClick={changeState} setShow={setShow} show={show} title={"Modificar estado de la empresa"}>
                    {elem && <span>La empresa {elem.name} pasará a tener estado {elem.active? 'Inactivo': 'Activo'}</span>}
                </ModalBasic>
            </div>
        </div>
    )
}
