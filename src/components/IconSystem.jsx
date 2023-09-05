import "./scss/Card.scss";

const icons = [
    {
        img: "bi bi-bug-fill",
        color: "red",
        value: 0
    },
    {
        img: "bi bi-buildings-fill",
        color: "red",
        value: 1
    },
    {
        img: "bi bi-browser-chrome",
        color: "red",
        value: 2
    },
    {
        img: "bi bi-book-fill",
        color: "red",
        value: 3
    },
    {
        img: "bi bi-bag-fill",
        color: "red",
        value: 4
    },
    {
        img: "bi bi-car-front",
        color: "red",
        value: 5
    },
]

export default function IconSystem ({type=0}) {
    if(type<0) return <i className={`bi bi-globe2 iconSystem`}></i>;
    return (
        <i className={`${icons[type].img} iconSystem`} style={{color: icons[type].color}}></i>
    )
}
