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
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";

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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            let dataResponse = null
            //data = perfil del que observo
            if(idUser!=user.id) {
                setMySelf(false)
                dataResponse = await signInApi({attr: 'id', value: idUser, photo: ''});
                if(dataResponse.success) {
                    setData(dataResponse.result[0])
                }else {
                    invokeToast("error", dataResponse.message)
                }
            }

            //details
            let myIdEnt = ''
            if(dataResponse) myIdEnt = dataResponse.result[0].enterprise_id
            else myIdEnt = user.enterprise_id

            const response = await employedDataApi(idUser,myIdEnt);
            if(response.success) {
                setDetails(response.result)
            }else {
                invokeToast("error", response.message)
            }
            setLoading(false)
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
        if(arr.length<=1) {
            invokeToast("warning", "Si elimina este elemento se quedará sin idiomas asociados a su perfil")
            return;
        }
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
            invokeToast("success", "Elemento eliminado")
        }else invokeToast("error", response.message)
    }

    return (
        <div className="profile">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="profile_container">
                <div className="profile_container_principal">
                    <BasicInfo data={data} myself={mySelf}/>
                    {data.reader && <Section icon={"bi bi-briefcase-fill"}
                        title={"Anuncios laborales próximos a terminar"}>
                        {
                            details.ads.length===0 &&
                                <span>La empresa de este usuario no tiene ofertas laborales vigentes...</span>
                        }
                        {
                            details.ads.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.job_title} (C${item.code})`}
                                    text2={data.enterprise_name}
                                    text3={`Fin de postulación: ${item.date_end}`}
                                    text4={item.description}
                                    photo={item.enterprise_photo}
                                    userId={item.enterprise_id}
                                    profile={"enterprise"}
                                    circleState={-2}
                                >
                                    {mySelf && <OptionsIcon vertical size="22px" visibleText
                                        listIcons={[{icon: 'bi bi-box-arrow-in-right', 
                                        text: 'Ver', fn: ()=> navigate(`/job-portal/job/${item.code}`)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && user.recruiter && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle" onClick={()=>navigate(`/job-portal/create`)}></i>
                        </div>}
                    </Section>}
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
                            details.agreements.length===0 && <span>Este usuario no ha firmado ningún convenio...</span>
                        }
                        {
                            details.agreements.map((item, index) => (
                                <MiniCard key={index} icon={"bi bi-file-earmark-text"} 
                                    text={`${item.job_title} (${item.date_sign})`}>
                                        <OptionsIcon visibleText
                                            listIcons={[{icon: 'down', fn: ()=> `${item.document_path}/${item.job_title}}`}]} 
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
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}

