import "../scss/InputText.scss"

export default function InputTextarea({cols, rows, attribute, data, setData}) { 
    const handleChange = e => {
        const value = e.target.value
        setData({
            ...data,
            [attribute]: value
        })
    }

  return (
        <textarea cols={cols} rows={rows} className="input-textarea" style={{width: !cols? "100%": ''}}
            value={data[attribute]} onChange={handleChange}>
        </textarea>
  );
}