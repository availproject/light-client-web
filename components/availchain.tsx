
import Block from "./block";

/* eslint-disable @next/next/no-img-element */
export default function AvailChain(props: any) {

  const blockList = props.blockList
  return <>
    <div className="flex flex-row mt-10 overflow-auto">{ 
      blockList.map((block: any, index: any) => (
        <div key={index} className="flex flex-col items-center justify-center">
        <h3 className="text-md text-white text-opacity-70">#{block.blockNumber}</h3>
        <Block key={index} progress={blockList.length > index + 1 ? 100 : 0} block={block} />
        </div>
      ))}

    </div>
  </>
}