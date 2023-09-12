import { useEffect, useState } from "react";
import { getLanguagesApi, setMyLenguageApi, updateMyLenguageApi } from "../../api/sysData";
import { languageLeves } from "../../utils/global-consts";
import InputCombo from "../Inputs/InputCombo";
import "../scss/Modal.scss"
import ModalBasic from "./ModalBasic";
import useAuth from "../../hooks/useAuth";
import invokeToast from "../../utils/invokeToast"

function ModalLanguage({show, setShow, type, myData, lanEdit={value: '', level: 'Básico'}, isEnterprise=false}) { 
    const {user, updateUser} = useAuth()
    const [languages, setLanguages] = useState([]);
    const [noNanguages, setNoLanguages] = useState([]);
    const [form, setForm] = useState(lanEdit);


    useEffect(() => {
        async function fetchData() {
            const response = await getLanguagesApi();
            if(response.success) {
                setLanguages(response.result)
                setNoLanguages(noElementsInArr(response.result, myData))
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        setForm({
            value: lanEdit.value!==''? lanEdit.value: noNanguages[0]? noNanguages[0].value: '',
            level: lanEdit.level
        })
    }, [lanEdit.value])


    const noElementsInArr = (arr1, arr2) => {
        const arr = []
        for(let element of arr1) {
            let exist = false;
            for(let e of arr2) {
                if(e.value == element.value) exist=true;
            }
            if(!exist) arr.push(element)
        }
        return arr;
    }

    const handleClick = async () => {
        if(form.value !== '') {
            if(type==='edit') {
                const response = await updateMyLenguageApi({idUser: user.id, idLanguage: form.value, level: form.level})
                if(response.success && response.result) {
                    updateUser({
                        ...user,
                        languages: modifyListOfLans(myData, form.value, form.level)
                    })
                    window.location.reload()
                }
            } else if(type==='add') {
                const response = await setMyLenguageApi({idUser: user.id, idLanguage: form.value, level: form.level})
                if(response.success && response.result) {
                    const newdata = myData;
                    newdata.push({
                        value: form.value,
                        name: getNameLan(form.value, noNanguages),
                        level: form.level
                    })
                    updateUser({
                        ...user,
                        languages: newdata
                    })
                    window.location.reload()
                }
            }
        } else {
            invokeToast("warning", "Ya tiene registrado todos los idiomas del sistema")
        }
    }

    const modifyListOfLans = (myData, value, level) => {
        const arr = []
        for(let elem of myData) {
            if(elem.value === value) {
                arr.push({
                    ...elem,
                    level: level
                })
            } else {
                arr.push(elem)
            }
        }
        return arr;
    }

    const getNameLan = (value, arr) => {
        for(let elem of arr) {
            if(elem.value === value) return elem.name 
        }
    }

  return (
      <ModalBasic title={`${type==='edit'? "Modificar": "Añadir"} idioma`} show={show} setShow={setShow} handleClick={handleClick}>
        <div className="modal-language">
            <InputCombo list={type==='edit'? myData: noElementsInArr(languages, myData)} setData={setForm} attribute={"value"} data={form} />
            {!isEnterprise && <InputCombo list={languageLeves} setData={setForm} attribute={"level"} data={form} />}
        </div>
      </ModalBasic>
  );
}

export default ModalLanguage;