import { Block, Matrix } from '@/types/light-client';
import { createApi } from '../utils/api'
import config from "../utils/config"
import { generateRandomCells } from '@/utils/helper';



export async function runLC(onBlock: Function, registerUnsubscribe: Function): Promise<() => void> {
    const api: any = await createApi();
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header: any) => {
        //Extracting the data out from header
        const blockNumber = header.number.toString()
        const extension = JSON.parse(header.extension)
        const commitment = extension.v1.commitment
        const kateCommitment = commitment.commitment.split('0x')[1]
        const r = commitment.rows
        const c = commitment.cols
        const timestamp = Date.now();

        //fetching block hash from number 
        const blockHash = (await api.rpc.chain.getBlockHash(header.number)).toString();
        console.log(`New Block with hash: ${blockHash}, Number: ${blockNumber} `)

        //Generating SAMPLE_SIZE random cell for sampling
        const totalCellCount = (r * config.EXTENSION_FACTOR) * c
        let sampleCount = config.SAMPLE_SIZE
        if (sampleCount >= totalCellCount) {
            sampleCount = 5
        }
        const randomCells = generateRandomCells(r, c, sampleCount)

        //Query data proof for sample 0,0
        const kateProof = await api.rpc.kate.queryProof(randomCells, blockHash);
        const kate_Proof = Uint8Array.from(kateProof)
        const kate_commitment = Uint8Array.from(kateCommitment.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))

        //Creating commitement array based on rows and proof array based on cells
        let commitments: Uint8Array[] = []
        for (let i = 0; i < (r * config.EXTENSION_FACTOR); i++) {
            commitments.push(kate_commitment.slice(i * config.COMMITMENT_SIZE, (i + 1) * config.COMMITMENT_SIZE))
        }
        let proofs: Uint8Array[] = []
        for (let i = 0; i < config.SAMPLE_SIZE; i++) {
            proofs.push(kate_Proof.slice(i * config.KATE_PROOF_SIZE, (i + 1) * config.KATE_PROOF_SIZE))
        }


        //Create required info for process block
        const block: Block = { number: blockNumber, hash: blockHash, totalCellCount: totalCellCount, confidence: 0, sampleCount: sampleCount, timestamp }
        const matrix: Matrix = { maxRow: r, maxCol: c, verifiedCells: [], totalCellCount }
        onBlock(block, matrix, randomCells, proofs, commitments)
    });

    return registerUnsubscribe(() => unsubscribe);
}