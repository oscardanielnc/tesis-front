import {FormControl} from 'react-bootstrap';
import "../scss/InputText.scss"
import { useState } from 'react';

export default function InputRUC ({data, setData}) {

    const [valid, setValid] = useState(false)
    
    const handleChange = e => {
        const value = e.target.value
        setData({
            ...data,
            ruc: value,
            rucVerified: verifyValid(value)
        })
        
    }

    const verifyValid = (value) => {
        if(value.length===11 && value.substring(0, 2)==='20' && !isNaN(value)) {
            setValid(true)
            return true
        } else if(valid) {
            setValid(false)
            return false
        }
        return false
    }

    return (
        <div style={{position: "relative"}}>
            <FormControl className='inputText'
                maxLength={11}
                onChange={handleChange}
                name={'ruc'}
            />
            { valid &&
                <i className="bi bi-check-circle-fill" 
                style={{color: "#198754", position: "absolute", top: "8px", right: "8px" }}>
            </i>}
        </div>
    )
}