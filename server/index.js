const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

let windowSize = 10;
let windowPrevState = [];
let windowCurrState = [];

const apiUrls = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',  
    'r': 'http://20.244.56.144/test/random' 
};

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const validIds = ['p', 'f', 'e', 'r'];

    if (!validIds.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    let newNumbers = [];

    try {

        const startTime = new Date().getTime();
        const response = await axios.get(apiUrls[numberid], { timeout: 500 });
        const elapsedTime = new Date().getTime() - startTime;
        console.log(`Time taken: ${elapsedTime} ms`);

        if (response.status === 200) {
            newNumbers = response.data.numbers; 
        }

    }

    catch (error) {

        if (error.code === 'ECONNABORTED') {
            console.log("Request timed out!");
        }
        else {
            console.log(`Request failed: ${error.message}`);
        }
    }

    if (newNumbers.length > 0) {

        windowPrevState = [...windowCurrState];

        let updatedWindow = [...windowCurrState, ...newNumbers].filter((value, index, self) => self.indexOf(value) === index);
        
        if (updatedWindow.length > windowSize) {
            updatedWindow = updatedWindow.slice(updatedWindow.length - windowSize);
        }

        windowCurrState = updatedWindow;

    }

    const avg = windowCurrState.length > 0 ? (windowCurrState.reduce((a, b) => a + b, 0) / windowCurrState.length).toFixed(2) : 0;

    res.json({ windowPrevState, windowCurrState, numbers: newNumbers, avg: parseFloat(avg) });
    
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
