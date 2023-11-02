import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Section from "../../components/Section";
import Card from "../../components/Card";
import { getPeriodsApi } from "../../api/sysData";
import { deliverablesOptions } from "../../utils/global-consts";
import Loading from "../../components/Loading";
import { getProfessorsApi } from "../../api/professor";
import SelectorTabs from "../../components/SelectorTabs";
import TableDocDevForm from "./TableDocDevForm";

export default function DocsDeliverables () {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false)
    const [supervisor, setSupervisors] = useState([])
    const [cycles, setCycles] = useState([])
    const [actualCycle, setActualCycle] = useState(null)
    const [option, setOption] = useState(deliverablesOptions[0])

    useEffect(()=> {
        async function fetchData() {
            setLoading(true)
            const response = await getProfessorsApi(user.specialty);
            if(response.success) {
                setSupervisors(response.result)
            }
            const response2 = await getPeriodsApi(user.role==='STUDENT'? user.id: 'x');
            if(response2.success) {
                const arr = []
                for(let item of response2.result) {
                    arr.push({
                        value: `${item.id}`,
                        name: `${Math.floor(item.id/10)} - ${Math.floor(item.id%10)}`
                    })
                }
                setActualCycle(arr[0])
                setCycles(arr)
            }
            setLoading(false)
        }
        fetchData();
    },[])

    const handleChangeUser = (element) => {
        setActualCycle(element);
    }
    const handleChangeOption = (element) => {
        setOption(element);
    }


    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="psp_container">
                <div className="psp_container_form">
                    {actualCycle && <SelectorTabs list={cycles} valueSelected={actualCycle.value} fitCont
                        handleClick={element => handleChangeUser(element)}/>}
                    {
                        !actualCycle && <span>Alumno no registrado en PSP</span>
                    }
                    <Section title={'Información del ciclo'}>
                        {
                            supervisor.map((item,key)=> (
                                <Card key={key} 
                                    text1={`${item.name}`}
                                    text2={`${item.coordinator? 'Coordinador': 'Supervisor'}`}
                                    // userId={item.id}
                                    photo={item.photo}
                                    // profile={"professor"}
                                >
                                </Card>
                            ))
                        }
                    </Section>

                    <SelectorTabs list={deliverablesOptions} valueSelected={option.value} vertical
                        handleClick={element => handleChangeOption(element)}/>
                </div>
                <div className="psp_container_results">
                    {actualCycle && <TableDocDevForm option={option.value} cycle={actualCycle.value}/>}
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}