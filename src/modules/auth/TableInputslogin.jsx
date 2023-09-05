import {generateRange} from "../../utils/generical-functions"
import InputText from "../../components/Inputs/InputText";
import Section from "../../components/Section";
import { useEffect, useState} from "react";
import "./scss/Login.scss"
import InputCombo from "../../components/Inputs/InputCombo";
import InputDate from "../../components/Inputs/InputDate";
import InputRUC from "../../components/Inputs/InputRUC";
import { getSpecialtiesApi } from "../../api/specialty";
import { numEmployees } from "../../utils/global-consts";

export default function TableInputslogin({setData, data, userSelected}) {
    const [specialties, setSpecialties] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await getSpecialtiesApi()
            if(response.success) {
                const specialtiesPre = response.result;
                setSpecialties(specialtiesPre)
                if(specialtiesPre.length>0) {
                    setData({
                        ...data,
                        specialty: specialtiesPre[0].value,
                        cycle: 1,
                    })
                }
            }
        }
        fetchData();
      }, []);


    if (userSelected==='STUDENT') return (<LoginStudent specialties={specialties} data={data} setData={setData}/>)
    if (userSelected==='ENTERPRISE') return (<LoginEnterprise data={data} setData={setData}/>)
    if (userSelected==='EMPLOYED') return (<LoginEmployed data={data} setData={setData}/>)
    return (<LoginProfessor specialties={specialties} data={data} setData={setData}/>)

}

function LoginStudent({specialties, setData, data}) {
    const [cycles, setCycles] = useState([]);

    useEffect(()=> {
        setCycles(generateCycles())
    }, [data.specialty])

    const getCyclesSpecialty = (value) => {
        for (let index = 0; index < specialties.length; index++) {
            const element = specialties[index];
            if(element.value === value) return element.cycles;
        }
        if(specialties.length > 0) return specialties[0].cycles
        return 0;
    }

    const generateCycles = () => {
        const arrNums = generateRange(1,getCyclesSpecialty(data.specialty)+1,1);
        return arrNums.map(item => ({value: `${item}`, name: `${item}`}))
    }

    return (
        <div className="login_container_right_form">
            <div className="login_container_right_form-div">
                <Section title={"Nombres"} small>
                    <InputText data={data} setData={setData} attribute={"name"}/>
                </Section>
                <Section title={"Fecha de nacimiento"} small>
                    <InputDate data={data} setData={setData} attribute={"date"}/>
                </Section>
                <Section title={"Especialidad"} small>
                    <InputCombo list={specialties} setData={setData} attribute={"specialty"} data={data} />
                </Section>
            </div>
            <div className="login_container_right_form-div">
                <Section title={"Apellidos"} small>
                    <InputText data={data} setData={setData} attribute={"lastname"}/>
                </Section>
                <Section title={"Código de estudiante"} small>
                    <InputText data={data} setData={setData} attribute={"code"} maxLength={8} isNumber/>
                </Section>
                <Section title={"Ciclo actual"} small>
                    <InputCombo list={cycles} setData={setData} attribute={"cycle"} data={data} />
                </Section>
            </div>
        </div>
    )
}

function LoginEnterprise({setData, data}) {
    return (
        <div className="login_container_right_form">
            <div className="login_container_right_form-div">
                <Section title={"RUC"} small>
                    <InputRUC data={data} setData={setData}/>
                </Section>
                <Section title={"Fecha de fundación"} small>
                    <InputDate data={data} setData={setData} attribute={"date"}/>
                </Section>
                <Section title={"Número de telefono (principal)"} small>
                    <InputText data={data} setData={setData} attribute={"phone"} maxLength={11} isNumber/>
                </Section>
            </div>
            <div className="login_container_right_form-div">
                <Section title={"Razón social"} small>
                    <InputText data={data} setData={setData} attribute={"name"}/>
                </Section>
                <Section title={"Sector empresarial"} small>
                    <InputText data={data} setData={setData} attribute={"sector"}/>
                </Section>
                <Section title={"Número de empleados"} small>
                    <InputCombo list={numEmployees} setData={setData} attribute={"numEmployees"} data={data} />
                </Section>
            </div>
        </div>
    )
}
function LoginEmployed({setData, data}) {
    return (
        <div className="login_container_right_form">
            <div className="login_container_right_form-div">
                <Section title={"Nombre"} small>
                    <InputText data={data} setData={setData} attribute={"name"}/>
                </Section>
                <Section title={"RUC de la empresa"} small>
                    <InputRUC data={data} setData={setData}/>
                </Section>
                <Section title={"Puesto en la empresa"} small>
                    <InputText data={data} setData={setData} attribute={"job"}/>
                </Section>
            </div>
            <div className="login_container_right_form-div">
                <Section title={"Apellidos"} small>
                    <InputText data={data} setData={setData} attribute={"lastname"}/>
                </Section>
                <Section title={"Fecha de nacimiento"} small>
                    <InputDate data={data} setData={setData} attribute={"date"}/>
                </Section>
                <Section title={"Número de telefono"} small>
                    <InputText data={data} setData={setData} attribute={"phone"} maxLength={11} isNumber/>
                </Section>
            </div>
        </div>
    )
}
function LoginProfessor({setData, data, specialties}) {
    return (
        <div className="login_container_right_form">
            <div className="login_container_right_form-div">
                <Section title={"Nombre"} small>
                    <InputText data={data} setData={setData} attribute={"name"}/>
                </Section>
                <Section title={"Especialidad"} small>
                    <InputCombo list={specialties} setData={setData} attribute={"specialty"} data={data} />
                </Section>
            </div>
            <div className="login_container_right_form-div">
                <Section title={"Apellidos"} small>
                    <InputText data={data} setData={setData} attribute={"lastname"}/>
                </Section>
                <Section title={"Fecha de nacimiento"} small>
                    <InputDate data={data} setData={setData} attribute={"date"}/>
                </Section>
            </div>
        </div>
    )
}