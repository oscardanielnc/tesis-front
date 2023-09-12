import OptionsIcon from "./OptionsIcon";
import Score from "./Score";
import "./scss/Opinion.scss"

export default function Opinion ({enterprise_name,score,date_update,description,student,me,him,isMyOpinion=false,fn=()=>{}}) {

    return (
            <div className="opinion">
                <div className="opinion_top">
                    <Score score={score}/>
                    <span>{getTitle(me,him,enterprise_name,student)} ({date_update})</span>
                    {isMyOpinion && <OptionsIcon vertical size="16px"
                        listIcons={[{icon: 'bi bi-pencil-fill', fn}]} 
                    />}
                </div>
                <div className="opinion_bottom">
                    <p>{description}</p>
                </div>
            </div>
    )
}

function getTitle(me,him,enterprise_name,student) {
    // if(me==='ENTERPRISE' || me==='EMPLOYED') return '';
    if((me==='STUDENT' || me==='PROFESSOR') && him==='STUDENT') return enterprise_name;
    if((me==='STUDENT' || me==='PROFESSOR') && him==='ENTERPRISE') return student;
    return ''
}