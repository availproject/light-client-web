export default function Cell(props: any) {
    const color = props.color
    return (
        <div style={{ backgroundColor: color }} className="w-3 h-3 rounded-lg rounded-[2px]"></div>
    )
}