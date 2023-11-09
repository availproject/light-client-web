export default function BlockData() {
    return <>
    <div className="flex flex-col w-full space-y-6 mx-6">
        <div className="flex flex-col space-y-1">
        <h1 className="text-white !text-left font-thicccboisemibold text-5xl 2xl:text-7xl">Avail Light Client</h1>
        <h2 className="text-white text-4xl font-thicccboisemibold 2l:text-5xl ">Block data</h2>
        </div>
        <div className="flex flex-row justify-between mr-4 items-start ">
            <div className="flex flex-col items-start">
                <h3 className="text-[#F5F5F5] font-thicccboisemibold !text-2xl">Confidence Factor</h3>
                <p className="text-green-500 font-thicccboibold !text-7xl">46%</p>
            </div>
            <div>
                <div className="flex flex-col items-end space-y-4">
                     <div className="flex flex-col ">
                <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold !text-2xl text-right">Block Hash</h3>
                <p className="text-green-500 font-thicccboibold !text-3xl text-right">#123</p>
            </div>
            <div className="flex flex-col ">
                <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold !text-2xl text-right">Block Hash</h3>
                <p className="text-green-500 font-thicccboibold !text-3xl text-right">#123</p>
            </div>
            <div className="flex flex-col ">
                <h3 className="text-[#F5F5F5] text-opacity-80 font-thicccboisemibold !text-2xl text-right">Block Hash</h3>
                <p className="text-green-500 font-thicccboibold !text-3xl text-right">#123</p>
            </div>
                </div>
           
            </div>
        </div>
    </div>
    </>
}