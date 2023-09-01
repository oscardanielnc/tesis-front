import {Form} from 'react-bootstrap';
import "../scss/InputCombo.scss"

export default function InputCombo ({list, setData, data, attribute}) {
    const handleChange = e => {
        setData({
            ...data,
            [attribute]: e.target.value
        })
    }
    
    return (
        <Form.Select className="inputCombo" onChange={handleChange} name={attribute}>
            {
                list.map((element, index) => (
                    <option value={element.value} 
                        key={index}>{element.name}
                    </option>
                ))
            }
        </Form.Select>
    )
}