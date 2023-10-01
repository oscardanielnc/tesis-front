import "../scss/Button.scss"

export default function Button ({title, handleClick, icon, variant="primary", circle=false, center=false, disabled=false}) {
    
    return (
    <button className={`button-psp ${variant} ${circle && "circle"} ${disabled && "disabled"}`} style={{margin: center? "auto": ''}}
        onClick={handleClick} name="button-psp" disabled={disabled}>
        {icon && <i className={`bi ${icon}`}></i>}
        <span>{title}</span>
    </button>
    )
}