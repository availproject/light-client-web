

import { Block as block_type } from "@/types/light-client";
import Block from "./block";
import { Progress } from "./ui/progress";

/* eslint-disable @next/next/no-img-element */

type Props = {
  blockList: block_type[]
}


export default function AvailChain(props: Props) {

  const blockList = props.blockList
  return <>
    <div className="flex flex-row  overflow-auto whitespace-nowrap ">{
      blockList.map((block: block_type, index: number) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <h3 className={`z-50 text-md ${blockList.length > index + 1  ? 'text-white' : 'text-[#3CBBF9] animate-pulse'} text-opacity-70`}>#{block.number}</h3>
          <div className="relative">
            <Block key={index} progress={blockList.length > index + 1 ? 100 : 0} />
            <Progress value={blockList.length > index + 1 ? 100 : (Date.now() % 20000) / 250} className="lg:h-2 lg:w-14 h-1 w-6 absolute right-0 top-1/2 transform -translate-y-1/2 !rounded-md"></Progress>
          </div>
        </div>
      ))}
    </div>
  </>
}