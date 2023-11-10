import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <div className="flex md:flex-row lg:flex-col flex-col-reverse  lg:h-screen w-screen">
        <div className="lg:w-[60%] flex flex-col ">
          <div className="lg:h-[40%]">
          <AvailChain/>
          </div>
          <DsMatrix/>
        </div>
        <div className="lg:w-[40%] flex items-start lg:mt-20">
        <BlockData />
        </div>
      </div>
     
    </main>
  );
}
