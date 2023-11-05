import Header from "../../components/Header";
import {useEffect, useState } from "react";
import "./scss/Practices.scss"
import useAuth from "../../hooks/useAuth";
import Section from "../../components/Section";
import { useNavigate, useParams } from "react-router-dom";
import { getFormOpinionsApi, getStudentOpinionsApi } from "../../api/deliverable";
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

export default function StudentsOpinions () {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {idStudent} = useParams()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [actualStudent, setActualStudent] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const response = await getStudentOpinionsApi(user.enterprise_id);
            if(response.success) {
                setStudents(response.result)
                getDataStudent(response.result)
            }
            setLoading(false)
        }
        fetchData();
    }, [])

    useEffect(() => {
        getDataStudent(students)
    }, [idStudent])

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
                                    text4={item.form_enterprise? 'Completado': "Pendiente"}
                                    photo={item.photo}
                                    circleState={item.form_enterprise? 1: 0}
                                >
                                    <OptionsIcon visibleText listIcons={[{icon: 'bi bi-box-arrow-in-right', 
                                        text: 'Ver', fn: ()=> navigate(`/practices/enterprise/forms/${item.id_student}`)}]}/>
                                </Card>
                            ))
                        }
                    </Section>
                </div>
                <div className="psp_container_results">
                    {students.length>0 && actualStudent && <Section shadow title={"Formulario sobre el desempeño del estudiante"}>
                        <Survey opinion={actualStudent.opinion} person={'e'} />
                    </Section>}
                </div>
            </div>}
            {loading && <Loading size={250} />}
        </div>
    )
}