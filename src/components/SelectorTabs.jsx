import "./scss/SelectorTabs.scss"

export default function SelectorTabs ({list, valueSelected, handleClick}) {
    
    return (
        <div className="selectorTabs">
            {
                list.map((element, index) => (
                    <div className={`selectorTabs_item ${valueSelected===element.value && "selected"}`} 
                        key={index} onClick={() => handleClick(element)}>
                        <span>{element.name}</span>
                    </div>
                ))
            }
        </div>
    )
}