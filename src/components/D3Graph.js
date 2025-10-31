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
            }
        }
    })
}
