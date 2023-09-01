import Header from "../../components/Header";
import Section from "../../components/Section";
import user from "../../assets/jpg/user.jpg";
import "./scss/Login.scss"
import InputCombo from "../../components/Inputs/InputCombo";
import SelectorTabs from "../../components/SelectorTabs";
import {useEffect, useState } from "react";
import jwt from 'jwt-simple';
import Button from "../../components/Inputs/Button";
import TableInputslogin from "./TableInputslogin";
import { gapi } from "gapi-script";
import { GOOGLE_ID, PSP_KEY } from "../../config";
import GoogleLogin from "react-google-login";
import { signInApi } from "../../api/auth";


const users = [
    {
        value: 'STUDENT',
        name: 'Estudiante'
    },
    {
        value: 'ENTERPRISE',
        name: 'Empresa'
    },
    {
        value: 'EMPLOYED',
        name: 'Empleado'
    },
    {
        value: 'PROFESSOR',
        name: 'Profesor'
    },
]
const locations = [
    {
        value: '1',
        name: 'Lima'
    },
    {
        value: '2',
        name: 'Tarapoto'
    },
]
const languages = [
    {
        value: '1',
        name: 'Español'
    },
    {
        value: '2',
        name: 'Inglés'
    },
]


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
    job: ''
}


export default function Login () {
    const [userSelected, setUserSelected] = useState(users[0]);
    const [data, setData] = useState(userDummy);

    useEffect(() => {
        // localStorage.removeItem("ACCESS_TOKEN")

        const start = () => {
            gapi.auth2.init({
                clientId: GOOGLE_ID
            })
        }
        gapi.load("client:auth2", start)
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
        console.log("ERROR: Google Auth", err)
    }

    const handleChangeUser = (element) => {
        setUserSelected(element);
        setData({
            ...data,
            role: element.value
        })
    }

    const handleSubmit = () => {
        console.log(data)
    }
    const onLogin = async response => {
        const obj = response.profileObj
        const responseApi = await signInApi(obj.email);
        if(responseApi.success) {
            const user = responseApi.result;
            // const accessToken = jwt.encode(user, PSP_KEY);
            localStorage.setItem("ACCESS_TOKEN", JSON.stringify(user));
            window.location.href = `/profile/student/${user.id}`;
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
                    <SelectorTabs list={users} valueSelected={userSelected.value} handleClick={element => handleChangeUser(element)}/>
                    <Section title={`Registro de ${userSelected.name}`} shadow>
                        <TableInputslogin data={data} setData={setData} userSelected={userSelected.value}/>
                        <div className="login_container_right-box">
                            <div className="login_container_right-box-submit">
                                <Button title="Registrar" handleClick={handleSubmit} variant="primary" icon="bi-hand-index-fill"/>
                            </div>
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
                                {/* <span className="login_container_right-box-acount-link">Iniciar Sesión</span> */}
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    )
}

