import "./scss/Opinion.scss"

export default function Score ({score, showScore, setData, data}) {

    const handleClick = (val) => {
        if(setData && data) {
            setData({
                ...data,
                score: val
            })
        }
    }

    return (
        <div className="score_container">
            <div className={`score_box ${setData&&data? 'input': ''}`}>
                {
                    getArrStars(score).map((item, key) => (
                        <i className={`bi bi-star-fill`} key={key} onClick={()=> handleClick(item.index)}
                            style={{color: item.color}}>
                        </i>
                    ))
                }
            </div>
            {showScore && <span className="score_span">({score})</span>}
        </div>
    )
}

function getArrStars(score) {
    const arr = []
    for (let index = 1; index <= 5; index++) {
        let color = '#929292';
        if(index <= score) color = '#ffc107';
        const item = {
            color,
            index
        }
        arr.push(item)
    }
    return arr;
}