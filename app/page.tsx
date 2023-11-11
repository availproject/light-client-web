'use client'

//imports for app components
import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header";


//import for react
import { useState, useEffect } from "react";


//imports for App logic
import init, { check } from "@/avail-light/pkg/wasm_avail_light"
import config from "../utils/config"
import { sleep } from "@/utils/helper";
import { Block, Matrix, Cell } from "@/types/light-client";
import { runLC } from "@/repository/avail-light.repository";



export default function Home() {

  //States for App Data Structure
  const [latestBlock, setLatestBlock] = useState<Block>({
    number: 0,
    hash: "",
    totalCellCount: 0,
    confidence: 0
  })
  const [blockList, setBlockList] = useState<Array<Block>>([])
  const [matrix, setMatrix] = useState<Matrix>({ maxRow: 0, maxCol: 0, verifiedCells: [] })

  //States for App execution logic
  const [running, setRunning] = useState<Boolean>(false)
  const [stop, setStop] = useState<any>(null)


  useEffect(() => {
    init()
  }, [])

  const refreshApp = () => {
    setRunning(true)
    setBlockList([])
    setMatrix({ maxRow: 0, maxCol: 0, verifiedCells: [] })
    setLatestBlock({
      number: 0,
      hash: "",
      totalCellCount: 0,
      confidence: 0
    })
  }

  const processBlock = (block: Block, matrix: Matrix, cells: Cell[], proofs: Uint8Array[], commitments: Uint8Array[]) => {

    //Detaiils updated on UI
    addBlock(block)

    //Indivisual cell verification
    let verifiedCount = 0
    let verifiedCells: Cell[] = []
    cells.forEach(async (cell, i) => {

      //console.log(proofs[i], commitments[cell.row], c, cell.row, cell.col)
      const res = check(proofs[i], commitments[cell.row], matrix.maxCol, cell.row, cell.col)
      //console.log(res)
      if (res) {
        await sleep((i + 1) * 1000)
        verifiedCount++
        const confidence = 100 * (1 - (1 / (Math.pow(2, verifiedCount))))
        verifiedCells.push(cell)
        //@ts-ignore
        setLatestBlock({ hash: block.hash, number: block.number, totalCellCount: block.totalCellCount, confidence: confidence })
        //console.log(verifiedCells)
        setMatrix({
          maxRow: matrix.maxRow,
          maxCol: matrix.maxCol,
          //@ts-ignore
          verifiedCells
        })
      }
    })
  }





  // const run = async () => {
  //   refreshApp()

  //   const api: any = await createApi();

  //   const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header: any) => {

  //     //console.log(header)
  //     //Extracting the data out from header
  //     const blockNumber: number = header.number.toString()
  //     const extension = JSON.parse(header.extension)
  //     console.log("Header Extension: ", extension)

  //     const commitment = extension.v1.commitment
  //     const kateCommitment = commitment.commitment.split('0x')[1]
  //     const r = commitment.rows
  //     const c = commitment.cols


  //     //fetching block hash from number 
  //     const blockHash = (await api.rpc.chain.getBlockHash(header.number)).toString();
  //     console.log(`New Block with hash: ${blockHash}, Number: ${blockNumber} `)


  //     //Generating SAMPLE_SIZE random cell for sampling
  //     const totalCellCount = (r * config.EXTENSION_FACTOR) * c
  //     let sampleCount = config.SAMPLE_SIZE
  //     if (sampleCount >= totalCellCount) {
  //       sampleCount = 5
  //     }
  //     const cells = generateRandomCells(r, c, sampleCount)

  //     //Query data proof for sample 0,0
  //     const kateProof = await api.rpc.kate.queryProof(cells, blockHash);
  //     const kate_Proof = Uint8Array.from(kateProof)
  //     const kate_commitment = Uint8Array.from(kateCommitment.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))

  //     //Creating commitement array based on rows and proof array based on cells
  //     let commitments: Uint8Array[] = []
  //     for (let i = 0; i < (r * config.EXTENSION_FACTOR); i++) {
  //       commitments.push(kate_commitment.slice(i * config.COMMITMENT_SIZE, (i + 1) * config.COMMITMENT_SIZE))
  //     }
  //     let proofs: Uint8Array[] = []
  //     for (let i = 0; i < config.SAMPLE_SIZE; i++) {
  //       proofs.push(kate_Proof.slice(i * config.KATE_PROOF_SIZE, (i + 1) * config.KATE_PROOF_SIZE))
  //     }

  //     //Detaiils updated on UI
  //     addBlock({ number: blockNumber, hash: blockHash, totalCellCount, confidence: 0 })

  //     //Indivisual cell verification
  //     let verifiedCount = 0
  //     let verifiedCells: any = []
  //     cells.forEach(async (cell, i) => {

  //       //console.log(proofs[i], commitments[cell.row], c, cell.row, cell.col)
  //       const res = check(proofs[i], commitments[cell.row], c, cell.row, cell.col)
  //       //console.log(res)
  //       if (res) {
  //         await sleep((i + 1) * 1000)
  //         verifiedCount++
  //         const confidence = 100 * (1 - (1 / (Math.pow(2, verifiedCount))))
  //         verifiedCells.push(cell)
  //         //@ts-ignore
  //         setLatestBlock({ hash: blockHash, number: blockNumber, totalCellCount: (r * config.EXTENSION_FACTOR) * c, confidence: confidence })
  //         //console.log(verifiedCells)
  //         setMatrix({
  //           maxRow: r * config.EXTENSION_FACTOR,
  //           maxCol: c,
  //           //@ts-ignore
  //           verifiedCells
  //         })
  //       }
  //     })
  //   });

  //   setStop(() => unsubscribe)
  // }

  const run = () => {
    refreshApp()
    runLC(processBlock, setStop)
  }



  const addBlock = (newBlock: Block) => {

    //console.log(newBlock)

    setLatestBlock(newBlock)

    //@ts-ignore
    setBlockList((list) => {
      let newBlockList: Block[] = []
      for (let i = list.length - 1; i >= 0 && i > list.length - config.BLOCK_LIST_SIZE; i--) {
        newBlockList.push(list[i])
      }
      newBlockList.reverse()
      newBlockList.push(newBlock)
      return newBlockList
    })
    //setBlockList(blockList => [...blockList, newBlock])
  }



  return (
    <>
      <Navbar showButton button={<Button onClick={() => { running ? (stop(), setRunning(false)) : run() }} variant={'outline'} className='text-white rounded-full border-opacity-70 bg-opacity-50 lg:px-8 lg:py-6 px-6 py-4 font-thicccboibold'>{running ? 'Stop Running the LC' : 'Start Running the LC'}</Button>} />
      <main className="">
        <div className="flex lg:flex-row flex-col-reverse lg:h-screen w-screen">
          <div className="lg:w-[60%] flex flex-col ">
            <div className="lg:h-[35%] 2xl:h-[40%] flex flex-col items-start justify-center mt-10">
              <AvailChain blockList={blockList} />
            </div>
            <DsMatrix matrix={matrix} />
          </div>
          <div className="lg:w-[40%] flex items-start lg:mt-20">
            <BlockData latestBlock={latestBlock} run={run} running={running} stop={stop} setRunning={setRunning} />
          </div>
        </div>

      </main>
    </>
  );
}


