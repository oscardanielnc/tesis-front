import "../scss/InputText.scss"
import InputText from "./InputText"
import InputDate from "./InputDate"

export default function InputRange ({data, attribute1, attribute2, setData, type="text"}) {

    return (
        <div className='inputRange'>
            <span>(desde)</span>
            {type==="text" && <InputText data={data} setData={setData} attribute={attribute1} maxLength={8} isNumber/>}
            {type==="date" && <InputDate data={data} setData={setData} attribute={attribute1}/>}
            <span>-</span>
            {type==="text" && <InputText data={data} setData={setData} attribute={attribute2} maxLength={8} isNumber/>}
            {type==="date" && <InputDate data={data} setData={setData} attribute={attribute2}/>}
            <span>(hasta)</span>
        </div>
    )
}