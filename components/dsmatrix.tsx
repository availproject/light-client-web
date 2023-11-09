"use client"

//@ts-ignore
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import { useEffect } from "react";

export default function DsMatrix() {
  useEffect(() => {
    const cal: CalHeatmap = new CalHeatmap();
    cal.paint(
        {
         theme: 'dark',
          data: {
            source: '/static/matrix.csv',
            type: 'csv',
            x: 'date',
            y: (d: { [x: string]: string | number; }) => +d['temp_max'],
            groupY: 'max',
          },
          date: { start: new Date('2012-01-01') },
          range: 10,
          scale: {
            color: {
              type: 'threshold',
              range: ['#14432a', '#166b34', '#37a446', '#4dd05a'],
              domain: [10, 20, 30],
            },
          },
          domain: {
            type: 'month',
            gutter: 4,
            label: { text: 'MMM', textAlign: 'start', position: 'top' },
          },
          subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
          itemSelector: '#ds-matrix',
        })
  });

  return (
    <div className="flex flex-col overflow-scroll p-10 space-y-4 ">
      <h1 className="heading !text-left">Data Sampling Matrix</h1>
      <div className="rounded-xl p-4 overflow-hidden text-[#292E3A]">
      <div id="ds-matrix" className=""></div> 
      </div>
        
    </div>
  );
}
