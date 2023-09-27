import "./scss/Card.scss"
import Score from "../components/Score"
import { useNavigate } from "react-router-dom";

export default function CardProfile ({name, score, subTitle='', photo, idUser, profile}) {
    const navigate = useNavigate();

    const redirectToProfile = () => {
        if(idUser && profile) {
            navigate(`/profile/${profile.toLowerCase()}/${idUser}`)
        }
    }
    return (
        <div className="psp-card-profile">
            <figure className="psp-card-profile_fig">
                <img src={photo} alt="enterprise" onClick={redirectToProfile} 
                    style={{cursor: idUser && profile? 'pointer': 'default'}}/>
            </figure>
            <div className="psp-card-profile_title">
                <span>{name}</span>
                {(score || score===0) && <Score score={score}/>}
            </div>
            <span className="psp-card-profile_subtitle">{subTitle}</span>
        </div>
    )
}