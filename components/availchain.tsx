

import { Block as BlockType } from "@/types/light-client";
import Block from "./block";
import { Progress } from "./ui/progress";
import { useState, useRef, useEffect } from "react";

/* eslint-disable @next/next/no-img-element */

type Props = {
  blockList: BlockType[]
  network: string
}


export default function AvailChain(props: Props) {
  const [progress, setProgress] = useState(0);
  const lastBlockHash = props.blockList[props.blockList.length - 1];
  const blockList = props.blockList;

  useEffect(() => {
    if (progress < 100) {
      const countdownInterval = setTimeout(() => {
        setProgress((prevSeconds) => prevSeconds + 2.5);
      }, 500);

      // Cleanup interval on component unmount
      return () => clearTimeout(countdownInterval);
    }
  }, [progress]);

  useEffect(() => {
    setProgress(0);
  }, [lastBlockHash])

  return <>
    <div className="flex flex-row  overflow-auto whitespace-nowrap ">{
      blockList.map((block: BlockType, index: number) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <h3 className={`z-50 underline text-md ${blockList.length > index + 1 ? 'text-white' : 'text-[#3CBBF9] animate-pulse'} text-opacity-70`}><a href={props.network === "Mainnet" ? `https://avail.subscan.io/block/${block.number}` : `https://avail-turing.subscan.io/block/${block.number}`}>#{block.number}</a></h3>
          <div className="relative">
            <Block key={index} progress={blockList.length > index + 1 ? 100 : 0} />
            <Progress value={blockList.length > index + 1 ? 100 : progress} className="lg:h-2 lg:w-14 h-1 w-6 absolute right-0 top-1/2 transform -translate-y-1/2 !rounded-md"></Progress>
          </div>
        </div>
      ))}
    </div>
  </>
}
