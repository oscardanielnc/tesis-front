import "./scss/Icons.scss"

export default function OptionsIcon (props) {
    const {listIcons, vertical=false, size='24px', visibleText=false, verticalIcons=false, reverse=false, onlyRead=false} = props
    return (
        <div className={`options-icon ${vertical && 'vertical'}`}>
            {
                listIcons.map((item, key) => (
                    <div  key={key} 
                        className={`options-icon_icon ${verticalIcons && 'vertical'} ${reverse && 'reverse'} ${onlyRead && 'onlyRead'}`}
                    >
                        {visibleText && <span>{item.text}</span>}
                        <i className={item.icon}
                            style={{color: item.color, fontSize: size}}>
                        </i>
                    </div>
                ))
            }
        </div>
    )
}