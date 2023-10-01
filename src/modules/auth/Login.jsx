import Header from "../../components/Header";
import Section from "../../components/Section";
import user from "../../assets/jpg/user.jpg";
import "./scss/Login.scss"
import InputCombo from "../../components/Inputs/InputCombo";
import SelectorTabs from "../../components/SelectorTabs";
import {useEffect, useState } from "react";
import Button from "../../components/Inputs/Button";
import TableInputslogin from "./TableInputslogin";
import { gapi } from "gapi-script";
import { GOOGLE_ID } from "../../config";
import GoogleLogin from "react-google-login";
import { signInApi, signUpApi } from "../../api/auth";
import { getEmailsSystemApi, getLanguagesApi, getLocationsApi } from "../../api/sysData";
import { usersType } from "../../utils/global-consts";
import invokeToast from "../../utils/invokeToast";
import { getTime5h, goToHome, nowTime } from "../../utils/generical-functions";
import ModalUsers from "../../components/Modals/ModalUsers";
import Loading from "../../components/Loading";

const userDummy = {
    role: "STUDENT",
    name: '',
    lastname: '',
    email: '-',
    photo: '',
    location: '',
    language: '',
    date: '',
    code: '',
    specialty: '',
    cycle: 0,
    ruc: '',
    rucVerified: false,
    phone: '',
    sector: '',
    numEmployees: '',
    job: '',
    enterprise_name: '',
    enterprise_photo: '',
    icon: -1
}


export default function Login () {
    const [userSelected, setUserSelected] = useState(usersType[0]);
    const [data, setData] = useState(userDummy);
    const [locations, setLocations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [sysConf, setSysConf] = useState([]);
    const [arrUsers, setArrUsers] = useState([])
    const [show, setShow] = useState(false)

    useEffect(() => {
        // localStorage.removeItem("ACCESS_TOKEN")

        const start = () => {
            gapi.auth2.init({
                clientId: GOOGLE_ID
            })
        }
        gapi.load("client:auth2", start)
    }, [])

    useEffect(() => {
        async function fetchData() {
            const response1 = await getLocationsApi({name: '', active:true});
            const response2 = await getLanguagesApi({name: '', active:true});
            const response3 = await getEmailsSystemApi();
            
            //locations
            if(response1.success) {
                setLocations(response1.result)
            }
            //languages
            if(response2.success) {
                setLanguages(response2.result)
            }
            if(response3.success) {
                setSysConf(response3.result)
            }
            if(response1.success && response2.success) {
                setData({
                    ...data,
                    location: response1.result[0].value,
                    language: response2.result[0].value
                })
            }
        }
        fetchData();
    }, [])

    const onSuccess = response => {
        const obj = response.profileObj
        setData({
            ...data,
            email: obj.email,
            photo: obj.imageUrl
        })
    }
    const onFailure = err => {
        invokeToast("error", err)
    }

    const handleChangeUser = (element) => {
        setUserSelected(element);
        setData({
            ...data,
            role: element.value
        })
    }

    const validateInputs = () => {
        if(data.email === '-') 
            {invokeToast("warning", "Es necesario registrar un correo"); return false}
        if(data.role==='STUDENT' && data.email.split('@')[1] !== sysConf.domain) 
            {invokeToast("warning", "Debe registrarse con su correo institucional"); return false}
        if((data.role==='STUDENT' || data.role==='PROFESSOR') && data.specialty==='') 
            {invokeToast("warning", "Debe seleccionar su especialidad"); return false}
        if((data.role==='ENTERPRISE' || data.role==='EMPLOYED') && data.ruc === '') 
            {invokeToast("warning", `El RUC no puede ser un campo vacío`); return false}
        if((data.role==='ENTERPRISE') && data.rucVerified) 
            {invokeToast("warning", `El RUC ingresado no es válido`); return false}
        if((data.role==='EMPLOYED') && !data.rucVerified) 
            {invokeToast("warning", `El RUC ingresado no es válido`); return false}
        if(data.name === '') 
            {invokeToast("warning", `${data.role==='ENTERPRISE'? 'La razón social': 'El nombre'} no puede ser un campo vacío`); return false}
        if(data.role!=='ENTERPRISE' && data.lastname === '') 
            {invokeToast("warning", `El campo de apellido no puede estar vacío`); return false}
        if(data.date === '') 
            {invokeToast("warning", `Ingrese una fecha de ${data.role==='ENTERPRISE'? 'fundación': 'nacimiento'} válida`); return false}
        if(getTime5h(data.date) > nowTime()) 
            {invokeToast("warning", `La fecha de ${data.role==='ENTERPRISE'? 'fundación': 'nacimiento'} no puede ser mayor a la fecha actual`); return false}
        if(data.role==='STUDENT' && data.code === '') 
            {invokeToast("warning", `El código de estudiante no puede estar vacío`); return false}
        if((data.role==='ENTERPRISE' || data.role==='EMPLOYED') && data.phone === '') 
            {invokeToast("warning", `El número de teléfono no puede ser un campo vacío`); return false}
        if(data.role==='ENTERPRISE' && data.sector === '') 
            {invokeToast("warning", `El sector empresarial no puede ser un campo vacío`); return false}
        if(data.role==='ENTERPRISE' && data.numEmployees === '') 
            {invokeToast("warning", `Ingrese el número de empleados en su empresa`); return false}
        if(data.role==='EMPLOYED' && data.job === '') 
            {invokeToast("warning", `Ingrese su puesto de trabajo en la empresa`); return false}
        return true
    }

    const handleSubmit = async () => {
        if(validateInputs()) {
            const responseApi = await signUpApi(data);
            if(responseApi.success) {
                const user = responseApi.result;
                goToHome(user)
                // localStorage.setItem("ACCESS_TOKEN", JSON.stringify(user));
                // window.location.href = `/profile/${user.role.toLowerCase()}/${user.id}`;
            } else {
                invokeToast("error", responseApi.message)
            }
        }
    }
    const onLogin = async response => {
        const obj = response.profileObj
        const responseApi = await signInApi({attr: 'email', value: obj.email, photo: obj.imageUrl});
        if(responseApi.success) {
            if(responseApi.result.length===1) {
                const user = responseApi.result[0];
                goToHome(user)
            } else {
                setArrUsers(responseApi.result)
                setShow(true)
            }
        } else {
            invokeToast("error", responseApi.message)
        }
    }

    return (
        <div className="login">
            <Header></Header>
            <div className="login_container">
                <div className="login_container_left">
                    <Section title={"Datos de Google"} shadow>
                        <div className="login_container_left_google">
                            <figure className="login_container_left_google_photo">
                                <img src={data.photo !== ''? data.photo: user} alt="user" />
                            </figure>
                            <span className="login_container_left_google_email">{data.email}</span>
                            <GoogleLogin 
                                clientId={GOOGLE_ID}
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={"single_host_policy"}
                                buttonText={data.email !== '-'? "Usar otra cuenta": "Ingresar cuenta"}
                                className="login_container_left_google_button"
                            />
                        </div>
                    </Section>
                    <Section title={"Datos Generales"} shadow>
                        <Section title={"Ubicación"} small>
                            <InputCombo list={locations} setData={setData} attribute={"location"} data={data} />
                        </Section>
                        <Section title={"Idioma principal"} small>
                            <InputCombo list={languages} setData={setData} attribute={"language"} data={data} />
                        </Section>
                    </Section>
                </div>
                <div className="login_container_right">
                    <SelectorTabs list={usersType} valueSelected={userSelected.value} handleClick={element => handleChangeUser(element)}/>
                    <Section title={`Registro de ${userSelected.name}`} shadow>
                        <TableInputslogin data={data} setData={setData} userSelected={userSelected.value}/>
                        <div className="login_container_right-box">
                            <div className="login_container_right-box-submit">
                                <Button title="Registrar" handleClick={handleSubmit} variant="primary" icon="bi-hand-index-fill"/>
                            </div>
                            <span style={{fontSize: "14px"}}>¿Hay algún problema con su registro? Puede contactar con <strong>{sysConf.support}</strong></span>
                            <div className="login_container_right-box-acount">
                                <span className="login_container_right-box-acount-text">¿Ya tiene una cuenta registrada</span>
                                <GoogleLogin 
                                    clientId={GOOGLE_ID}
                                    onSuccess={onLogin}
                                    onFailure={onFailure}
                                    cookiePolicy={"single_host_policy"}
                                    buttonText={"Iniciar sesión"}
                                    className="login_container_right-box-acount-link"
                                />
                            </div>
                        </div>
                    </Section>
                    <ModalUsers arrUsers={arrUsers} setShow={setShow} show={show} />
                </div>
            </div>
        </div>
    )
}

