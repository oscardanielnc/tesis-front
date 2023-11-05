import Header from "../../components/Header";
import {useEffect, useState } from "react";
import "./scss/Practices.scss"
import useAuth from "../../hooks/useAuth";
import Section from "../../components/Section";
import { useNavigate, useParams } from "react-router-dom";
import { getFormOpinionsApi } from "../../api/deliverable";
import Card from "../../components/Card";
import { getDateByNumber } from "../../utils/generical-functions";
import OptionsIcon from "../../components/OptionsIcon";
import SelectorTabs from "../../components/SelectorTabs";
import Survey from "./TableDevDocs/Survey";
import Loading from "../../components/Loading";

const arrSelections = [
    {
        value: 's',
        name: 'Estudiante'
    },
    {
        value: 'e',
        name: 'Empresa'
    },
]

export default function FormsByStudent () {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {cycle, idStudent} = useParams()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [actualStudent, setActualStudent] = useState(null)
    const [actualSelection, setActualSelection] = useState(arrSelections[0])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const req = {
                id_student: user.id, 
                id_specialty: user.specialty,
                id_period: cycle
            }
            const response = await getFormOpinionsApi(req);
            if(response.success) {
                setStudents(response.result)
                getDataStudent(response.result)
            }
            setLoading(false)
        }
        fetchData();
    }, [cycle])

    useEffect(() => {
        getDataStudent(students)
    }, [idStudent])

    const getState = (item) => {
        if(!item.enterprise_name || item.enterprise_name=='') {
            return `Empresa no registrada`
        } else if(item.form_student && item.form_enterprise) {
            return `Se han completado los dos formularios`
        } else if(item.form_student) {
            return `Empresa falta completar formulario`
        } else if(item.form_enterprise) {
            return `Estudiante falta completar formulario`
        } else {
            return `Tanto la empresa como el estudiante faltan completar formularios`
        }
    }

    const getDataStudent = (arr) => {
        for(let item of arr) {
            if(item.id_student==idStudent) {
                setActualStudent(item)
                return;
            }
        }
        setActualStudent(null)
    }

    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} 
                idEnterprise={user.enterprise_id} employedNoVerified={user.role==='EMPLOYED' && !user.reader}></Header>
            {!loading && <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Lista de estudiantes`} small shadow>
                        {
                            students.map((item,key) => (
                                <Card key={key}
                                    text1={`${item.name} ${item.lastname}`}
                                    text2={`Empresa: ${item.enterprise_name && item.enterprise_name!=''?item.enterprise_name: 'No registrada'}`}
                                    text3={`Fecha de respuesta del estudiante: ${item.opinion && item.opinion.student_date && item.opinion.student_date!=0? getDateByNumber(item.opinion.student_date): 'Formulario no respondido'}`}
                                    text4={getState(item)}
                                    photo={item.photo}
                                    circleState={item.form_student && item.form_enterprise? 1: item.form_student || item.form_enterprise? 0: -1}
                                >
                                    <OptionsIcon visibleText listIcons={[{icon: 'bi bi-box-arrow-in-right', 
                                        text: 'Ver', fn: ()=> navigate(`/practices/professor/forms/${cycle}/${item.id_student}`)}]}/>
                                </Card>
                            ))
                        }
                    </Section>
                </div>
                <div className="psp_container_results">
                    {students.length>0 && actualStudent && <Section shadow>
                        <div className="form-by-student">
                            <div className="form-by-student_enterprise">
                                <figure>
                                    <img src={actualStudent.enterprise_photo} alt="photo" />
                                </figure>
                                <div className="form-by-student_enterprise_details">
                                    <strong>Empresa: {actualStudent.enterprise_name}</strong>
                                    <span>RUC: {actualStudent.ruc}</span>
                                </div>
                            </div>
                            <SelectorTabs list={arrSelections} valueSelected={actualSelection.value} fitCont
                                handleClick={element => setActualSelection(element)}/>
                        </div>
                        {actualSelection.value==='s' && actualStudent.form_student && <Section title={"Formulario de retroalimentación sobre la práctica"}>
                            <Survey opinion={actualStudent.opinion} person={'s'} />
                        </Section>}
                        {actualSelection.value==='e' && actualStudent.form_enterprise && <Section title={"Formulario sobre el desempeño del estudiante"}>
                            <Survey opinion={actualStudent.opinion} person={'e'} />
                        </Section>}
                        {actualSelection.value==='s' && !actualStudent.form_student && <Section title={"¡Estudiante falta responder encuesta!"}>
                        </Section>}
                        {actualSelection.value==='e' && !actualStudent.form_enterprise && <Section title={"¡Empresa falta responder encuesta!"}>
                        </Section>}
                    </Section>}
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}
