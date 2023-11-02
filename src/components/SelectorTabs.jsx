import "./scss/SelectorTabs.scss"

export default function SelectorTabs ({list, valueSelected, handleClick,fitCont=false,vertical=false}) {
    
    return (
        <div className={`selectorTabs ${vertical && "vertical"}`}>
            {
                list.map((element, index) => (
                    <div className={`selectorTabs_item ${valueSelected===element.value && "selected"} ${fitCont && "fitCont"}`} 
                        key={index} onClick={() => handleClick(element)}>
                        <span>{element.name}</span>
                    </div>
                ))
            }
        </div>
    )
}