import { Block } from "@/types/light-client";
import { Button } from "./ui/button";
import Image from "next/image";

type Props = {
    latestBlock: Block | null,
    running: Boolean,
}
export default function BlockData(props: Props) {
    const latestBlock = props.latestBlock
    const running = props.running;
    return <>
        <div className="flex flex-col w-full space-y-6 mx-6">
            <div className="flex flex-col space-y-2">
                {running &&
                    <h2 className="text-white text-3xl font-thicccboisemibold 2xl:text-6xl pt-6 lg:pt-0 2xl:pt-4 ">Block data <span className="text-opacity-80 text-white font-thicccboisemibold 2xl:text-xl lg:text-lg text-sm">(Latest Block)</span></h2>
                }
            </div>
            <div className="flex flex-row justify-between lg:mr-4 items-start ">
                <div className="flex flex-col items-start">
                    <h3 className="text-[#F5F5F5] font-thicccboisemibold text-xl lg:text-2xl 2xl:text-4xl 2xl:mt-4">Confidence Factor</h3>
                    {latestBlock?.hasDaSubmissions ? (
                        latestBlock.confidence && latestBlock.confidence > 90 ?
                            <p className={`font-thicccboibold text-6xl xl:text-7xl 2xl:text-8xl 2xl:mt-2 ${parseInt(latestBlock.confidence.toString().slice(0, 2)) > 85 ? 'text-green-500' : parseInt(latestBlock.confidence.toString().slice(0, 2)) > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{latestBlock?.confidence?.toString().slice(0, 4) || '0'}%</p> :
                            <p className="font-thicccboibold text-6xl xl:text-7xl 2xl:text-8xl 2xl:mt-2 text-green-500">...</p>
                    ) : (
                        <p className="font-thicccboibold text-3xl xl:text-4xl 2xl:text-5xl 2xl:mt-2 text-yellow-500">No DA submissions</p>
                    )}
                </div>
                <div>
                    <div className="flex flex-col items-end space-y-4">
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Block Hash</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{latestBlock?.hash?.toString().slice(0, 6) || ''}...</p>
                        </div>
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Block Number</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">#{latestBlock?.number || '0000'}</p>
                        </div>
                        {latestBlock?.hasDaSubmissions && (
                            <>
                                <div className="flex flex-col ">
                                    <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Total Cell Count</h3>
                                    <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{latestBlock?.totalCellCount || '000'}</p>
                                </div>
                                <div className="md:flex flex-col hidden">
                                    <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Sample Cell Count</h3>
                                    <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{latestBlock?.sampleCount?.toString() || '0'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
}
