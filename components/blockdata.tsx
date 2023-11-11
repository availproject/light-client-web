import { Block } from "@/types/light-client";
import { Button } from "./ui/button";

type Props = {
    latestBlock: Block,
    run: Function,
    running: Boolean,
    stop: any,
    setRunning: any
}
export default function BlockData(props: Props) {
    const latestBlock = props.latestBlock
    return <>
        <div className="flex flex-col w-full space-y-6 mx-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-white lg:text-left text-center font-thicccboibold text-4xl md:text-5xl 2xl:text-7xl">Avail Light Client</h1>
                <div className="lg:hidden flex-col">
                    <p className="text-white text-opacity-75 text-center ">Born from the need for blockchain solutions that scale with modern demand.</p>
                </div>

                <div className="md:hidden flex flex-col items-center justify-center py-8">
                    <Button onClick={() => { props.running ? (props.stop(), props.setRunning(false)) : props.run() }} variant={'outline'} className='text-white rounded-full border-opacity-70 bg-opacity-50 px-8 py-6  font-thicccboibold'>{props.running ? 'Stop Running the LC' : 'Start Running the LC'}</Button>
                </div>
                <h2 className="text-white text-3xl font-thicccboisemibold 2xl:text-6xl pt-6 lg:pt-0 2xl:pt-4 ">Block data</h2>
            </div>
            <div className="flex flex-row justify-between lg:mr-4 items-start ">
                <div className="flex flex-col items-start">
                    <h3 className="text-[#F5F5F5] font-thicccboisemibold text-xl lg:text-2xl 2xl:text-4xl 2xl:mt-4">Confidence Factor</h3>
                    <p className={`font-thicccboibold text-6xl xl:text-7xl 2xl:text-8xl 2xl:mt-2 ${parseInt(latestBlock.confidence.toString().slice(0, 2)) > 85 ? 'text-green-500' : parseInt(latestBlock.confidence.toString().slice(0, 2)) > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{latestBlock.confidence.toString().slice(0, 4)}%</p>
                </div>
                <div>
                    <div className="flex flex-col items-end space-y-4">
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Block Hash</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{latestBlock.hash.toString().slice(0, 6)}..</p>
                        </div>
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Block Number</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">#{latestBlock.number}</p>
                        </div>
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Total Cell Count</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{latestBlock.totalCellCount}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>
}