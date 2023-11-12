import Header from "../../components/Header";
import Section from "../../components/Section";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Profile.scss"
import BasicInfo from "./BasicInfo";
import { useParams,useNavigate } from "react-router-dom";
import { studentDataApi } from "../../api/student";
import Card from "../../components/Card";
import MiniCard from "../../components/MiniCard";
import Opinion from "../../components/Opinion";
import OptionsIcon from "../../components/OptionsIcon";
import { signInApi } from "../../api/auth";
import ModalLanguage from "../../components/Modals/ModalLanguage";
import ModalCerfiticates from "../../components/Modals/ModalCertificates";
import { deleteItemOfArray, getDateByNumber, replaceAll } from "../../utils/generical-functions";
import ModalBasic from "../../components/Modals/ModalBasic";
import { deleteMyCertificateApi, deleteMyLenguageApi } from "../../api/sysData";
import invokeToast from "../../utils/invokeToast";
import { uploadCVApi } from "../../api/doc";
import Loading from "../../components/Loading";

const detailsDummy = {
    experience: [],
    certificates: [],
    agreements: [],
    ads: [],
    opinions: []
}

const dummyCert = {
    id: '',
    title: '',
    enterprise_name: '',
    icon: -1,
    date_init: "",
    date_end: "",
    descripcion: "",
    enterprise_id: '',
    enterprise_photo: '',
    ruc: '',
    rucVerified: false
}

export default function ProfileStudent () {
    const {user, updateUser} = useAuth();
    const {idUser} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(user)
    const [mySelf, setMySelf] = useState(true)
    const [details, setDetails] = useState(detailsDummy);
    const [modalDelete, setModalDelete] = useState(false)
    const [modalLanguage, setModalLanguage] = useState(false)
    const [modalCerfiticates, setModalCerfiticates] = useState(false)
    const [elemToEdit, setElementToEdit] = useState(dummyCert)
    const [modeModal, setModeModal] = useState("edit");
    const [campCertificates, setCampCertificates] = useState("");
    const [attrsToDelete, setAttrsToDelete] = useState({arr: [], item: {},islanguage: false})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            //data = perfil del que observo
            if(idUser!=user.id) {
                setMySelf(false)
                const dataResponse = await signInApi({attr: 'id', value: idUser, photo: ''});
                if(dataResponse.success) {
                    setData(dataResponse.result[0])
                } else {
                    invokeToast("error", dataResponse.message)
                }
            }

            //details
            const response = await studentDataApi(idUser);
            if(response.success) {
                setDetails(response.result)
            }else {
                invokeToast("error", response.message)
            }
            setLoading(false)
        }
        fetchData();
      }, []);

    const getTimeTo = (dateInit, dateEnd) => {

        return `Desde ${getDateByNumber(dateInit)} hasta ${dateEnd!=''? getDateByNumber(dateEnd): 'la actualidad'}`;
    }

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
    const handleModalCertificates = (camp, item=null) => {
        let elem = dummyCert

        if(item) {
            elem = item
            setModeModal("edit")
        }else {
            setModeModal("add")
        }
        setCampCertificates(camp===1? "Experiencia laboral": "Certificados & Voluntariados")
        setElementToEdit(elem)
        setModalCerfiticates(true)
    }

    const showModalDelete = (arr, item, islanguage) => {
        if(islanguage && arr.length<=1) {
            invokeToast("warning", "Si elimina este elemento se quedará sin idiomas asociados a su perfil")
            return;
        }
        setAttrsToDelete({arr, item, islanguage})
        setModalDelete(true)
    }

    const deleteItemModal = async () => {
        if(attrsToDelete.islanguage) {
            const response = await deleteMyLenguageApi({userId: user.id, lanId: attrsToDelete.item.value}) 
            if(response.success && response.result) {
                const nLangs = deleteItemOfArray(attrsToDelete.arr, attrsToDelete.item, 'value')
                updateUser({
                    ...user,
                    languages: nLangs
                })
                window.location.reload()
                invokeToast("success", "Elemento eliminado")
            } else invokeToast("error", response.message)
            
        } else {
            const response = await deleteMyCertificateApi({id: attrsToDelete.item.id}) 
            if(response.success && response.result) {
                window.location.reload()
                invokeToast("success", "Elemento eliminado")
            } else invokeToast("error", response.message)
        }
    }

    const uploadMyCV = async list => {
        const response = await uploadCVApi(list,user.id)
        if(response.success && response.result) {
            updateUser({
                ...user,
                cv_path: response.result,
                uploadDateCV: new Date().toLocaleDateString()
            })
            invokeToast("success", "CV actualizado")
            window.location.reload()
        } else invokeToast("error", response.message)
    }

    const getNameCv = () => {
        return `${data.name.split(' ')[0]} ${data.lastname.split(' ')[0]} - CV (${data.uploadDateCV})`
    }

    return (
        <div className="profile">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="profile_container">
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
                                    text4={item.descripcion}
                                    userId={item.enterprise_id!==''? item.enterprise_id: undefined}
                                    profile={"enterprise"}
                                    photo={item.enterprise_photo}
                                    icon={item.icon}
                                    circleState={-2}
                                >
                                    {mySelf && <OptionsIcon vertical size="22px"
                                        listIcons={[{icon: 'bi bi-pencil-fill', fn: ()=> handleModalCertificates(1,item)},
                                                    {icon: 'bi bi-trash-fill', fn: ()=> showModalDelete(details.experience, item, false)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle"  onClick={()=> handleModalCertificates(1)}></i>
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
                                    text4={item.descripcion}
                                    userId={item.enterprise_id!==''? item.enterprise_id: undefined}
                                    photo={item.enterprise_photo}
                                    icon={item.icon}
                                    circleState={-2}
                                >
                                    {mySelf && <OptionsIcon vertical size="22px"
                                        listIcons={[{icon: 'bi bi-pencil-fill', fn: ()=> handleModalCertificates(2,item)},
                                                    {icon: 'bi bi-trash-fill', fn: ()=> showModalDelete(details.certificates, item, false)}]} 
                                    />}
                                </Card>
                            ))
                        }
                        {mySelf && <div className="profile_container_principal_plus">
                            <i className="bi bi-plus-circle" onClick={()=> handleModalCertificates(2)}></i>
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
                    <Section title={"CV"} shadow>
                        {(data.cv_path && data.cv_path!='') && <MiniCard icon={"bi bi-file-earmark-text"} 
                            text={getNameCv()}>
                                <OptionsIcon  
                                    listIcons={mySelf? [{icon: 'down', fn: ()=> `${user.cv_path}/${replaceAll(getNameCv(), '/','-')}`},
                                    {icon: 'up', fn: (list)=> uploadMyCV(list)}]: 
                                    [{icon: 'down', fn: ()=> `${user.cv_path}/${replaceAll(getNameCv(), '/','-')}`}]} 
                                />
                        </MiniCard>}
                        {(data.cv_path=='' || !data.cv_path) && <MiniCard text={`Sin CV`}>
                                {
                                    mySelf && <OptionsIcon listIcons={[{icon: 'up', fn: (list)=> uploadMyCV(list)}]}/> 
                                }
                        </MiniCard>}
                    </Section>
                    <Section title={"Convenios"} shadow>
                        {
                            details.agreements.length===0 && <MiniCard text={`Sin Convenio`}></MiniCard>
                        }
                        {
                            details.agreements.map((item, index) => (
                                <MiniCard key={index} icon={"bi bi-file-earmark-text"} 
                                    text={`${item.job_title} en ${item.enterprise_name} (${item.state})`}>
                                        <OptionsIcon visibleText
                                            listIcons={[{icon: 'bi bi-box-arrow-in-right', text: "Ver",
                                            fn: ()=> navigate(`/digital-sign/draw/${item.id}`)}]} 
                                        />
                                </MiniCard>
                            ))
                        }
                    </Section>
                    {mySelf && <Section title={"Anuncios guardados"} shadow>
                        {
                            details.ads.length===0 && <MiniCard text={`Sin postulaciones`}></MiniCard>
                        }
                        {
                            details.ads.map((item, index) => (
                                <MiniCard key={index} icon={"bi bi-calendar-week"} 
                                    text={`${item.job_title} - ${item.enterprise_name} (${getDateByNumber(item.date_end)})`}>
                                        <OptionsIcon visibleText
                                            listIcons={[{icon: 'bi bi-box-arrow-in-right', text: 'Ver',
                                                        fn: ()=> navigate(`/job-portal/job/${item.code}`)}]} 
                                        />
                                </MiniCard>
                            ))
                        }
                    </Section>}
                    {/* <Section title={"Opiniones"} shadow>
                        {
                            details.opinions.length===0 && <MiniCard text={`Sin opiniones`}></MiniCard>
                        }
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
                    </Section> */}
                    <ModalLanguage show={modalLanguage} setShow={setModalLanguage} type={modeModal} 
                        myData={user.languages} lanEdit={elemToEdit} />
                    <ModalCerfiticates show={modalCerfiticates} setShow={setModalCerfiticates} type={modeModal} 
                        camp={campCertificates} item={elemToEdit}/>
                    <ModalBasic title={`Eliminar elemento`} show={modalDelete} setShow={setModalDelete} handleClick={deleteItemModal}>
                        <span>{`${attrsToDelete.islanguage? 'Idioma ': ''} ${attrsToDelete.islanguage? attrsToDelete.item.name: attrsToDelete.item.title}`}</span>
                    </ModalBasic>
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}

