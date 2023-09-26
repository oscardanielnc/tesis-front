import Header from "../../components/Header";
import {useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import Section from "../../components/Section";
import Button from "../../components/Inputs/Button";
import { useNavigate, useParams } from "react-router-dom";
import InputText from "../../components/Inputs/InputText";
import InputCombo from "../../components/Inputs/InputCombo";
import { modalitiesType } from "../../utils/global-consts";
import OptionsIcon from "../../components/OptionsIcon";
import InputDate from "../../components/Inputs/InputDate";
import DescriptionsJob from "../../components/DescriptionsJob";
import invokeToast from "../../utils/invokeToast";
import { createJobApi } from "../../api/job";

const formDummy = {
    job: '',
    salary: '',
    date_end: '',
    modality: '',
    vacancies: '',
    max: '',
    job_start: '',
    job_end: '',
    sections: []
}

export default function CreateJob () {
    const {user} = useAuth();
    const navigate = useNavigate(); 
    const [form, setForm] = useState(formDummy)

    const registerJob = async () => {
        if(verify()) {
            const response = await createJobApi(form)
            if(response.success && response.result.success) {
                navigate(`/job-portal/job/${response.result.code}`)
            }

        }
    }

    const verify = () => {
        if(form.job==='') {
            invokeToast("warning", "Debe ingresar el nombre del puesto de trabajo"); return false;
        }
        if(form.salary==='') {
            invokeToast("warning", "El salario no puede ser un campo vacío"); return false;
        }
        if(form.date_end==='') {
            invokeToast("warning", "Debe ingresar la fecha de fin de postulación"); return false;
        }
        if(new Date(form.date_end) < new Date()) {
            invokeToast("warning", "La fecha de fin de postulación no puede ser anterior a la fecha actual"); return false;
        }
        if(form.modality==='') {
            invokeToast("warning", "Debe ingresar una modalidad de trabajo"); return false;
        }
        if(form.job_start==='') {
            invokeToast("warning", "Debe ingresar la fecha de inicio de actividades"); return false;
        }
        if(new Date(form.job_start) < new Date(form.date_end)) {
            invokeToast("warning", "La fecha de inicio de actividades debe ser mayor al cierre de postulaciones"); return false;
        }
        if(form.job_end==='') {
            invokeToast("warning", "Debe ingresar la fecha de fin de actividades"); return false;
        }
        if(new Date(form.job_end) < new Date(form.job_start)) {
            invokeToast("warning", "La fecha de fin de actividades debe ser mayor a la fecha de inicio"); return false;
        }
        for(let sect of form.sections) {
            if(sect.title==='' || sect.description==='') {
                invokeToast("warning", "Debe guardar todas las secciones que está editando"); return false;
            }
        }
        return true
    }

    const addSection = () => {
        const newSection = form.sections
        newSection.push({
            title: '',
            description: ''
        })
        setForm({
            ...form,
            sections: newSection
        })
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            <div className="single-cont">
                <Section title={"Nueva convocatoria"}>
                    <Section title={`Nombre del puesto de trabajo`} small>
                        <InputText data={form} setData={setForm} attribute={"job"}/>
                    </Section>
                    <div className="create-job_section">
                        <Section title={`Sueldo (soles)`} small>
                            <InputText data={form} setData={setForm} attribute={"salary"} isNumber maxLength={8}/>
                        </Section>
                        <Section title={`Fecha de fin de postulación`} small>
                            <InputDate data={form} setData={setForm} attribute={"date_end"}/>
                        </Section>
                        <Section title={`Modalidad de trabajo`} small>
                            <InputCombo list={modalitiesType} setData={setForm} attribute={"modality"} data={form} />
                        </Section>
                    </div>
                    <div className="create-job_section">
                        <Section title={`Cantidad de vacantes`} small>
                            <InputText data={form} setData={setForm} attribute={"vacancies"} isNumber maxLength={5}/>
                        </Section>
                        <Section title={`Cantidad máxima de postulantes`} small>
                            <InputText data={form} setData={setForm} attribute={"max"} isNumber maxLength={5}/>
                        </Section>
                        <Section title={`Fecha de inicio`} small>
                            <InputDate data={form} setData={setForm} attribute={"job_start"}/>
                        </Section>
                        <Section title={`Fecha de fin`} small>
                            <InputDate data={form} setData={setForm} attribute={"job_end"}/>
                        </Section>
                    </div>
                </Section>
                <DescriptionsJob data={form} setData={setForm} attribute={"sections"} canEdit/>
                <div className="div_plus">
                    <i className="bi bi-plus-circle" onClick={addSection}></i>
                </div>
                <div className="div_plus">
                    <Button title="Regresar" handleClick={()=> navigate('/job-portal/search')} variant="danger" icon="bi bi-x"/>
                    <Button title="Registrar" handleClick={registerJob} variant="primary" icon="bi bi-check"/>
                </div>
            </div>
        </div>
    )
}
