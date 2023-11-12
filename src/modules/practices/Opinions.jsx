import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
// import "./scss/SearchJob.scss"
import Section from "../../components/Section";
import Button from "../../components/Inputs/Button";
import CardProfile from "../../components/CardProfile";
import ModalBasic from "../../components/Modals/ModalBasic"
import {getJobByCodeApi} from "../../api/job"
import { useNavigate, useParams } from "react-router-dom";
import { getLanguagesApi, getLocationsApi } from "../../api/sysData";
import { getSpecialtiesApi } from "../../api/specialty";
import { addingInitArr, modifyItemOfArray } from "../../utils/generical-functions";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import InputMultiSelect from "../../components/Inputs/InputMultiSelect";
import { opinionsOrder, opinionsScore, opinionsVerifications, orderByApplicants, typeOfApplicants } from "../../utils/global-consts";
import { contractStudentApi, getStudentsApi } from "../../api/student";
import Opinion from "../../components/Opinion";
import OptionsIcon from "../../components/OptionsIcon";
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";
import { getAlredySignedApi, getEnterpriseOpinionApi } from "../../api/enterprise";
import { getOpinionsApi } from "../../api/opinion";
import ModalOpinion from "../../components/Modals/ModalOpinion";

const formDummy = {
    student: '',
    score: '',
    oderby: '',
    verification: ''
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

export default function Opinions () {
    const {user} = useAuth();
    const {idEnterprise} = useParams();
    const [form, setForm] = useState(formDummy)
    const [data, setData] = useState({})
    const [opinions, setOpinions] = useState([])
    const [modeModal, setModeModal] = useState("edit");
    const [elementToEdit, setElementToEdit] = useState(opinionDummy);
    const [loading, setLoading] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [modalOpinion, setModalOpinion] = useState(false)
    const [alredySigned, setAlredySigned] = useState(false)
    const navigate = useNavigate(); 

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const response = await getEnterpriseOpinionApi(idEnterprise);
            if(response.success) {
                setData(response.result)
            } else invokeToast("error", response.message)

            const response2 = await getAlredySignedApi(idEnterprise, user.id);
            if(response2.success) {
                setAlredySigned(response2.result)
            } else invokeToast("error", response2.message)
            setLoading(false)
        }
        fetchData();
    }, [])

    const onSearch = async () => {
        setLoadingSearch(true)
        const response = await getOpinionsApi({...form,id: idEnterprise});
        if(response.success) {
            setOpinions(response.result)
        } else invokeToast("error", response.message)
        setLoadingSearch(false)
    }
    // const getOptions = (student) => {
    //     return [
    //         {
    //             text: student.hired? 'Contratado': 'Contratar',
    //             icon: 'bi bi-briefcase-fill',
    //             color: student.hired? '#198754': '#666',
    //             fn: () => showModalContract(student)
    //         },
    //         {
    //             text: 'Descargar CV',
    //             icon: 'down',
    //             color: '#666',
    //             fn: () => getCV(student.name, student.cv_path)
    //         },
    //         {
    //             text: 'Ver perfil',
    //             icon: 'bi bi-person-fill',
    //             color: '#666',
    //             fn: () => navigate(`/profile/student/${student.id}`)
    //         },
    //     ]
    // }

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
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Empresa`} small shadow>
                        <CardProfile name={data.enterprise_name} score={data.enterprise_score} photo={data.enterprise_photo} profile={"enterprise"}
                        subTitle={`${data.enterprise_sector}, ubicado en ${data.enterprise_location}`} idUser={data.enterprise_id}
                        thrTitle={`${data.num_employees} empleados (${data.num_opinios} opiniones)`} />
                    </Section>
                    <Section title={`Nombre del estudiante`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"student"}/>
                    </Section>
                    <Section title={"Calificación"} small shadow>
                        <InputCombo list={opinionsScore} setData={setForm} attribute={"score"} data={form} />
                    </Section>
                    <Section title={"Nivel de verificación"} small shadow>
                        <InputCombo list={opinionsVerifications} setData={setForm} attribute={"verification"} data={form} />
                    </Section>
                    <Section title={"Ordenar por"} small shadow>
                        <InputCombo list={opinionsOrder} setData={setForm} attribute={"oderby"} data={form} />
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section title={`Opiniones`}>
                        {user.role==="STUDENT" && alredySigned && 
                        <div className="profile_container_principal_plus">
                            <Button title={`Escribe tu opinión`}
                                icon={"bi bi-plus"}
                                variant={"primary"}
                                circle
                                handleClick={()=>showModalOpinion()}
                            />
                        </div>}
                        {!loadingSearch && 
                            opinions.map((item, index) => (
                                <Opinion key={index} 
                                    enterprise_name={item.enterprise_name}
                                    score={item.score}
                                    date_update={item.date_update}
                                    description={item.description}
                                    student={item.student}
                                    me={user.role}
                                    him={'ENTERPRISE'}
                                    state={item.state}
                                    isMyOpinion={user.role==='STUDENT' && user.id===item.student_id}
                                    fn={()=>showModalOpinion(item)}
                                />
                            ))
                        }
                        {loadingSearch && <Loading size={180} />}
                        {/* <ModalBasic setShow={setModalContract} show={modalContract} noButtons={loadingPriv}
                            handleClick={contractStudent} title={"Contratar estudiante"}>
                                {!loadingPriv && <CardProfile idUser={studentCont.id} name={studentCont.name} profile={"student"}
                                    photo={studentCont.photo} subTitle="Esta acción es irreversible"/>}
                                {loadingPriv && <Loading size={150} />}
                        </ModalBasic> */}
                        <ModalOpinion opinion={elementToEdit} setShow={setModalOpinion} show={modalOpinion} type={modeModal} photo={data.enterprise_photo}/>
                    </Section>
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}
