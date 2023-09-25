import Header from "../../components/Header";
import Section from "../../components/Section";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Profile.scss"
import BasicInfo from "./BasicInfo";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import Opinion from "../../components/Opinion";
import OptionsIcon from "../../components/OptionsIcon";
import { signInApi } from "../../api/auth";
import { enterpriseDataApi } from "../../api/enterprise";
import Button from "../../components/Inputs/Button"
import ModalLanguage from "../../components/Modals/ModalLanguage";
import ModalBasic from "../../components/Modals/ModalBasic";
import { deleteMyLenguageApi } from "../../api/sysData";
import { deleteItemOfArray } from "../../utils/generical-functions";
import ModalOpinion from "../../components/Modals/ModalOpinion";

const detailsDummy = {
    ads: [],
    opinions: []
}

const opinionDummy = {
    id: '',
    enterprise_name: "",//
    score: 0,
    date_update: "",
    description: "",
    student: "",//
    student_id: '',//
    ruc: ''//
}

export default function ProfileEnterprise () {
    const {user,updateUser} = useAuth();
    const {idUser} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(user)
    const [mySelf, setMySelf] = useState(true)
    const [details, setDetails] = useState(detailsDummy);
    const [modalLanguage, setModalLanguage] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [modalOpinion, setModalOpinion] = useState(false)
    const [attrsToDelete, setAttrsToDelete] = useState({arr: [], item: {}})
    const [modeModal, setModeModal] = useState("edit");
    const [elementToEdit, setElementToEdit] = useState(opinionDummy);


    useEffect(() => {
        async function fetchData() {
            //data = perfil del que observo
            if(idUser!==user.id) {
                setMySelf(false)
                const dataResponse = await signInApi({attr: 'id', value: idUser, photo: ''});
                if(dataResponse.success) {
                    setData(dataResponse.result[0])
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

    const showModalDelete = (arr, item) => {
        setAttrsToDelete({arr, item})
        setModalDelete(true)
    }

    const deleteItemModal = async () => {
        const response = await deleteMyLenguageApi({userId: user.id, lanId: attrsToDelete.item.value}) 
        if(response.success && response.result) {
            const nLangs = deleteItemOfArray(attrsToDelete.arr, attrsToDelete.item, 'value')
            updateUser({
                ...user,
                languages: nLangs
            })
            window.location.reload()
        }
    }
    
    const showModalOpinion = (item=null) => {
        let elem = {
            ...opinionDummy,
            id: '-',
            enterprise_name: data.name,
            student: user.name,
            student_id: data.id,
            ruc: data.ruc
        }
        if(item) {
            elem = item
            setModeModal("edit")
        }else {
            setModeModal("add")
        }
        setElementToEdit(elem)
        setModalOpinion(true)
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
                                        listIcons={[{icon: 'bi bi-pencil-fill', fn: ()=> navigate(`/job-portal/job/${item.code}`)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle" onClick={()=>navigate(`/job-portal/create`)}></i>
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
                                        listIcons={[{icon: 'bi bi-trash-fill', fn: ()=> showModalDelete(data.languages, item)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle" onClick={()=> setModalLanguage(true)}></i>
                        </div>}
                    </Section>
                </div>
                <div className="profile_container_secondary">
                    <Section title={"Opiniones"} shadow>
                        {user.role==="STUDENT" && alredySigned(user.id, details.opinions) && 
                        <div className="profile_container_principal_plus">
                            <Button title={"Escribe tu opinión"}
                                icon={"bi bi-plus"}
                                variant={"primary"}
                                circle
                                handleClick={()=>showModalOpinion()}
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
                                    isMyOpinion={user.role==='STUDENT' && user.id===item.student_id}
                                    fn={()=>showModalOpinion(item)}
                                />
                            ))
                        }
                    </Section>
                    <ModalLanguage show={modalLanguage} setShow={setModalLanguage} type={"add"} myData={user.languages} isEnterprise/>
                    <ModalBasic title={`Eliminar elemento`} show={modalDelete} setShow={setModalDelete} handleClick={deleteItemModal}>
                        <span>{`Idioma ${attrsToDelete.item.name}`}</span>
                    </ModalBasic>
                    <ModalOpinion opinion={elementToEdit} setShow={setModalOpinion} show={modalOpinion} type={modeModal} photo={data.photo}/>
                </div>
            </div>
        </div>
    )
}


