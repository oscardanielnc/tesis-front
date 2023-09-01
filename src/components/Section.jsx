import "./scss/Section.scss"


export default function Section ({title, icon, children, shadow=false, small=false}) {
    
    return (
        <div className={`section ${shadow && 'shadow'}`}>
            <div className={`section_title ${small && 'small'}`}>
                {icon && <i className={`bi ${icon}`}></i>}
                <span>{title}</span>
            </div>
            <div className="section_content">
                {children}
            </div>
        </div>
    )
}