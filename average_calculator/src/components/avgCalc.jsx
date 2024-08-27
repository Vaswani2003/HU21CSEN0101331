import React, { useState } from 'react';
import axios from 'axios';
import './avgCalc.css'; 

const AvgCalc = () => {

    const [numberType, setNumberType] = useState('p');
    const [windowPrevState, setWindowPrevState] = useState([]);
    const [windowCurrState, setWindowCurrState] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [avg, setAvg] = useState(0);

    const fetchNumbers = async () => {

        try {
        
            const response = await axios.get(`http://localhost:9876/numbers/${numberType}`);

            if (response.status === 200) {

                const newNumbers = response.data.numbers;

                const secondResponse = await axios.post('http://localhost:3000/process', {
                    numbers: newNumbers
                });

                if (secondResponse.status === 200) {
              
                    setWindowPrevState(secondResponse.data.windowPrevState);
                    setWindowCurrState(secondResponse.data.windowCurrState);
                    setNumbers(secondResponse.data.numbers);
                    setAvg(secondResponse.data.avg);
                }
            }

        }

        catch (error) {
            console.error('Failed to fetch or send numbers:', error);
        }

    };

    return (

        <div className="container">

            <h1>Average Calculator</h1>

            <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>

                <option value="p">Prime</option>
                <option value="f">Fibonacci</option>
                <option value="e">Even</option>
                <option value="r">Random</option>

            </select>

    
            <button onClick={fetchNumbers}>Fetch Numbers</button>
            <div className="results">
                <h2>Results</h2>

                <p><strong>Previous State:</strong> {JSON.stringify(windowPrevState)}</p>
                <p><strong>Current State:</strong> {JSON.stringify(windowCurrState)}</p>
                <p><strong>Numbers Fetched:</strong> {JSON.stringify(numbers)}</p>
                <p><strong>Average:</strong> {avg}</p>
                
            </div>
        </div>
    );
};

export default AvgCalc;
