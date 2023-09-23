import logo from "../assets/png/logo.png";
import nouser from "../assets/jpg/user.jpg";
import { NavLink } from 'react-router-dom';
import "./scss/Header.scss"
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';

export default function Header ({type = 'none', idUser='', photo='', idEnterprise=''}) {
    const [ops, setOps] = useState([])
    useEffect(()=> {
        setOps(getDataHeader(type, idUser, idEnterprise))
    }, [])

    return (
        <div className="header">
            <div className="header_left">
                <figure className="header_left_logo">
                    <img src={logo} alt="logo" />
                </figure>
            </div>
            <div className="header_right">
                <div className="header_right_options">
                    {
                        ops.map((item, index) => (
                            <NavLink key = {index}  to = {item.link} className = {e => 
                                    `header_right_options-item ${e.isActive? "selected" : ""}`
                                }>
                                <span>{item.name}</span>
                            </NavLink>
                        ))
                    }
                </div>
                <ToastContainer />
                <div className="header_right_photo">
                    {type!=='admin' && type!=='none' &&
                        <figure className="header_right_photo_profile">
                            <img src={photo !== ''? photo: nouser} alt="user" />
                        </figure>
                    }
                </div>
            </div>
        </div>
    )
}

function getDataHeader (type, idUser, idEnterprise) {
    const options = {
        none: [],
        admin: [
            {
                name: "Datos del sistema",
                link: `/admin/sys-data`
            },
            {
                name: "Empresas",
                link: `/admin/enterprises`
            },
            {
                name: "Especialidades",
                link: `/admin/specialties`
            },
            {
                name: "Ciclos",
                link: `/admin/cycles`
            },
            {
                name: "Comité de PSP",
                link: `/admin/committee`
            },
        ],
        student: [
            {
                name: "Perfil",
                link: `/profile/student/${idUser}`
            },
            {
                name: "Convocatorias",
                link: `/job-portal/search`
            },
            {
                name: "Convenios",
                link: `/digital-sign/agreements`
            },
            {
                name: "Entregables",
                link: `/practices/assessment`
            },
            {
                name: "Discusión",
                link: `/practices/discussion`
            },
        ],
        enterprise: [
            {
                name: "Perfil",
                link: `/profile/enterprise/${idUser}`
            },
            {
                name: "Mis Convocatorias",
                link: `/job-portal/search`
            },
            {
                name: "Miembros",
                link: `/job-portal/members`
            },
            {
                name: "Convenios",
                link: `/digital-sign/agreements`
            },
        ],
        employed: [
            {
                name: "Perfil",
                link: `/profile/employed/${idUser}`
            },
            {
                name: "Empresa",
                link: `/profile/enterprise/${idEnterprise}`
            },
            {
                name: "Mis Convocatorias",
                link: `/job-portal/search`
            },
            {
                name: "Miembros",
                link: `/job-portal/members`
            },
            {
                name: "Convenios",
                link: `/digital-sign/agreements`
            },
        ],
    }
    return options[type]
}