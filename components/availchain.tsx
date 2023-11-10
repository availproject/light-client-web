import Block from "./block";

/* eslint-disable @next/next/no-img-element */
export default function AvailChain(props: any) {

  const blockList = props.blockList
  console.log(blockList)
  return <>
    <div className="flex flex-row">{
      blockList.map((block: any, index: any) => (
        <Block key={index} progress={blockList.length > index + 1 ? 100 : 0} block={block} />
      ))}
    </div>
  </>
}