import "../scss/InputDate.scss"

export default function InputDate ({data, attribute, setData}) {
    console.log(data[attribute])
    
    const handleChange = e => {
        setData({
            ...data,
            [attribute]: e.target.value
        })
    }

    return (
        <input type="date" className='inputDate'
            onChange={handleChange}
            value={data[attribute]}
            name={attribute}
        />
    )
}