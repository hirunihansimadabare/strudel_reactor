import React from 'react';

export default function PreProcessingEditor({text, onTextChange}){
    const handleChange = (event) => {
        onTextChange(event.target.value);
    };

    return (
        <>
            <label htmlFor="proc" className="form-label">Text to preprocess:</label>
            <textarea className="form-control" rows="19" id="proc" value={text} onChange={handleChange}
            ></textarea>
        </>
    )
}