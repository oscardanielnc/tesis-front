import Header from "../../components/Header";
import {useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import OptionsIcon from "../../components/OptionsIcon";
import Section from "../../components/Section";
import Card from "../../components/Card";
import InputText from "../../components/Inputs/InputText";
import Button from "../../components/Inputs/Button";
import InputCheck from "../../components/Inputs/InputCheck";
import { getEmployeesApi } from "../../api/employed";

const formDummy = {
    name: '',
    job: '',
    reader: false,
    signatory: false,
    recruiter: false,
}

export default function SearchJob () {
    const {user} = useAuth();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)

    const onSearch = async () => {
        const response = await getEmployeesApi();
        if(response.success) {
            setData(response.result)
        }
    }

    const getPrivilegies = (reader, signatory, recruiter) => {
        return [
            {
                icon: reader? 'bi bi-check-circle-fill': 'bi bi-exclamation-octagon-fill', 
                color: reader? '#198754': '#dc3545', 
                text: reader? 'Verificado': 'No Verificado'
            },
            {
                icon: 'bi bi-badge-ad-fill', 
                color: recruiter? '#699BF7': '#666', 
                text: recruiter? 'Reclutador': 'No Reclutador'
            },
            {
                icon: 'bi bi-file-earmark-richtext-fill', 
                color: signatory? '#699BF7': '#666', 
                text: signatory? 'Firmante': 'No Firmante'
            },
        ]
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} idEnterprise={user.enterprise_id}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Nombre`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                    </Section>
                    <Section title={`Puesto de trabajo`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"job"}/>
                    </Section>
                    <Section title={`Privilegios`} small shadow>
                        <div>
                            <InputCheck withInput data={form} setData={setForm} attribute={"reader"} 
                                states={[{icon: 'bi bi-check-circle-fill', color: '#198754', text: 'Lector (usuario verificado)'},
                                        {icon: 'bi bi-exclamation-octagon-fill', color: '#dc3545', text: 'Lector (usuario verificado)'}]}
                            />
                            <InputCheck withInput data={form} setData={setForm} attribute={"recruiter"} 
                                states={[{icon: 'bi bi-badge-ad-fill', color: '#699BF7', text: 'Reclutador'},
                                        {icon: 'bi bi-badge-ad-fill', color: '#666', text: 'Reclutador'}]}
                            />
                            <InputCheck withInput data={form} setData={setForm} attribute={"signatory"} 
                                states={[{icon: 'bi bi-file-earmark-richtext-fill', color: '#699BF7', text: 'Firmante'},
                                        {icon: 'bi bi-file-earmark-richtext-fill', color: '#666', text: 'Firmante'}]}
                            />
                        </div>
                    </Section>
                    
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"}
                        title={"Resultados"}>
                        {
                            data.map((item, index) => (
                                <Card key={index} 
                                    text1={`${item.name}`}
                                    text2={`${item.job}`}
                                    text3={`Actualización de privilegios: ${item.date_update}`}
                                    userId={item.user_id}
                                    photo={item.user_photo}
                                    circleState={-2}
                                >
                                    <OptionsIcon listIcons={getPrivilegies(item.reader, item.signatory, item.recruiter)}/>
                                </Card>
                            ))
                        }
                    </Section>
                </div>
            </div>
        </div>
    )
}
