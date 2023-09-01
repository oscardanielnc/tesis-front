import Section from "../../components/Section";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import user from "../../assets/jpg/user.jpg";
import enterprise1 from "../../assets/jpg/enterprise1.jpg";
import university2 from "../../assets/jpg/university2.jpg";

export default function BasicInfo ({data, myself=false}) {
    useEffect(() => {

    }, [])

    return (
        <div className="basicinfo">
            <div className="basicinfo_main">
                <figure className="basicinfo_main_back">
                    <img src={(data.role==='STUDENT' || data.role==='PROFESSOR')? university2: enterprise1} alt="profile" />
                </figure>
                <div className="basicinfo_main_details">
                    <div className="basicinfo_main_details_title">
                        <span>{data.name} {data.lastname} {data.role==="STUDENT"? `(${data.code})`: 
                            data.role==="ENTERPRISE"? `(${data.ruc})`: ''}
                        </span>
                        {myself && <i className="bi bi-pencil-fill"></i>}
                    </div>
                    <span>{data.specialty} - {data.cycle}° ciclo</span>
                    <span>{data.role==="ENTERPRISE"? "Ubicado": "Vive"} en {data.location} - <strong>{data.email}</strong></span>
                </div>
                <figure className="basicinfo_main_photo">
                    <img src={data.photo !== ''? data.photo: user} alt="user" />
                </figure>
            </div>
            <Section icon={"bi bi-justify-left"}
                title={data.role==="ENTERPRISE"? "Acerca de la empresa": "Reseña personal"}>
                <p>{data.description}</p>
            </Section>
        </div>
    )
}