import Section from "../../components/Section";
import {useEffect, useState } from "react";
import user from "../../assets/jpg/user.jpg";
import enterprise1 from "../../assets/jpg/enterprise1.jpg";
import university2 from "../../assets/jpg/university2.jpg";
import Score from "../../components/Score";
import InputText from "../../components/Inputs/InputText";
import {getLocationsApi, getSectorsApi} from "../../api/sysData"
import InputCombo from "../../components/Inputs/InputCombo";
import { generateRange } from "../../utils/generical-functions";
import { numEmployees } from "../../utils/global-consts";
import ModalBasic from "../../components/Modals/ModalBasic";
import useAuth from "../../hooks/useAuth";
import { updateProfileApi } from "../../api/auth";
import InputTextarea from "../../components/Inputs/InputTextarea";
import invokeToast from "../../utils/invokeToast"


export default function BasicInfo ({data, myself=false}) {
    const {updateUser} = useAuth()
    const [editMode, setEditMode] = useState(false);
    const [updates, setUpdates] = useState(data)
    const [locations, setLocations] = useState([]);
    const [modal, setModal] = useState(false)
    const [sectors, setSectors] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response1 = await getLocationsApi({name: '', active:true});
            const response2 = await getSectorsApi({name: '', active:true});
            if(response1.success) {
                setLocations(response1.result)
            }
            if(response2.success) {
                setSectors(response2.result)
            }
        }
        fetchData();
    }, [])

    const getBasics = (role) => {
        switch (role) {
            case "STUDENT": return `${data.specialty_name} - ${data.cycle=='-1'? 'Egresado': `${data.cycle}° ciclo`}`;
            case "ENTERPRISE": return `${getNameByv(data.sector, sectors)} (${data.numEmployees} empleados) • ${data.phone}`;
            case "PROFESSOR": return `${data.specialty_name}`;
            default: return `${data.enterprise_name} - ${data.job} • ${data.phone}`;
        }
    }

    const generateCycles = () => {
        const arrNums = generateRange(1,data.max_cycles+1,1);
        const preResult = arrNums.map(item => ({value: `${item}`, name: `${item}`}))
        preResult.push({value: `${'-1'}`, name: `${'Egresado'}`})
        return preResult
    }

    const saveChanges = async () => {
        const response = await updateProfileApi(updates);
        if(response.success && response.result) {
            updateUser(updates)
            window.location.reload()
            invokeToast("success", "Actualización de datos exitosa")
        } else {
            invokeToast("error", response.message)
        }
    }

    const getNameByv = (id, arr) => {
        for(let item of arr) {
            if(id == item.value) return item.name
        }
        return '?'
    }

    return (
        <div className="basicinfo">
            <div className="basicinfo_main">
                <figure className="basicinfo_main_back">
                    <img src={(data.role==='STUDENT' || data.role==='PROFESSOR')? university2: enterprise1} alt="profile" />
                </figure>
                <div className="basicinfo_main_details">
                    <div className="basicinfo_main_details_title">
                        {/* No Edit Mode */}
                        {!editMode && <span>{data.name.toUpperCase()} {data.role!=='ENTERPRISE'? data.lastname.toUpperCase(): ''} {data.role==="STUDENT"? `(${data.code})`: 
                            data.role==="ENTERPRISE"? `(${data.ruc})`: ''}
                        </span>}
                        {data.role==="ENTERPRISE" && !editMode && <Score score={data.score} showScore/>}
                        {myself && !editMode && <i className="bi bi-pencil-fill" onClick={()=> setEditMode(true)}></i>}
                        {/* Edit Mode */}
                        {editMode && <InputText data={updates} setData={setUpdates} attribute={"name"} placeholder={data.role==='ENTERPRISE'? "Razón social": "Nombre"}/>}
                        {editMode && data.role!=='ENTERPRISE' && <InputText data={updates} setData={setUpdates} attribute={"lastname"}/>}
                        {editMode && <div className="section_super-title_ops">
                            <i className={`bi bi-check-circle-fill`} onClick={()=> setModal(true)} ></i>
                            <i className={`bi bi-x`} onClick={()=> setEditMode(false)} style={{fontSize: "28px"}}></i>
                        </div>}
                    </div>
                    {/* No Edit Mode */}
                    {!editMode && <span>{getBasics(data.role)}</span>}
                    {/* Edit Mode */}
                    {editMode && <div className="basicinfo_main_details_edit">
                        {data.role==="EMPLOYED" && <InputText data={updates} setData={setUpdates} attribute={"job"} placeholder={"Puesto de trabajo"}/>}
                        {data.role==="ENTERPRISE" && <InputCombo list={sectors} setData={setUpdates} attribute={"sector"} data={updates} />}
                        {(data.role==="EMPLOYED" || data.role==="ENTERPRISE") && <InputText data={updates} setData={setUpdates} attribute={"phone"} placeholder={"Número de teléfono"}/>}
                    </div>}
                    {/* No Edit Mode */}
                    {!editMode && <span>{data.role==="ENTERPRISE"? "Ubicado": "Vive"} en {getNameByv(data.location, locations)} - <strong>{data.email}</strong></span>}
                    {/* Edit Mode */}
                    {editMode && <div className="basicinfo_main_details_edit">
                        <InputCombo list={locations} setData={setUpdates} attribute={"location"} data={updates} />
                        {data.role==="ENTERPRISE" && <InputCombo list={numEmployees} setData={setUpdates} attribute={"numEmployees"} data={updates} />}
                        {data.role==="STUDENT" && <InputCombo list={generateCycles()} setData={setUpdates} attribute={"cycle"} data={updates} />}
                    </div>}
                </div>
                <figure className="basicinfo_main_photo">
                    <img src={data.photo !== ''? data.photo: user} alt="user" />
                </figure>
            </div>
            <Section icon={"bi bi-justify-left"}
                title={data.role==="ENTERPRISE"? "Acerca de la empresa": "Reseña personal"}>
                {!editMode && <p style={{fontSize: "14px"}}>{data.description}</p>}
                {editMode && 
                    <InputTextarea cols={90} rows={10} attribute={"description"} data={updates} setData={setUpdates} />
                }
            </Section>
            <ModalBasic title={`Confirmar cambios`} show={modal} setShow={setModal} handleClick={saveChanges}>
                <span>¿Desea guardar los cambios en su perfil?</span>
            </ModalBasic>
        </div>
    )
}