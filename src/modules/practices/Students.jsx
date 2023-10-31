import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import { getPeriodsApi } from "../../api/sysData";
import { registrationStatuses } from "../../utils/global-consts";
import Button from "../../components/Inputs/Button";
import { useNavigate } from "react-router-dom";
import invokeToast from "../../utils/invokeToast"
import Loading from "../../components/Loading";
import { addingInitArr, modifyItemOfArray } from "../../utils/generical-functions";
import { getStudentsProfessorApi, getSupervisorsApi, registrationApi } from "../../api/professor";
import ModalBasic from "../../components/Modals/ModalBasic";
import ModalSupervisors from "../../components/Modals/ModalSupervisors";

const formDummy = {
    cycle: '',
    name: '',
    supervisor: '',
    state: '',
}

export default function Students () {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)
    const [loading, setLoading] = useState(false)
    const [modalRegister, setModalRegister] = useState(false)
    const [modalSupervisor, setModalSupervisor] = useState(false)
    const [student, setStudent] = useState(null)
    const [supervisor, setSupervisors] = useState([])
    const [cycles, setCycles] = useState([])
    const [actualCycle, setActualCycle] = useState(null)

    useEffect(()=> {
        async function fetchData() {
            const response = await getSupervisorsApi('1');
            if(response.success) {
                setSupervisors(response.result)
            }
            const response2 = await getPeriodsApi();
            if(response2.success) {
                const arr = []
                for(let item of response2.result) {
                    arr.push({
                        value: `${item.id}`,
                        name: `${Math.floor(item.id/10)} - ${Math.floor(item.id%10)}`
                    })
                }
                setActualCycle(response2.result[0])
                setCycles(arr)
            }
        }
        fetchData();
    },[])

    const onSearch = async () => {
        setLoading(true)
        const response = await getStudentsProfessorApi(form);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
        setLoading(false)
    }

    const getOptions = item => {
        const register = {
            icon: 'bi bi-hand-thumbs-up-fill',
            color: item.state==='Aprobado' && item.state!=='Desaprobado'? '#6c757d': item.state==='Matriculado'? '#dc3545': '#198754',
            text: item.enrollment? 'Desmatricular': 'Matricular',
            fn: ()=> openModal(item, 'register'),
        }
        const profile = {
            icon: 'bi bi-person-fill',
            text: 'Ver Perfil',
            fn: ()=>navigate(`/profile/student/${item.id}`),
        }
        const change = {
            icon: 'bi bi-arrow-return-left',
            text: 'Cambiar Sup.',
            fn: ()=> openModal(item, 'supervisor'),
        }
        const arr = [register,profile,change]
        return arr
    }

    const openModal = (item, name) => {
        setStudent(item)
        if(name==='register') setModalRegister(true)
        else if(name==='supervisor') setModalSupervisor(true)
    }

    const registration = async () => {
        const stud = {
            ...student,
            enrollment: !student.enrollment,
            state: !student.enrollment? 'Matriculado': 'No Matriculado'
        }
        setLoading(true)
        const response = await registrationApi({specialty: user.specialty, cycle: actualCycle.id, student: student.id});
        if(response.success) {
            invokeToast("success", "Matrícula modificada!")
            setData(modifyItemOfArray(data,stud, 'id'))
            setModalRegister(false)
        } else invokeToast("error", response.message)
        setLoading(false)
    }


    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={"Ciclo"} small shadow>
                        <InputCombo list={addingInitArr(cycles)} setData={setForm} attribute={"cycle"} data={form} />
                    </Section>
                    <Section title={"Nombre del estudiante o código"} small shadow>
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                    </Section>
                    <Section title={"Supervisor"} small shadow>
                        <InputCombo list={addingInitArr(supervisor)} setData={setForm} attribute={"supervisor"} data={form} />
                    </Section>
                    <Section title={"Estado de matrícula"} small shadow>
                        <InputCombo list={registrationStatuses} setData={setForm} attribute={"state"} data={form} />
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Resultados"}>
                        {!loading && 
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.name} (${item.code})`}
                                    text2={`Supervisor: ${item.supervisor}`}
                                    text3={`Nota: ${item.score===-1? "Sin calificar": item.score}`}
                                    text4={`(${item.state})`}
                                    userId={item.id}
                                    photo={item.photo}
                                    profile={"student"}
                                    circleState={item.state==='Aprobado'? 1: item.state==='Desaprobado'? -1: 0}
                                >
                                    <OptionsIcon listIcons={getOptions(item)} visibleText verticalIcons/>
                                </Card>
                            ))
                        }
                        {loading && <Loading size={180} />}
                    </Section>
                </div>
                {student && <ModalBasic handleClick={registration} setShow={setModalRegister} show={modalRegister} title={`${!student.enrollment? "Matricular": "Desmatricular"} a ${student.name}`}>
                    <div>
                        <p>¿Desea {!student.enrollment? "Matricular": "Desmatricular"} al estudiante {student.name} en el semestre {Math.floor(actualCycle.id/10)} - {Math.floor(actualCycle.id%10)}?</p>
                    </div>
                </ModalBasic>}
                {student && <ModalSupervisors setShow={setModalSupervisor} show={modalSupervisor} arrSups={supervisor} 
                    actualCycle={actualCycle} student={student} setArrStudents={setData} arrStudents={data}/>}
            </div>
        </div>
    )
}