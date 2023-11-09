import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <div className="flex md:flex-row flex-col h-screen w-screen">
        <div className="w-[60%] flex flex-col">
          <div className="h-[40%]">
          <AvailChain/>
          </div>
          <DsMatrix/>
        </div>
        <div className="w-[40%] flex items-start mt-20">
        <BlockData />
        </div>
      </div>
     
    </main>
  );
}
