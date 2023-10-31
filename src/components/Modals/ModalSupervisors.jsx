import { useEffect, useState } from "react";
import "../scss/Modal.scss"
import "../../modules/practices/scss/Practices.scss"
import ModalBasic from "./ModalBasic";
import invokeToast from "../../utils/invokeToast"
import Loading from "../Loading";
import { assignSupervisorApi } from "../../api/professor";
import { modifyItemOfArray } from "../../utils/generical-functions";
import useAuth from "../../hooks/useAuth";

export default function ModalSupervisors({show,setShow,arrSups,student,actualCycle, setArrStudents,arrStudents}) { 
    const [indexSelected, setIndexSelected] = useState(-1)
    const [loading, setLoading] = useState(false)
    const {user} = useAuth()

    useEffect(()=> {
        for(let i=0; i<arrSups.length; i++) {
            const sup = arrSups[i]
            if(student.supervisor_id==sup.value) {
                setIndexSelected(i)
                return;
            }
        }
    },[student.id, student.supervisor_id])

    const handleClick = async () => {
        if(indexSelected!==-1) {
            const sup = arrSups[indexSelected];
            const stud = {
                ...student,
                supervisor_id: sup.value,
                supervisor: sup.name,
            }
            setLoading(true)
            const response = await assignSupervisorApi({specialty: user.specialty, cycle: actualCycle.id, student: student.id, supervisor: sup.value});
            if(response.success) {
                invokeToast("success", "Supervisor asignado!")
                setArrStudents(modifyItemOfArray(arrStudents,stud, 'id'))
                setShow(false)
            } else invokeToast("error", response.message)
            setLoading(false)
        } else {
            invokeToast("warning", "Debe seleccionar un perfil")
        }
    }

  return (
    <ModalBasic handleClick={handleClick} setShow={setShow} title={`Asignar un supervisor para ${student.name}`}
        show={show || loading} noButtons={loading}>
        <div className="students_modal-supervisors">
            <p>Elija al supervisor que revisará los entregables del estudiante {student.name} en el semestre {Math.floor(actualCycle.id/10)} - {Math.floor(actualCycle.id%10)}.</p>
            <div className="students_modal-supervisors_list">
                {!loading && arrSups.map((item, key)=> (
                    <CardUser user={item} key={key} myIndex={key} 
                        indexSelected={indexSelected} setIndexSelected={setIndexSelected}/>
                ))}
                {loading && <Loading size={180}/>}
            </div>
        </div>
    </ModalBasic>
  );
}

function CardUser({user, indexSelected, myIndex, setIndexSelected}) {
    return (
        <div className={`students_modal-supervisors_list-user ${indexSelected===myIndex && "selected"}`} onClick={()=>setIndexSelected(myIndex)}>
            <figure className="students_modal-supervisors_list-user_fig">
                <i className="bi bi-person-fill"></i>
            </figure>
            <div className="students_modal-supervisors_list-user_title">
                <span>{user.name}</span>
            </div>
        </div>
    );
}