import {Form} from 'react-bootstrap';
import "../scss/InputCombo.scss"

export default function InputMultiSelect ({list, setData, data, attribute}) {
    const handleChange = e => {
        const res = verifyElements(e.target.value)
        if(res.new) {
            setData({
                ...data,
                [attribute]: res.arr
            })
        }
    }

    const verifyElements = value => {
        if(value === '') return {new: false, arr: []}
        for (let element of data[attribute]) {
            if(element == value) return {new: false, arr: []}
        }
        const newArr = data[attribute]
        newArr.push(value)
        return {new: true, arr: newArr}
    }

    const deleteItem = (value) => {
        const newArr = []
        for (let elem of data[attribute]) {
            if(elem != value) newArr.push(elem)  
        }
        setData({
            ...data,
            [attribute]: newArr
        })
    }
    
    return (
        <div>
            <div className="input-ms_taps">
                {
                    data[attribute].map((item, key) => (
                        <div className="input-ms_taps_item" key={key}>
                            <span>{getItem(item, list)}</span>
                            <i className="bi bi-x" onClick={()=> deleteItem(item)}></i>
                        </div>
                    ))
                }
            </div>
            <Form.Select className="inputCombo" onChange={handleChange} name={attribute}>
                {
                    list.map((element, index) => (
                        <option value={element.value} 
                            key={index}>{element.name}
                        </option>
                    ))
                }
            </Form.Select>
        </div>
    )
}


function getItem(value, arr) {
    for (let elem of arr) {
        if(elem.value == value) return elem.name
    }
    return ''
}