import Score from "./Score";
import "./scss/Opinion.scss"

export default function Opinion ({enterprise_name,score,date_update,description,student,me,him}) {

    return (
            <div className="opinion">
                <div className="opinion_top">
                    <Score score={score}/>
                    <span>{getTitle(me,him,enterprise_name,student)} ({date_update})</span>
                </div>
                <div className="opinion_bottom">
                    <p>{description}</p>
                </div>
            </div>
    )
}

function getTitle(me,him,enterprise_name,student) {
    // if(me==='ENTERPRISE' || me==='EMPLOYED') return '';
    if((me==='STUDENT' || me==='PROFFESSOR') && him==='STUDENT') return student;
    if((me==='STUDENT' || me==='PROFFESSOR') && him==='ENTERPRISE') return enterprise_name;
    return ''
}