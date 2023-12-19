/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import { Block } from "@/types/light-client";
import { useTheme } from "next-themes";

type Props = {
    progress: number
}


export default function Block(props: Props) {
    const { theme } = useTheme();
    const [blockImage, setBlockImage] = useState("/images/block.png");
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (theme === "dark") {
          setBlockImage("/images/block-dark.png");
        } else {
          setBlockImage("/images/block-light.png");
        }
      }, [theme]);

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
            <div className="flex flex-row items-center justify-center">
                <img
                    src={blockImage}
                    alt="block"
                    className="2xl:max-h-[350px] lg:max-h-[250px] max-h-[120px] aspect-auto overflow-scroll overflow-y-auto"
                />
                <div className="">
                    <Progress className="bg-[#20232B]" aria-label="finalizing..." value={value} />
                </div>
            </div>
        </div>
    )
}
