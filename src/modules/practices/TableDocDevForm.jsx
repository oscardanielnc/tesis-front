import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import { getAssessmentsCycleApi, getDocumentsCycleApi } from "../../api/deliverable";
import "./scss/Practices.scss"
import Docs from "./TableDevDocs/Docs";
import Dels from "./TableDevDocs/Dels";

export default function TableDocDevForm ({option, cycle}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState([])
    const [assessments, setAssessments] = useState([])

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
        <Formul />
    )
}

function Formul() {
    return (
        <span>Formularios</span>
    )
}