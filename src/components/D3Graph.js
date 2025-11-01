import useEffect from 'react'
import useRef from 'react'

export default function D3Graph({height = 220}) {
    //A ref to attach the D3 Graph
    const D3Container = useRef(null);

    //useEffect runs after the components
    useEffect(() => {
        //A function to handle custom event 'd3Data'
        const handleD3Data = (event) => {
            const data = event.detail;
            console.log("D3Graph received the data: ", data);

            if (D3Container.current && data && data.length > 0){
                //Clear if any previous graph elements
                d3.select(D3Container.current).selectAll('*').remove();

                //Set up dimensions
                const margin = {top: 20, right: 20, bottom: 30, left: 50 };
                const width = D3Container.current.clientWidth - margin.left - margin.right;
                const height = D3Container.current.clientHeight - margin.top - margin.bottom;

                //Append the SVG object
                const svg = d3.select(D3Container.current).append("svg").attr("width", width + margin.left +margin.right)
                .attr("height", height + margin.top, margin.bottom).append("g").attr("transform",`translate(${margin.left}, ${margin.top}`);

                /* Scales */
                //X scale
                const x =  d3.scaleLinear().domain([0, data.length - 1]).range([height, 0]);

                //Y scale
                const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height, 0]);
            }

        }
    })
}