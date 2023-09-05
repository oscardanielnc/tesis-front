import Section from "../../components/Section";
import {useEffect, useState } from "react";
import user from "../../assets/jpg/user.jpg";
import enterprise1 from "../../assets/jpg/enterprise1.jpg";
import university2 from "../../assets/jpg/university2.jpg";
import Score from "../../components/Score";

export default function BasicInfo ({data, myself=false}) {
    useEffect(() => {

    }, [])

    const getBasics = (role) => {
        switch (role) {
            case "STUDENT": return `${data.specialty} - ${data.cycle}° ciclo`;
            case "ENTERPRISE": return `${data.sector} (${data.numEmployees} empleados) • ${data.phone}`;
            case "PROFFESSOR": return `${data.specialty}`;
            default: return `${data.enterprise_name} - ${data.job} • ${data.phone}`;
        }
    }

    return (
        <div className="basicinfo">
            <div className="basicinfo_main">
                <figure className="basicinfo_main_back">
                    <img src={(data.role==='STUDENT' || data.role==='PROFESSOR')? university2: enterprise1} alt="profile" />
                </figure>
                <div className="basicinfo_main_details">
                    <div className="basicinfo_main_details_title">
                        <span>{data.name.toUpperCase()} {data.role!=='ENTERPRISE'? data.lastname.toUpperCase(): ''} {data.role==="STUDENT"? `(${data.code})`: 
                            data.role==="ENTERPRISE"? `(${data.ruc})`: ''}
                        </span>
                        {data.role==="ENTERPRISE" && <Score score={data.score} showScore/>}
                        {myself && <i className="bi bi-pencil-fill"></i>}
                    </div>
                    <span>{getBasics(data.role)}</span>
                    <span>{data.role==="ENTERPRISE"? "Ubicado": "Vive"} en {data.location} - <strong>{data.email}</strong></span>
                </div>
                <figure className="basicinfo_main_photo">
                    <img src={data.photo !== ''? data.photo: user} alt="user" />
                </figure>
            </div>
            <Section icon={"bi bi-justify-left"}
                title={data.role==="ENTERPRISE"? "Acerca de la empresa": "Reseña personal"}>
                <p style={{fontSize: "14px"}}>{data.description}</p>
            </Section>
        </div>
    )
}