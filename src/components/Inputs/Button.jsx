import "../scss/Button.scss"

export default function Button ({title, handleClick, icon, variant}) {
    
    return (
    <button className={`button-psp ${variant}`} onClick={handleClick} name="button-psp">
        {icon && <i className={`bi ${icon}`}></i>}
        <span>{title}</span>
    </button>
    )
}