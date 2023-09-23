import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Section from "../../components/Section";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/Inputs/Button";
import { createPeriodApi, getPeriodsApi } from "../../api/sysData";
import "./scss/Admin.scss"
import InputDate from "../../components/Inputs/InputDate";
import ModalBasic from "../../components/Modals/ModalBasic";
import invokeToast from "../../utils/invokeToast";

const cycleDummy = {
    can: false,
    id: 0,
    cycle_end: '',
    cycle_init: '',
    registration_start: ''
}

export default function SysDataAdmin () {
    const {user} = useAuth()
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)
    const [newCycle, setNewCycle] = useState(cycleDummy)

    useEffect(()=> {
        async function fetchData() {
            const response = await getPeriodsApi();
            if(response.success) {
                setNewCycle(getNextCycle(response.result))
                setData(response.result)
            }
        }
        fetchData();
    }, [])

    const getNextCycle = arr => {
        if(arr.length < 1) return {can: false, id: 0}
        const last = arr[0]

        const next = getNext(last.id)
        const endPeriod = new Date(last.cycle_end)
        
        return {...newCycle, can: new Date() < endPeriod, id: next}//
    }
    const getNext = cycle => {
        let sem = cycle%10;
        let year = Math.floor(cycle/10);

        if(sem===1) sem++;
        else {
            sem=1
            year++
        }
        return year*10+sem
    }
    
    const getCycle = cycle => {
        const sem = cycle%10;
        const year = Math.floor(cycle/10);

        return `${year} - ${sem}`
    } 

    const initYear = async () => {
        if(newCycle.registration_start === '') {
            invokeToast('warning', "El campo de inicio de matrícula no puede estar vacío"); return;
        }
        if(newCycle.cycle_init === '') {
            invokeToast('warning', "El campo de inicio de ciclo no puede estar vacío"); return;
        }
        if(newCycle.cycle_end === '') {
            invokeToast('warning', "El campo de fin de ciclo no puede estar vacío"); return;
        }
        if(new Date() > new Date(newCycle.registration_start)) {
            invokeToast('warning', "El inicio de la matrícula debe ser mayor a la fecha actual"); return;
        }
        if(new Date(newCycle.registration_start) > new Date(newCycle.cycle_init)) {
            invokeToast('warning', "El inicio de ciclo debe ser mayor al inicio de la matrícula"); return;
        }
        if(new Date(newCycle.cycle_init) > new Date(newCycle.cycle_end)) {
            invokeToast('warning', "El fin de ciclo debe ser mayor al inicio"); return;
        }
        const response = await createPeriodApi();
        if(response.success && response.result) {
            window.location.reload()
        }
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} idEnterprise={user.enterprise_id}></Header>
            <div className="single-cont">
                <Section title={"Resultados"}>
                    <div className="profile_container_principal_plus">
                        <Button title={`Iniciar ciclo ${getCycle(newCycle.id)}`}
                            icon={"bi bi-plus"}
                            variant={"primary"}
                            circle
                            disabled={newCycle.can}
                            handleClick={()=> setShow(true)}
                        />
                    </div>
                    <div>
                        {
                            data.map((item,key)=> (
                                <Section title={`Ciclo ${getCycle(item.id)}`} small key={key}>
                                    <div className="cycles-admin">
                                        <li>Inicio de matrícula: {item.registration_start}</li>
                                        <li>Inicio del ciclo: {item.cycle_init}</li>
                                        <li>Fin del ciclo: {item.cycle_end}</li>
                                    </div>
                                </Section>
                            ))
                        }
                    </div>
                </Section>
                <ModalBasic setShow={setShow} show={show} handleClick={initYear} 
                    title={`Iniciar ciclo ${getCycle(newCycle.id)}`}>
                        <div style={{display: 'grid', gap: '16px'}}>
                            <Section title={`Inicio de matrícula`} small>
                                <InputDate data={newCycle} setData={setNewCycle} attribute={"registration_start"}/>
                            </Section>
                            <Section title={`Inicio del ciclo`} small>
                                <InputDate data={newCycle} setData={setNewCycle} attribute={"cycle_init"}/>
                            </Section>
                            <Section title={`Fin del ciclo`} small>
                                <InputDate data={newCycle} setData={setNewCycle} attribute={"cycle_end"}/>
                            </Section>
                        </div>
                </ModalBasic>
            </div>
        </div>
    )
}