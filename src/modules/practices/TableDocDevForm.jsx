import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import { getAssessmentsCycleApi, getDocumentsCycleApi, getFormOpinionsApi, getMyFormOpinionApi } from "../../api/deliverable";
import "./scss/Practices.scss"
import Docs from "./TableDevDocs/Docs";
import Dels from "./TableDevDocs/Dels";
import Form from "./TableDevDocs/Form";

export default function TableDocDevForm ({option, cycle}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState([])
    const [assessments, setAssessments] = useState([])
    const [myForm, setMyForm] = useState(null)
    const [listOpinions, setListOpinions] = useState([])

    useEffect(()=> {
        async function fetchData() {
            setLoading(true)
            const response = await getDocumentsCycleApi(cycle,user.specialty);
            if(response.success) {
                setDocuments(response.result)
            }
            const idStudent = user.role==='STUDENT'? user.id: 'x'
            const response2 = await getAssessmentsCycleApi(cycle,user.specialty, idStudent);
            if(response2.success) {
                setAssessments(response2.result)
            }
            const req = {
                id_student: user.id, 
                id_specialty: user.specialty,
                id_period: cycle
            }
            if(user.role==='STUDENT') {
                const response3 = await getMyFormOpinionApi(req);
                console.log(response3)
                if(response3.success) {
                    setMyForm(response3.result)
                }
            } else {
                const response3 = await getFormOpinionsApi(req);
                console.log(response3)
                if(response3.success) {
                    setListOpinions(response3.result)
                }
            }
            setLoading(false)
        }
        fetchData();
    },[cycle])

    if(loading) return <Loading size={180} />

    if(option==='docs') return (
        <Docs documents={documents} cycle={cycle}/>
    )
    if(option==='dev') return (
        <Dels assessments={assessments} cycle={cycle}/>
    )
    if(option==='form') return (
        <Form myForm={myForm} cycle={cycle} listOpinions={listOpinions}/>
    )
}
