import "../scss/Icons.scss"

export default function InputCheck (props) {
    const {size='24px', withInput=false, data, setData, attribute, states} = props

    const handleClick = () => {
        console.log(data[attribute])
        setData({
            ...data,
            [attribute]: !data[attribute]
        })
    }

    return (
        
        <div className={`inputCheck`}>
            {withInput && <div onClick={handleClick} className={`inputCheck_input ${data[attribute] && 'checked'}`}>

            </div>}
            <i className={states[getIndex(data[attribute])].icon}
                style={{color: states[getIndex(data[attribute])].color, fontSize: size}}>
            </i>
            <span>{states[getIndex(data[attribute])].text}</span>
        </div>

    )
}

function getIndex(value) {
    if(value) return 0
    return 1
}