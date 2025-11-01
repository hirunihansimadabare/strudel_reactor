import {useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function D3Graph({}) {
    //A ref to attach the D3 Graph
    const d3Container = useRef(null);

    //useEffect runs after the components
    useEffect(() => {
        //A function to handle custom event 'd3Data'
        const handleD3Data = (event) => {
            const data = event.detail;
            console.log("D3Graph received the data: ", data);

            if (d3Container.current && data && data.length > 0){
                //Clear if any previous graph elements
                d3.select(d3Container.current).selectAll('*').remove();

                //Set up dimensions
                const margin = {top: 20, right: 20, bottom: 30, left: 50 };
                const width = d3Container.current.clientWidth - margin.left - margin.right;
                const height = d3Container.current.clientHeight - margin.top - margin.bottom;

                //Append the SVG object
                const svg = d3.select(d3Container.current).append("svg").attr("width", width + margin.left +margin.right)
                .attr("height", height + margin.top + margin.bottom).append("g").attr("transform",`translate(${margin.left}, ${margin.top})`);

                /* Scales */
                //X scale
                const x =  d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);

                //Y scale
                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value) * 1.1]).range([height, 0]);

                /* Axes */
                //Append x-axis
                svg.append("g").attr("transform",`translate(0, ${height})`).call(d3.axisBottom(x).ticks(5));

                //Append y-axis
                svg.append("g").call(d3.axisLeft(y).ticks(5));

                //Line generator
                const line =d3.line()
                    .x((d, i) => x(i)) //x is the index
                    .y(d => y(d.value)) //y is the value
                    .curve(d3.curveMonotoneX); //To make the line smooth 

                //Draw the line path
                svg.append("path")
                    .datum(data) //bind the data
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);

            }

        };
        //Add the event listener when the component mounts
        document.addEventListener("D3Data", handleD3Data);

        //Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("D3Data", handleD3Data);
        };
    }, []);

    //the component's JSX structure
    return (
        <div ref={d3Container} style={{width: '100%', height: '300px' }}></div>
    );
}