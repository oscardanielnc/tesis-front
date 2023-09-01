import Header from "../../components/Header";
import Section from "../../components/Section";
import {useEffect, useState } from "react";
import Button from "../../components/Inputs/Button";
import useAuth from "../../hooks/useAuth";
import "./scss/Profile.scss"
import BasicInfo from "./BasicInfo";
import { useParams } from "react-router-dom";

export default function ProfileStudent () {
    const {user} = useAuth();
    const {idUser} = useParams();

    useEffect(() => {

    }, [])

    return (
        <div className="profile">
            <Header type="student" photo={user.photo} idUser={user.id}></Header>
            <div className="profile_container">
                <div className="profile_container_principal">
                    <BasicInfo data={user} myself={user.id===idUser}/>
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Experiencia laboral"}>
                        ci
                    </Section>
                </div>
                <div className="profile_container_secondary">

                </div>
            </div>
        </div>
    )
}

