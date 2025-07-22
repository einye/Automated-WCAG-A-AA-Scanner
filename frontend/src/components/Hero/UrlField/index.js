export default function UrlField({value, handleChangeValue}) {
    return (
        <>
        <input type="url" placeholder="Paste your Website URL here..."
        value={value} onChange={handleChangeValue}
        className="p-2 rounded-md text-lg min-w-96 h-min"></input>
        </>
    )
}