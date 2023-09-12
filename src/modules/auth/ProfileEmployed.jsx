import Header from "../../components/Header";
import Section from "../../components/Section";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Profile.scss"
import BasicInfo from "./BasicInfo";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import OptionsIcon from "../../components/OptionsIcon";
import { signInApi } from "../../api/auth";
import { employedDataApi } from "../../api/employed";
import MiniCard from "../../components/MiniCard";
import InputCheck from "../../components/Inputs/InputCheck";
import ModalLanguage from "../../components/Modals/ModalLanguage";
import ModalBasic from "../../components/Modals/ModalBasic";
import { deleteMyLenguageApi } from "../../api/sysData";
import { deleteItemOfArray } from "../../utils/generical-functions";

const detailsDummy = {
    agreements: [],
    ads: [],
}

export default function ProfileEmployed () {
    const {user,updateUser} = useAuth();
    const {idUser} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(user)
    const [mySelf, setMySelf] = useState(true)
    const [details, setDetails] = useState(detailsDummy);
    const [modalLanguage, setModalLanguage] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [attrsToDelete, setAttrsToDelete] = useState({arr: [], item: {}})
    const [modeModal, setModeModal] = useState("edit");
    const [elemToEdit, setElementToEdit] = useState({})

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
            const response = await employedDataApi(idUser);
            if(response.success) {
                setDetails(response.result)
            }
        }
        fetchData();
      }, []);

    const handleModalLanguage = (item=null) => {
        let elem = {value: '', level: 'Básico'}
        if(item) {
            elem = item
            setModeModal("edit")
        }else {
            setModeModal("add")
        }
        setElementToEdit(elem)
        setModalLanguage(true)
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
                                    userId={item.enterprise_id}
                                    profile={"enterprise"}
                                    circleState={-2}
                                >
                                    {mySelf && <OptionsIcon vertical size="22px"
                                        listIcons={[{icon: 'bi bi-pencil-fill', fn: ()=> navigate(`/job-portal/job/${item.code}`)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && user.recruiter && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle" onClick={()=>navigate(`/job-portal/create`)}></i>
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
                                        listIcons={[{icon: 'bi bi-pencil-fill', fn: ()=> handleModalLanguage(item)},
                                        {icon: 'bi bi-trash-fill', fn: ()=> showModalDelete(data.languages, item, true)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle" onClick={()=> handleModalLanguage()}></i>
                        </div>}
                    </Section>
                </div>
                <div className="profile_container_secondary">
                    <Section title={"Privilegios"} shadow>
                        <div>
                            <InputCheck data={data} attribute={"reader"} 
                                states={[{icon: 'bi bi-check-circle-fill', color: '#198754', text: 'Verificado'},
                                        {icon: 'bi bi-exclamation-octagon-fill', color: '#dc3545', text: 'No Verificado'}]}
                            />
                            <InputCheck data={data} attribute={"recruiter"} 
                                states={[{icon: 'bi bi-badge-ad-fill', color: '#699BF7', text: 'Reclutador'},
                                        {icon: 'bi bi-badge-ad-fill', color: '#666', text: 'No Reclutador'}]}
                            />
                            <InputCheck data={data} attribute={"signatory"} 
                                states={[{icon: 'bi bi-file-earmark-richtext-fill', color: '#699BF7', text: 'Firmante'},
                                        {icon: 'bi bi-file-earmark-richtext-fill', color: '#666', text: 'No Firmante'}]}
                            />
                        </div>
                    </Section>
                    <Section title={"Convenios firmados"} shadow>
                        {
                            details.agreements.map((item, index) => (
                                <MiniCard key={index} icon={"bi bi-file-earmark-text"} 
                                    text={`${item.job_title} (${item.date_sign})`}>
                                        <OptionsIcon visibleText
                                            listIcons={[{icon: 'bi bi-download'}]} 
                                        />
                                </MiniCard>
                            ))
                        }
                    </Section>
                    <ModalLanguage show={modalLanguage} setShow={setModalLanguage} type={modeModal} 
                        myData={user.languages} lanEdit={elemToEdit} />
                    <ModalBasic title={`Eliminar elemento`} show={modalDelete} setShow={setModalDelete} handleClick={deleteItemModal}>
                        <span>{`Idioma ${attrsToDelete.item.name}`}</span>
                    </ModalBasic>
                </div>
            </div>
        </div>
    )
}

