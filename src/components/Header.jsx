import logo from "../assets/png/logo.png";
import nouser from "../assets/jpg/user.jpg";
import { NavLink } from 'react-router-dom';
import "./scss/Header.scss"
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';

export default function Header ({type = 'none', idUser='', photo='', idEnterprise='',employedNoVerified=false}) {
    const [ops, setOps] = useState([])
    const [view, setView] = useState(false)

    useEffect(()=> {
        setOps(getDataHeader(type, idUser, idEnterprise,employedNoVerified))
    }, [])

    const logout = () => {
        localStorage.removeItem("ACCESS_TOKEN")
        window.location.href = '/'
    }

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
                    {type!=='none' &&
                        <figure className="header_right_photo_profile" onClick={()=>setView(!view)}>
                            <img src={photo && photo != ''? photo: nouser} alt="user" />
                        </figure>
                    }
                    {
                        view && 
                        <div className="header_right_photo_menu">
                            <div className="header_right_photo_menu_item" onClick={logout}>
                                <span>Cerrar sesión</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function getDataHeader (type, idUser, idEnterprise,employedNoVerified) {
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
        signatory: [
            {
                name: "Convenios",
                link: `/digital-sign/agreements`
            },
        ],
        professor: [
            {
                name: "Alumnos",
                link: `/practices/students`
            },
            {
                name: "Entregables",
                link: `/practices/deliverables`
            },
            {
                name: "Lista Negra",
                link: `/practices/black-list`
            },
        ],
        evaluator: [
            {
                name: "Lista Negra",
                link: `/practices/black-list`
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
                link: `/practices/deliverables`
            },
            // {
            //     name: "Empresas",
            //     link: `/practices/enterprises`
            // },
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
            {
                name: "Lista Negra",
                link: `/practices/black-list/enterprise/${idUser}`
            },
            {
                name: "Estudiantes",
                link: `/practices/enterprise/forms/x`
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
            {
                name: "Estudiantes",
                link: `/practices/enterprise/forms/x`
            },
        ],
    }
    if(employedNoVerified) return [{
        name: "Perfil",
        link: `/profile/employed/${idUser}`
    }]
    return options[type]
}