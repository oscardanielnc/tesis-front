import OptionsIcon from "./OptionsIcon";
import Score from "./Score";
import "./scss/Opinion.scss"

export default function Opinion ({enterprise_name,score,date_update,description,student,me,him,isMyOpinion=false,fn=()=>{},state}) {

    const getOption = () => {
        return {
            icon: state===1? 'bi bi-patch-check-fill': state===2? 'bi bi-check-circle-fill': 'bi bi-x-circle',
            fn: fn,
            color: state===1? '#6c757d': state===2? '#198754': '#dc3545',
        }
    }
    return (
            <div className="opinion">
                <div className="opinion_top">
                    <Score score={score}/>
                    <div className="opinion_top_ts">
                        <span>{getTitle(me,him,enterprise_name,student)} ({date_update})</span>
                        {state && 
                        <OptionsIcon vertical size="20px"
                            listIcons={[getOption()]} 
                        />}
                    </div>
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