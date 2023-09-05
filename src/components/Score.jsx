import "./scss/Opinion.scss"

export default function Score ({score, showScore}) {

    return (
        <div className="score_container">
            <div className="score_box">
                {
                    getArrStars(score).map((item, key) => (
                        <i className="bi bi-star-fill" key={key}
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