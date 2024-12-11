type Props = {
    color: string;
    size?: number;
};

export default function Cell({ color, size = 6 }: Props) {
    return (
        <div
            style={{
                backgroundColor: color,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '1px'
            }}
        />
    );
}
