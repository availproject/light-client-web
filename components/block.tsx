/* eslint-disable @next/next/no-img-element */
import Image from "next/image"

import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
export default function Block(props: any) {

    const block = props.block

    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.progress)
    }, [props.progress])

    useEffect(() => {
        const interval = setInterval(() => {
            setValue((v) => (v >= 100 ? 100 : v + 10));
        }, 5000);

    }, []);
    return (
        <div className="">
            <div className="flex flex-row">
                <Image
                    src="/images/block.png"
                    alt="block"
                    width={150}
                    height={150}
                    className="blockImg"
                />
                <Progress className="bg-black" aria-label="finalizing..." value={value} />
                
            </div>
        </div>
    )
}
