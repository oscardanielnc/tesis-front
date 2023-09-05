import "../scss/Button.scss"

export default function Button ({title, handleClick, icon, variant, circle=false, center=false}) {
    
    return (
    <button className={`button-psp ${variant} ${circle && "circle"}`} style={{margin: center? "auto": ''}}
        onClick={handleClick} name="button-psp">
        {icon && <i className={`bi ${icon}`}></i>}
        <span>{title}</span>
    </button>
    )
}