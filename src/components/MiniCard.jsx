import "./scss/Card.scss"

export default function MiniCard ({icon, text, children}) {

    return (
        <div className="miniCard">
            <div className="miniCard_img">
                <i className={icon}></i>
            </div>
            <div className="miniCard_details">
                <span>{text}</span>
            </div>
            {children}
        </div>
    )
}
