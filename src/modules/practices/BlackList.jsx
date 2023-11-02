import Header from "../../components/Header";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import { blacklistStates } from "../../utils/global-consts";
import Button from "../../components/Inputs/Button";
import { getEnterprisesBLApi } from "../../api/enterprise";
import { useNavigate } from "react-router-dom";
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";

const formDummy = {
    name: '',
    state: ''
}

export default function BlackList () {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)
    const [loading, setLoading] = useState(false)

    const onSearch = async () => {
        setLoading(true)
        const response = await getEnterprisesBLApi(form);
        if(response.success) {
            setData(response.result)
        } else invokeToast("error", response.message)
        setLoading(false)
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Nombre de la empresa o RUC`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                    </Section>
                    <Section title={"Estado de la empresa"} small shadow>
                        <InputCombo list={blacklistStates} setData={setForm} attribute={"state"} data={form} />
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"} title={"Resultados"}>
                        {!loading && 
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.name}`}
                                    text2={`RUC: ${item.ruc}`}
                                    text3={`Opiniones: ${item.num_opinios}`}
                                    text4={`(${item.state==='A'? "Activo": item.state==='B'? "En lista negra": "En análisis"})`}
                                    userId={item.id}
                                    profile={"enterprise"}
                                    photo={item.photo}
                                    score={item.score}
                                    circleState={item.state==='A'? 1: item.state==='B'? -1: 0}
                                >
                                    <OptionsIcon visibleText verticalIcons listIcons={[{icon: 'bi bi-clipboard-data', 
                                        text: 'Ver discusión', fn: ()=> navigate(`/practices/black-list/enterprise/${item.id}`)}]} />
                                </Card>
                            ))
                        }
                        {loading && <Loading size={180} />}
                    </Section>
                </div>
            </div>
        </div>
    )
}
