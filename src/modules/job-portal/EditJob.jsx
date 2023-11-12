import {useEffect, useState } from "react";
import "./scss/SearchJob.scss"
import Section from "../../components/Section";
import Button from "../../components/Inputs/Button";
import InputText from "../../components/Inputs/InputText";
import InputCheck from "../../components/Inputs/InputCheck";
import InputCombo from "../../components/Inputs/InputCombo";
import { modalitiesType } from "../../utils/global-consts";
import InputDate from "../../components/Inputs/InputDate";
import DescriptionsJob from "../../components/DescriptionsJob";
import invokeToast from "../../utils/invokeToast";
import { updateJobApi } from "../../api/job";
import { getTime5h, nowTime } from "../../utils/generical-functions";

export default function EditJob ({initForm,setEditMode}) {
    // const {user} = useAuth();
    const [form, setForm] = useState(initForm)

    useEffect(()=> {
        const cop = initForm
        setForm(cop)
    }, [])

    const udapteJob = async () => {
        if(verify()) {
            const response = await updateJobApi(form)
            if(response.success && response.result) {
                window.location.reload()
            } else {
                invokeToast("error", response.message)
            }
        }
    }

    const verify = () => {
        if(!form.active) return true;
        if(form.job_title==='') {
            invokeToast("warning", "Debe ingresar el nombre del puesto de trabajo"); return false;
        }
        if(form.salary==='') {
            invokeToast("warning", "El salario no puede ser un campo vacío"); return false;
        }
        if(form.max==='') {
            invokeToast("warning", "Debe ingresar el número máximo de postulantes"); return false;
        }
        if(form.vacancies==='') {
            invokeToast("warning", "Debe ingresar el número de vacantes"); return false;
        }
        if(form.date_init==='') {
            invokeToast("warning", "Debe ingresar la fecha de inicio de postulación"); return false;
        }
        if(form.date_end==='') {
            invokeToast("warning", "Debe ingresar la fecha de fin de postulación"); return false;
        }
        if(getTime5h(form.date_end) < nowTime()) {
            invokeToast("warning", "La fecha de fin de postulación no puede ser anterior a la fecha actual"); return false;
        }
        if(new Date(form.date_end) < new Date(form.date_init)) {
            invokeToast("warning", "La fecha de fin de postulación no puede ser anterior a la fecha de inicio"); return false;
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
        <div className="single-cont">
            <Section>
                <Section title={`Nombre del puesto de trabajo`} small>
                    <InputText data={form} setData={setForm} attribute={"job_title"}/>
                </Section>
                <Section title={`Publicación activa`} small>
                    <div style={{display: 'flex', gap: '16px'}}>
                        <InputCheck data={form} setData={setForm} attribute={"active"} withInput/>
                        <span>Advertencia: Si desmarca esta sección la publicación se eliminará</span>
                    </div>
                </Section>
                <div className="create-job_section">
                    <Section title={`Sueldo (soles)`} small>
                        <InputText data={form} setData={setForm} attribute={"salary"} isNumber maxLength={8}/>
                    </Section>
                    <Section title={`Fecha de inicio de postulación`} small>
                        <InputDate data={form} setData={setForm} attribute={"date_init"}/>
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
                        <InputText data={form} setData={setForm} attribute={"max_applicants"} isNumber maxLength={5}/>
                    </Section>
                    <Section title={`Fecha de inicio del empleo`} small>
                        <InputDate data={form} setData={setForm} attribute={"job_start"}/>
                    </Section>
                    <Section title={`Fecha de fin del empleo`} small>
                        <InputDate data={form} setData={setForm} attribute={"job_end"}/>
                    </Section>
                </div>
            </Section>
            <DescriptionsJob data={form} setData={setForm} attribute={"sections"} canEdit/>
            <div className="div_plus">
                <i className="bi bi-plus-circle" onClick={addSection}></i>
            </div>
            <div className="div_plus">
                <Button title="Cancelar" handleClick={()=> setEditMode(false)} variant="danger" icon="bi bi-x"/>
                <Button title="Guardar" handleClick={udapteJob} variant="primary" icon="bi bi-check"/>
            </div>
        </div>
    )
}
