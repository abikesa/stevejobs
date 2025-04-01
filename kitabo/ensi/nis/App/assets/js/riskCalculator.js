let betaCoefficients = []; // Array to store beta coefficients
let s0 = []; // Base survival function (s0)
let timePoints = []; // Time points for the survival function
let confidenceIntervals = {}; // Object to store confidence intervals

const covUrl = 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test4/assets/csv/cox_var.csv';

window.onload = function () {
    updateVariableInputs();
    loadModelData(); // Load model-specific data on page load
};

// Function to load model-specific data for beta coefficients
async function loadModelData() {
    const modelFilePath = 'https://raw.githubusercontent.com/Vince-Jin/NIS_App/refs/heads/main/App/assets/csv/beta.csv';

    try {
        console.log('Loading model data from:', modelFilePath);

        const data = await fetchCSV(modelFilePath);

        if (data.length === 0) {
            console.error(`Error: No data found in ${modelFilePath}`);
            return;
        }

        const [header, ...rows] = data;

        // Use the 4th column for beta coefficients
        betaCoefficients = rows.map(row => {
            const cols = row.split(',');
            return parseFloat(cols[3]); // Use the 4th column
        });

        console.log('Loaded Beta Coefficients:', betaCoefficients);

        // Load survival function data (s0) and time points from s0.csv
        await loadSurvivalData(); // Call function to load s0.csv

        // Load covariance matrix and calculate confidence intervals
        await loadCovarianceMatrixAndCalculateCI(covUrl, betaCoefficients, scenarioVector);
    } catch (error) {
        console.error(`Error loading model data from ${modelFilePath}:`, error);
    }
}

// Function to load survival data from s0.csv for s0 and timePoints
async function loadSurvivalData() {
    const survivalFilePath = 'https://raw.githubusercontent.com/Vince-Jin/NIS_App/refs/heads/main/App/assets/csv/s0.csv';

    try {
        console.log('Loading survival data from:', survivalFilePath);

        const data = await fetchCSV(survivalFilePath);

        if (data.length === 0) {
            console.error(`Error: No data found in ${survivalFilePath}`);
            return;
        }

        const [header, ...rows] = data;

        // Use the 1st column for timePoints and 2nd column for s0
        timePoints = rows.map(row => parseFloat(row.split(',')[0])); // Use the 1st column
        s0 = rows.map(row => parseFloat(row.split(',')[1])); // Use the 2nd column

        console.log('Loaded survival data:', { timePoints, s0 });
    } catch (error) {
        console.error(`Error loading survival data from ${survivalFilePath}:`, error);
    }
}

// Example fetchCSV utility to load the CSV file
async function fetchCSV(filePath) {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        return text.trim().split('\n');
    } catch (error) {
        console.error(`Error fetching CSV from ${filePath}:`, error);
        return [];
    }
}

// Function to parse CSV files
function parseCsv(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: result => resolve(result.data),
            error: err => reject(err)
        });
    });
}

// Function to reconstruct the covariance matrix from parsed CSV data
function reconstructCovMatrix(data) {
    const covMatrix = [];
    const headers = Object.keys(data[0]).slice(1); // Get the headers excluding the first empty column

    // Create a mapping of current order to desired order
    const orderMap = {};
    headers.forEach((header, index) => {
        orderMap[header] = index;
    });

    // Reorganize the rows
    headers.forEach(rowName => {
        const rowIndex = orderMap[rowName];
        const row = data[rowIndex];
        const newRow = [];

        // Reorganize the columns
        headers.forEach(colName => {
            newRow.push(row[colName]);
        });

        covMatrix.push(newRow);
    });

    return covMatrix;
}

// Function to calculate the mean of the linear combination
function calculateMean(beta, c) {
    return c.reduce((sum, ci, i) => sum + ci * beta[i], 0);
}

// Function to calculate the variance of the linear combination
function calculateVariance(c, cov) {
    let variance = 0;
    for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < c.length; j++) {
            variance += c[i] * c[j] * cov[i][j];
        }
    }
    return variance;
}

// Function to calculate the confidence intervals
function calculateConfidenceIntervals(beta, c, cov, confidenceLevel = 0.95) {
    const zScore = 1.96; // Approx for 95% confidence level
    const mean = calculateMean(beta, c);
    const variance = calculateVariance(c, cov);
    const standardError = Math.sqrt(variance);

    const lower = mean - zScore * standardError;
    const upper = mean + zScore * standardError;

    return { mean, lower, upper };
}

// Function to load covariance matrix and calculate confidence intervals
async function loadCovarianceMatrixAndCalculateCI(covUrl, betaCoefficients, scenarioVector) {
    try {
        // Parse the CSV file
        const data = await parseCsv(covUrl);

        // Reconstruct the covariance matrix
        const covMatrix = reconstructCovMatrix(data);

        // Log the beta matrix and c matrix
        console.log('Beta Matrix:', betaCoefficients);
        console.log('C Matrix (Scenario Vector):', scenarioVector);

        // Calculate the confidence intervals
        const confidenceIntervals = calculateConfidenceIntervals(betaCoefficients, scenarioVector, covMatrix);

        // Log the variance (covariance) matrix
        console.log('Variance (Covariance) Matrix:', covMatrix);

        // Display the results
        console.log(`Mean of the linear combination: ${confidenceIntervals.mean}`);
        console.log(`95% Confidence Interval: [${confidenceIntervals.lower}, ${confidenceIntervals.upper}]`);

        return confidenceIntervals;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Function to calculate risk (example implementation)
async function calculateRisk() {
    // Example risk calculation logic
    console.log('Calculating risk...');
    // Use betaCoefficients, s0, and timePoints to calculate risk
    // Adjust f0 by the logHR to calculate the risk
    const logHR = scenarioVector.reduce((acc, value, index) => acc + value * betaCoefficients[index], 0);
    
    // Load covariance matrix and calculate confidence intervals
    const ci = await loadCovarianceMatrixAndCalculateCI(covUrl, betaCoefficients, scenarioVector); // Ensure the function is awaited
    console.log('Confidence Intervals:', ci);
    
    const logHR_lb = ci.lower;
    const logHR_ub = ci.upper;
    console.log('logHR:', logHR);
    console.log('logHR_lb:', logHR_lb);
    console.log('logHR_ub:', logHR_ub);
    
    const f0 = s0.map(s => (1 - s)); // Convert survival probability to mortality risk
    const f1help = f0.map((f, index) => Math.min(f * Math.exp(logHR), 1)); // Apply logHR to adjust risk
    const f1help_lb = f0.map((f, index) => Math.max(Math.min(f * Math.exp(logHR_lb), 1), 0)); // Apply logHR to adjust risk
    const f1help_ub = f0.map((f, index) => Math.max(Math.min(f * Math.exp(logHR_ub), 1), 0)); // Apply logHR to adjust risk
    console.log('f1help:', f1help);
    console.log('f1help_lb:', f1help_lb);
    console.log('f1help_ub:', f1help_ub);
    const f1 = f1help.map((f, index) => f * 100); // Apply logHR to adjust risk
    const f1_lb = f1help_lb.map((f, index) => f * 100); // Apply logHR to adjust risk
    const f1_ub = f1help_ub.map((f, index) => f * 100); // Apply logHR to adjust risk
    console.log('f1:', f1);
    console.log('f1_lb:', f1_lb);
    console.log('f1_ub:', f1_ub);

    const sortedData = timePoints.map((time, index) => ({ time, risk: f1[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_lb = timePoints.map((time, index) => ({ time, risk: f1_lb[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_ub = timePoints.map((time, index) => ({ time, risk: f1_ub[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedTimePoints = sortedData.map(item => item.time);
    const sortedF1 = sortedData.map(item => item.risk);
    const sortedF1_lb = sortedData_lb.map(item => item.risk);
    const sortedF1_ub = sortedData_ub.map(item => item.risk);

    // Use Plotly.js to create the plot
    const data = [
        {
            x: sortedTimePoints,
            y: sortedF1,
            mode: 'lines',
            line: { color: 'navy' },
            name: 'Discharge Opportunity'
        },
        {
            x: sortedTimePoints,
            y: sortedF1_lb,
            mode: 'lines',
            line: { color: 'navy', dash: 'dash' },
            name: 'Lower Bound of Discharge Opportunity'
        },
        {
            x: sortedTimePoints,
            y: sortedF1_ub,
            mode: 'lines',
            line: { color: 'navy', dash: 'dash' },
            name: 'Upper Bound of Discharge Opportunity'
        }
    ];

    const layout = {
        title: 'Discharge Opportunity Over Time',
        xaxis: {
            title: 'Time After Hospitalization (days)',
            showgrid: true,
            dtick: 5 // Set tick interval to every 10 units
        },
        yaxis: {
            title: 'Discharge Opportunity (%)',
            range: [0, ],
            showgrid: true
        }
    };

    // Plotly rendering with error handling
    Plotly.newPlot('hospitalization-risk-graph', data, layout).catch(error => {
        console.error('Plotly Error:', error);
    });
}