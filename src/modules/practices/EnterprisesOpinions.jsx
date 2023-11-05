import Header from "../../components/Header";
import {useEffect, useState } from "react";
import "./scss/Practices.scss"
import useAuth from "../../hooks/useAuth";
import Section from "../../components/Section";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import {  getLocationsApi, getSectorsApi } from "../../api/sysData";
import {  opinionsOptions } from "../../utils/global-consts";
import Button from "../../components/Inputs/Button";
import { useNavigate } from "react-router-dom";
import invokeToast from "../../utils/invokeToast";
import Loading from "../../components/Loading";
import CardProfile from "../../components/CardProfile";
import { getEnterprisesOpinionsApi } from "../../api/enterprise";

const formDummy = {
    name: '',
    sector: '',
    location: '',
    orderBy: '',
}

export default function EnterprisesOpinions () {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [form, setForm] = useState(formDummy)
    const [locations, setLocations] = useState([]);
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            //locations
            const response1 = await getLocationsApi({name: '', active:true});
            if(response1.success) {
                setLocations(response1.result)
            }
            const response3 = await getSectorsApi({name: '', active: true});
            if(response3.success) {
                setSectors(response3.result)
            }
        }
        fetchData();
    }, [])

    const onSearch = async () => {
        setLoading(true)
        const response = await getEnterprisesOpinionsApi(form);
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
                    <Section title={`Nombre de la empresa`} small shadow>
                        <InputText data={form} setData={setForm} attribute={"name"}/>
                    </Section>
                    <Section title={"Sector empresarial"} small shadow>
                        <InputCombo list={sectors} setData={setForm} attribute={"sector"} data={form} />
                    </Section>
                    <Section title={"Ubicación"} small shadow>
                        <InputCombo list={locations} setData={setForm} attribute={"location"} data={form} />
                    </Section>
                    <Section title={"Ordenar por"} small shadow>
                        <InputCombo list={opinionsOptions} setData={setForm} attribute={"orderBy"} data={form} />
                    </Section>
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Buscar"} center handleClick={onSearch}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    <Section icon={"bi bi-briefcase-fill"} title={"Resultados"}>
                        {!loading && 
                            <div className="enterprises-opinions-tabs">
                                {data.map((item, index) => (
                                    <CardProfile name={item.enterprise_name} score={item.enterprise_score} 
                                        photo={item.enterprise_photo} profile={"enterprise"} key={index}
                                        subTitle={`${item.enterprise_sector}, ubicado en ${item.enterprise_location}`} 
                                        thrTitle={`${item.num_employees} empleados (${item.num_opinios} opiniones)`} 
                                        idUser={item.enterprise_id} isOpinion/>
                                ))}
                            </div>
                        }
                        {loading && <Loading size={180} />}
                    </Section>
                </div>
            </div>
        </div>
    )
}
