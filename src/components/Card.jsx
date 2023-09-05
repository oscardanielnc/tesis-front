import IconSystem from "./IconSystem";
import "./scss/Card.scss"

export default function Card (props) {
    const {icon,userId=null,photo,circleState=-2,text1=null,text2=null,text3=null,text4=null,children} = props;

    return (
        <div className="psp-card">
            <div className="psp-card_img">
                {photo && photo!==''? 
                    <figure className="psp-card_img_fig">
                        <img src={photo} alt="enterprise" />
                    </figure>:
                    <IconSystem type={icon}/>
                }
            </div>
            <div className="psp-card_details">
                {text1 && <div className="psp-card_details_text1">{text1}</div>}
                {text2 && <div className="psp-card_details_text2">{text2}</div>}
                {text3 && <div className="psp-card_details_text3">{text3}</div>}
                {text4 && <div className="psp-card_details_text4">
                    {circleState!==-2 && 
                        <i className="bi bi-circle-fill" style={{color: circleState===-1? "#dc3545": circleState===1? "#198754": "#ffc107"}}>
                        </i>}
                    <span>{text4}</span>
                </div>}
            </div>
            {children}
        </div>
    )
}
