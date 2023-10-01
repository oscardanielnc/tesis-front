import { useState } from "react";
import "../scss/Modal.scss"
import ModalBasic from "./ModalBasic";
import invokeToast from "../../utils/invokeToast"
import { goToHome } from "../../utils/generical-functions";
import Loading from "../Loading";

export default function ModalUsers({show,setShow,arrUsers,loading}) { 
    const [indexSelected, setIndexSelected] = useState(-1)

    const handleClick = () => {
        if(indexSelected!==-1) {
            const user = arrUsers[indexSelected];
            goToHome(user)
        } else {
            invokeToast("warning", "Debe seleccionar un perfil")
        }
    }

  return (
      <ModalBasic title={`Seleccione el perfil con el que desea ingresar`} show={show || loading} 
        setShow={setShow} handleClick={handleClick} noButtons={loading}>
        {!loading && <div className="modal-users">
            {
                arrUsers.map((item, key)=> (
                    <CardUser user={item} key={key} myIndex={key} 
                        indexSelected={indexSelected} setIndexSelected={setIndexSelected}/>
                ))
            }
        </div>}
        {loading && <Loading size={180}/>}
      </ModalBasic>
  );
}

function CardUser({user, indexSelected, myIndex, setIndexSelected}) {

    const getTitle = () => {
        if(user.role==='STUDENT') {
            return `Estudiante de ${user.specialty_name}`
        } else if(user.role==='ENTERPRISE') {
            return `Empresa`
        } else if(user.role==='EMPLOYED') {
            return `Empleado de ${user.enterprise_name}`
        } else if(user.role==='PROFESSOR') {
            return `${user.coordinator? 'Coordinador': 'Supervisor'} de ${user.specialty_name}`
        } else if(user.role==='ADMIN') {
            return `Administrador`
        } else if(user.role==='SIGNATORY') {
            return `FIRMANTE`
        } else if(user.role==='EVALUATOR') {
            return `Evaluador`
        }
    }
    return (
        <div className={`card-user ${indexSelected===myIndex && "selected"}`} onClick={()=>setIndexSelected(myIndex)}>
            <figure className="psp-card-profile_fig">
                <i className="bi bi-person-fill"></i>
            </figure>
            <div className="card-user_title">
                <span>{user.name} {user.role!=='ENTERPRISE'? user.lastname: ''}</span>
                <strong>{getTitle()}</strong>
            </div>
        </div>
    );
}