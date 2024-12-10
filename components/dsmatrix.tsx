"use client";

import { Matrix } from "@/types/light-client";
import config from "../utils/config";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { calculateGridDimensions, mapCellToDisplayGrid, logGridMapping } from "../utils/helper";

type Props = {
  matrix: Matrix;
  processing: boolean;
  hasDaSubmissions: boolean;
  blockNumber: string;
  network: string;
};

export default function DsMatrix(props: Props) {
    const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);
    const matrix = props.matrix;
    const processing = props.processing;

    // Calculate grid dimensions based on matrix size
    const { rows, cols } = calculateGridDimensions(matrix);

    // Create arrays for grid rendering
    const rowArray = new Array(rows).fill(0);
    const colArray = new Array(cols).fill(0);

    const checkForSampleCell = (displayRow: number, displayCol: number) => {
        if (!matrix.verifiedCells || matrix.verifiedCells.length === 0) return false;

        return matrix.verifiedCells.some(cell => {
            const mapped = mapCellToDisplayGrid(cell, matrix, rows);
            return mapped.displayRow === displayRow && mapped.displayCol === displayCol;
        });
    };

    const colorCheck = (row: number, col: number): string => {
        const isSampleCell = checkForSampleCell(row, col);
        // Default background for non-sampled cells
        return isSampleCell ? (processing ? "#FFFF00" : "#3CBBF9") : "#222630";
    };

    useEffect(() => {
        if (matrix && matrix.verifiedCells.length > 0 && !processing) {
            // Only log grid mapping when processing is complete
            logGridMapping(matrix, rows);
        }
    }, [matrix, processing, rows]);

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="rounded-xl flex items-center justify-center flex-col p-4 bg-[#292E3A]">
                <div 
                    className="matrix w-[350px] md:w-[500px] h-[350px] md:h-[500px]"
                    style={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gap: '1px',
                        backgroundColor: '#1a1d25',
                        padding: '1px',
                       
                    }} 
                >
                    {rowArray.map((_, i) => (
                        colArray.map((_, j) => (
                            <div
                                key={`${i}-${j}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: colorCheck(i, j),
                                    transition: 'background-color 0.3s'
                                }}
                            />
                        ))
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 pt-6">
                <HoverCard open={isHoverCardOpen} onOpenChange={setIsHoverCardOpen}>
                    <HoverCardTrigger className="heading lg:!text-3xl lg:!text-left !w-full 2xl:pb-2 pb-1 flex flex-row space-x-1">
                        <span>
                            Data Sampling Matrix{" "}
                            {props.hasDaSubmissions && (
                                <span className="!text-opacity-70 text-opacity !text-md text-[#22C55F]">
                                    {`(${rows} × ${cols})`}
                                </span>
                            )}
                        </span>
                        <InfoIcon onClick={() => setIsHoverCardOpen(true)} className="w-5 h-5" />
                    </HoverCardTrigger>
                    <HoverCardContent align="center" side="top" className="bg-[#141414] mb-4 text-white border-[#121212] !text-sm">
                        Shows the cells being sampled by the LC. Total cells: {matrix.totalCellCount}
                    </HoverCardContent>
                </HoverCard>
            </div>
        </div>
    );
}
