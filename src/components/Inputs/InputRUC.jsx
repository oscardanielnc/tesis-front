import {FormControl} from 'react-bootstrap';
import "../scss/InputText.scss"
import { useState } from 'react';
import { enterpriseExistApi } from '../../api/enterprise';

export default function InputRUC ({data, setData}) {

    const handleChange = e => {
        const value = e.target.value
        verifyValid(value)       
    }

    const verifyValid = async (value) => {
        if(value.length===11 && value.substring(0, 2)==='20' && !isNaN(value)) {
            const response = await enterpriseExistApi(value)
            if(response.success) {
                setData({
                    ...data,
                    ruc: value,
                    rucVerified: response.result.exist,
                    enterprise_name: response.result.name,
                    enterprise_photo: response.result.photo,
                    icon: -1
                })
            }
        } else {
            setData({
                ...data,
                ruc: value,
                rucVerified: false,
                enterprise_name: '',
                enterprise_photo: '',
                icon: -1
            })
        }
    }

    return (
        <div style={{position: "relative"}}>
            <FormControl className='inputText'
                value={data.ruc}
                maxLength={11}
                onChange={handleChange}
                name={'ruc'}
                placeholder='RUC'
            />
            { data.rucVerified &&
                <i className="bi bi-check-circle-fill" 
                style={{color: "#198754", position: "absolute", top: "8px", right: "8px" }}>
            </i>}
        </div>
    )
}