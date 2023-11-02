import {useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Section from "../../../components/Section";
import OptionsIcon from "../../../components/OptionsIcon";
import Card from "../../../components/Card";
import { deleteDocumentCycleApi } from "../../../api/deliverable";
import ModalBasic from "../../../components/Modals/ModalBasic";
import InputText from "../../../components/Inputs/InputText";
import InputTextarea from "../../../components/Inputs/InputTextarea";
import Button from "../../../components/Inputs/Button";
import "../scss/Practices.scss"
import invokeToast from "../../../utils/invokeToast";
import { uploadDocCycleApi } from "../../../api/doc";
import { getDateByNumber } from "../../../utils/generical-functions";

const docDummy = {
    title: '',
    descripcion: '',
}
export default function Docs({documents,cycle}) {
    const {user} = useAuth();
    const [modal, setModal] = useState(false)
    const [modalDel, setModalDel] = useState(false)
    const [form, setForm] = useState(docDummy)
    const [file, setFile] = useState(null)
    const [doc, setDoc] = useState(null)

    const upDocname = updatedList => {
        const doc = updatedList[0]
        setFile(doc)
    }

    const uploadDoc = async () => {
        if(form.title=='') {
            invokeToast("warning", "Debe agregar un título a este documento")
            return;
        }
        if(!file) {
            invokeToast("warning", "Falta subir el documento")
            return;
        }

        const req = {
            ...form,
            specialty: user.specialty,
            cycle: cycle,
            id_profesor: user.id,
        }
        const response = await uploadDocCycleApi([file],req)
        if(response.success && response.result) {
            invokeToast("success", "Documento subido")
            window.location.reload()
        } else invokeToast("error", response.message)
    }
    const getOptions = (item) => {
        const down = {
            icon: 'down',
            fn: ()=> `${item.path}/${item.title}`,
            text: "Descargar"
        }
        const del = {
            icon: 'bi bi-trash-fill',
            fn: ()=> showModalDelete(item),
            text: "Eliminar"
        }
        const arr = [down]
        if(user.coordinator) arr.push(del)
        return arr
    }

    const showModalDelete = (item) => {
        setDoc(item)
        setModalDel(true)
    }

    const deleteDoc = async () => {
        const response = await deleteDocumentCycleApi({id_document: doc.id_document})
        if(response.success && response.result) {
            invokeToast("success", "Documento Eliminado")
            window.location.reload()
        } else invokeToast("error", response.message)
    }

    return (
        <Section title={"Documentos del curso"}>
            {user.role==="PROFESSOR" && user.coordinator && <div className="profile_container_principal_plus">
                <Button title={`Añadir documento`}
                    icon={"bi bi-plus"}
                    variant={"primary"}
                    circle
                    handleClick={()=>setModal(true)}
                />
            </div>}
            <div>
                {
                    documents.map((item,index)=> (
                        <Card key={index} 
                            text1={`${item.title}`}
                            text2={item.descripcion}
                            text3={`Subido el: ${getDateByNumber(item.date)}`}
                        >
                            <OptionsIcon listIcons={getOptions(item)} visibleText verticalIcons/>
                        </Card>
                    ))
                }
            </div>
            <ModalBasic handleClick={uploadDoc} setShow={setModal} show={modal} title={`Subir documento`}>
                <Section title={"Título"} small>
                    <InputText attribute={"title"} data={form} setData={setForm} />
                </Section>
                <Section title={"Descripción"} small>
                    <InputTextarea rows={6} attribute={"descripcion"} data={form} setData={setForm} />
                </Section>
                <div className="table-docdeliv-docs">
                    <OptionsIcon listIcons={[{icon: 'up', text: 'Subir Doc.', fn: (updatedList)=> upDocname(updatedList)}]} visibleText verticalIcons/>
                    {file && <span>{file.name}</span>}
                </div>
            </ModalBasic>
            {doc && <ModalBasic handleClick={deleteDoc} setShow={setModalDel} show={modalDel} title={`Eliminar documento`}>
                <p>¿Está seguro que desea eliminar este documento? "{doc.title}"</p>
            </ModalBasic>}
        </Section>
    )
}