import { useState } from "react"
import "./scss/Section.scss"
import InputTextarea from "./Inputs/InputTextarea"
import { FormControl } from "react-bootstrap"
import ModalBasic from "./Modals/ModalBasic"
import invokeToast from "../utils/invokeToast"
export default function DescriptionsJob ({data, setData, attribute, canEdit=false}) {
    
    return (
        <div className="descriptionsJob">
            {
                data[attribute].map((item, key) => (
                    <DescriptionSection item={item} key={key} index={key} canEdit={canEdit}
                         setData={setData} data={data} attribute={attribute}/>
                ))
            }
        </div>
    )
}

function DescriptionSection({item, index, canEdit,setData,data,attribute}) {
    const [editMode, setEditMode] = useState(item.title==='' && item.description==='')
    const [show, setShow] = useState(false)

    const setItem = (newItem) => {
        const newArr = data[attribute]
        newArr[index] = newItem

        setData({
            ...data,
            [attribute]: newArr
        })
    }

    const handleTitle = e => {
        const value = e.target.value
        setItem({
            ...item,
            title: value
        })
    }
    const deleteThisSection = () => {
        const newArr = []
        const arr = data[attribute]
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(index!==i) newArr.push(element)
        }
        setData({
            ...data,
            [attribute]: newArr
        })
        setShow(false)
    }

    const saveChanges = () => {
        if(data[attribute][index].title==='') {
            invokeToast("warning", "Debe colocar un título a esta sección")
        } else if (data[attribute][index].description==='') {
            invokeToast("warning", "Debe añadir contenido en esta sección")
        } else {
            setEditMode(false)
        }
    }

    return (
        <div className={`section`}>
            <div className="section_super-title">
                {!editMode && <div className={`section_title small`}>
                    <i className={`bi bi-justify-left`}></i>
                    <span>{item.title}</span>
                </div>}
                {editMode && <div className={`section_title small`}>
                <FormControl className='inputText'
                    size="sm" 
                    value={item.title}
                    maxLength={50}
                    style={{width: "600px"}}
                    onChange={handleTitle}
                />
                </div>}
                {canEdit && !editMode && <div className="section_super-title_ops">
                    <i className={`bi bi-pencil-fill`} onClick={()=> setEditMode(true)}></i>
                    <i className={`bi bi-trash-fill`} onClick={()=>setShow(true)}></i>
                </div>}
                {canEdit && editMode &&<div className="section_super-title_ops">
                    <i className={`bi bi-check-circle-fill`} onClick={saveChanges}></i>
                </div>}
            </div>
            <div className="section_content_p">
                {!editMode && <p>{item.description}</p>}
                {editMode && 
                    <InputTextarea attribute={'description'} rows={10} data={item} setData={setItem}/>
                }
            </div>
            <ModalBasic handleClick={deleteThisSection} setShow={setShow} show={show} title={"Eliminar sección"}>
                <span>¿Desea eliminar esta sección?</span>
            </ModalBasic>
        </div>
    )
}