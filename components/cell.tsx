export default function Cell(props: any) {
    const color = props.color
    return (
        <div style={{ backgroundColor: color }} className="w-2 h-2 border bg-border-[#fff]"></div>
    )
}