import "../scss/Opinion.scss"

export default function InputSurvey ({attribute, disabled, setData, data}) {

    const handleClick = (val) => {
        if(!disabled) {
            setData({
                ...data,
                [attribute]: val
            })
        }
    }

    return (
        <div className={`input-survey ${disabled && 'disabled'}`}>
            {
                getArrScore().map((item) => (
                    <div className={`input-survey-item`} key={item} onClick={()=> handleClick(item)}
                        style={{color: item==data[attribute]? 'white': '#699BF7', 
                            background: item==data[attribute]? '#699BF7': 'white'}}>
                        {item}
                    </div>
                ))
            }
        </div>
    )
}

function getArrScore() {
    const arr = []

    for (let index = 1; index <= 5; index++) {
        arr.push(index)
    }
    return arr;
}