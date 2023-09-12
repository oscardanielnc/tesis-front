import {FormControl} from 'react-bootstrap';
import "../scss/InputText.scss"

export default function InputText ({data, attribute, setData, maxLength=36, isNumber=false, placeholder='', disabled=false}) {
    
    const handleChange = e => {
        const value = e.target.value
        if(!isNumber || (isNumber && !isNaN(value))) {
            setData({
                ...data,
                [attribute]: value
            })
        }
    }

    return (
        <FormControl className='inputText'
            onChange={handleChange}
            value={data[attribute]}
            name={attribute}
            maxLength={maxLength}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}