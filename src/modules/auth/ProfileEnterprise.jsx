import Header from "../../components/Header";
import Section from "../../components/Section";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Profile.scss"
import BasicInfo from "./BasicInfo";
import { useParams } from "react-router-dom";
import Card from "../../components/Card";
import Opinion from "../../components/Opinion";
import OptionsIcon from "../../components/OptionsIcon";
import { signInApi } from "../../api/auth";
import { enterpriseDataApi } from "../../api/enterprise";
import Button from "../../components/Inputs/Button"

const detailsDummy = {
    ads: [],
    opinions: []
}

export default function ProfileEnterprise () {
    const {user} = useAuth();
    const {idUser} = useParams();
    const [data, setData] = useState(user)
    const [mySelf, setMySelf] = useState(true)
    const [details, setDetails] = useState(detailsDummy);

    useEffect(() => {
        async function fetchData() {
            //data = perfil del que observo
            if(idUser!==user.id) {
                setMySelf(false)
                const dataResponse = await signInApi('id', idUser);
                if(dataResponse.success) {
                    setData(dataResponse.result)
                }
            }

            //details
            const response = await enterpriseDataApi(idUser);
            if(response.success) {
                setDetails(response.result)
            }
        }
        fetchData();
      }, []);

    const alredySigned = (studentId, opinions) => {
        if (opinions) {
            for (let element of opinions) {
                if(element.student_id === studentId) {
                    return true
                }
            }
        }
        return false
    }

    return (
        <div className="profile">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} idEnterprise={user.enterprise_id}></Header>
            <div className="profile_container">
                <div className="profile_container_principal">
                    <BasicInfo data={data} myself={mySelf}/>
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Anuncios laborales próximos a terminar"}>
                        {
                            details.ads.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.job_title} (${item.code})`}
                                    text2={item.enterprise_name}
                                    text3={`Fin de postulación: ${item.date_end}`}
                                    text4={item.description}
                                    photo={data.photo}
                                    circleState={-2}
                                >
                                    {mySelf && <OptionsIcon vertical size="22px"
                                        listIcons={[{icon: 'bi bi-pencil-fill'},{icon: 'bi bi-trash-fill'}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle"></i>
                        </div>}
                    </Section>
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Idiomas"}>
                        {
                            data.languages.map((item, index) => (
                                <Card key={index} 
                                    text1={item.name}
                                    icon={-1}
                                >
                                    {mySelf && <OptionsIcon vertical size="22px"
                                        listIcons={[{icon: 'bi bi-pencil-fill'},{icon: 'bi bi-trash-fill'}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle"></i>
                        </div>}
                    </Section>
                </div>
                <div className="profile_container_secondary">
                    <Section title={"Opiniones"} shadow>
                        {user.role==="STUDENT" && !alredySigned(user.id, details.opinions) && 
                        <div className="profile_container_principal_plus">
                            <Button title={"Escribe tu opinión"}
                                icon={"bi bi-plus"}
                                variant={"primary"}
                                circle
                            />
                        </div>}
                        {
                            details.opinions.map((item, index) => (
                                <Opinion key={index} 
                                    enterprise_name={item.enterprise_name}
                                    score={item.score}
                                    date_update={item.date_update}
                                    description={item.description}
                                    student={item.student}
                                    me={user.role}
                                    him={data.role}
                                />
                            ))
                        }
                    </Section>
                </div>
            </div>
        </div>
    )
}

