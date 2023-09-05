import Header from "../../components/Header";
import Section from "../../components/Section";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Profile.scss"
import BasicInfo from "./BasicInfo";
import { useParams } from "react-router-dom";
import { studentDataApi } from "../../api/student";
import Card from "../../components/Card";
import MiniCard from "../../components/MiniCard";
import Opinion from "../../components/Opinion";
import OptionsIcon from "../../components/OptionsIcon";
import { signInApi } from "../../api/auth";

const detailsDummy = {
    experience: [],
    certificates: [],
    agreements: [],
    ads: [],
    opinions: []
}

export default function ProfileStudent () {
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
            const response = await studentDataApi(idUser);
            if(response.success) {
                setDetails(response.result)
            }
        }
        fetchData();
      }, []);

    const getTimeTo = (dateInit, dateEnd) => {
        return `${dateInit} - ${dateEnd} · ${"1 mes"}`;
    }

    return (
        <div className="profile">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} idEnterprise={user.enterprise_id}></Header>
            <div className="profile_container">
                <div className="profile_container_principal">
                    <BasicInfo data={data} myself={mySelf}/> 
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Experiencia laboral"}>
                        {
                            details.experience.map((item, index) => (
                                <Card key={index} 
                                    text1={item.title}
                                    text2={item.enterprise_name}
                                    text3={getTimeTo(item.date_init, item.date_end)}
                                    text4={item.description}
                                    userId={item.enterprise_id}
                                    photo={item.enterprise_photo}
                                    icon={item.icon}
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
                        title={"Certificados & Voluntariados"}>
                        {
                            details.certificates.map((item, index) => (
                                <Card key={index} 
                                    text1={item.title}
                                    text2={item.enterprise_name}
                                    text3={getTimeTo(item.date_init, item.date_end)}
                                    text4={item.description}
                                    userId={item.enterprise_id}
                                    photo={item.enterprise_photo}
                                    icon={item.icon}
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
                                    text2={item.level}
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
                    <Section title={"CV"} shadow>
                        <MiniCard icon={"bi bi-file-earmark-text"} 
                            text={`${data.name.split(' ')[0]} ${data.lastname.split(' ')[0]} - CV (${data.uploadDateCV})`}>
                                <OptionsIcon 
                                    listIcons={mySelf? [{icon: 'bi bi-download'},{icon: 'bi bi-cloud-upload'}]: [{icon: 'bi bi-download'}]} 
                                />
                        </MiniCard>
                    </Section>
                    <Section title={"Convenios"} shadow>
                        {
                            details.agreements.map((item, index) => (
                                <MiniCard key={index} icon={"bi bi-file-earmark-text"} 
                                    text={`${item.job_title} en ${item.enterprise_name} (vigente)`}>
                                        <OptionsIcon visibleText
                                            listIcons={[{icon: 'bi bi-download'}]} 
                                        />
                                </MiniCard>
                            ))
                        }
                    </Section>
                    {mySelf && <Section title={"Anuncios guardados"} shadow>
                        {
                            details.ads.map((item, index) => (
                                <MiniCard key={index} icon={"bi bi-calendar-week"} 
                                    text={`${item.job_title} - ${item.enterprise_name} (${item.date_end})`}>
                                        <OptionsIcon visibleText
                                            listIcons={[{icon: 'bi bi-box-arrow-in-right', text: 'Ver'}]} 
                                        />
                                </MiniCard>
                            ))
                        }
                    </Section>}
                    <Section title={"Opiniones"} shadow>
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

