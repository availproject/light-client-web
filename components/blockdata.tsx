import { Block } from "@/types/light-client";

type Props = {
    currentBlock: Block | null,
    running: Boolean,
}
export default function BlockData(props: Props) {
    const currentBlock = props.currentBlock
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
                    {currentBlock?.hasDaSubmissions ? (
                        currentBlock.confidence && currentBlock.confidence > 90 ?
                            <p className={`font-thicccboibold text-6xl xl:text-7xl 2xl:text-8xl 2xl:mt-2 ${parseInt(currentBlock.confidence.toString().slice(0, 2)) > 85 ? 'text-green-500' : parseInt(currentBlock.confidence.toString().slice(0, 2)) > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{currentBlock?.confidence?.toString().slice(0, 4) || '0'}%</p> :
                            <p className="font-thicccboibold text-6xl xl:text-7xl 2xl:text-8xl 2xl:mt-2 text-green-500">...</p>
                    ) : (
                        <p className="font-thicccboibold text-2xl xl:text-3xl 2xl:text-4xl 2xl:mt-2 text-yellow-500">No DA submissions</p>
                    )}
                </div>
                <div>
                    <div className="flex flex-col items-end space-y-4">
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Block Hash</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{currentBlock?.hash?.toString().slice(0, 10) || ''}..</p>
                        </div>
                        <div className="flex flex-col ">
                            <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Block Number</h3>
                            <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">#{currentBlock?.number || '0000'}</p>
                        </div>
                        {currentBlock?.hasDaSubmissions && (
                            <>
                                <div className="flex flex-col ">
                                    <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Total Cell Count</h3>
                                    <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{currentBlock?.totalCellCount || '000'}</p>
                                </div>
                                <div className="md:flex flex-col hidden">
                                    <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold text-xl lg:text-2xl text-right 2xl:text-4xl 2xl:mt-4">Sample Cell Count</h3>
                                    <p className="text-green-500 font-thicccboibold text-3xl 2xl:text-5xl text-right">{currentBlock?.sampleCount?.toString() || '0'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
}
