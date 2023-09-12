import "./scss/Card.scss";

const icons = [
    {
        img: "bi bi-bug-fill",
        color: "#13128B",
        value: 0
    },
    {
        img: "bi bi-building",
        color: "#C38D66",
        value: 1
    },
    {
        img: "bi bi-laptop-fill",
        color: "#FF69B5",
        value: 2
    },
    {
        img: "bi bi-book-fill",
        color: "#9747FF",
        value: 3
    },
    {
        img: "bi bi-bag-fill",
        color: "#4ECB71",
        value: 4
    },
    {
        img: "bi bi-bicycle",
        color: "#E31018",
        value: 5
    },
]

export default function IconSystem ({type=0, size="32px"}) {
    if(type<0) return <i className={`bi bi-globe2 iconSystem`} style={{fontSize: size}}></i>;
    return (
        <i className={`${icons[type].img} iconSystem`} style={{color: icons[type].color, fontSize: size}}></i>
    )
}
