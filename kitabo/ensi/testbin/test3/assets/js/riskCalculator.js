let betaCoefficients = []; // Array to store beta coefficients
let betaCoefficients2 = []; // Array to store the second set of beta coefficients
let s0 = []; // Base survival function (s0)
let s0_2 = []; // Second base survival function (s0_2)
let timePoints = []; // Time points for the survival function
let timePoints2 = []; // Second set of time points for the survival function

// Function to load model-specific data (model1 or model2) for beta coefficients
async function loadModelData(modelName) {

    console.log('Loading model data for:', modelName);

    try {

        const modelFilePath = modelName === 'model1'
            ? 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/model1_overall.csv'
            : 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/model2_overall.csv';

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

        console.log(`Loaded ${modelName} Beta Coefficients:`, betaCoefficients);

        // Load the second set of beta coefficients (betaCoefficient2)
        await loadSecondBetaCoefficients(modelName); // Call function to load betaCoefficient2

        // Load survival function data (s0) and time points from s0.csv
        await loadSurvivalData(modelName); // Call function to load s0.csv

        // Load the second set of time points (timePoints2) and s0 (s0_2)
        await loadSecondSurvivalData(modelName); // Call function to load s0_2 and timePoints2
    } catch (error) {
        console.error(`Error loading model data from ${modelName}:`, error);
    }
}

// Function to load second set of beta coefficients
async function loadSecondBetaCoefficients(modelName) {
    try {
        const betaFilePath = modelName === 'model1'
            ? 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/don_beta1_overall.csv'
            : 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/don_beta2_overall.csv';

        const data = await fetchCSV(betaFilePath);

        if (data.length === 0) {
            console.error(`Error: No data found in ${betaFilePath}`);
            return;
        }

        const [header, ...rows] = data;

        // Use the 2nd column for betaCoefficient2
        betaCoefficients2 = rows.map(row => {
            const cols = row.split(',');
            return parseFloat(cols[1]); // Use the 2nd column
        });

        console.log(`Loaded ${modelName} Beta Coefficients 2:`, betaCoefficients2);
    } catch (error) {
        console.error(`Error loading second beta coefficients from ${modelName}:`, error);
    }
}

// Function to load survival data from s0.csv for s0 and timePoints
async function loadSurvivalData(modelName) {
    try {

        console.log('Loading survival data for:', modelName);

        const survivalFilePath = modelName === 'model1'
            ? 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/mort_s0_overall.csv'
            : 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/esrd_s0_overall.csv';

        
        console.log('Survival File Path:', survivalFilePath);
        
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

// Function to load second set of survival data from don_s0.csv for timePoints2 and s0_2
async function loadSecondSurvivalData(modelName) {
    try {

        console.log('Loading second survival data for:', modelName);

        const survivalFilePath = modelName === 'model1'
            ? 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/don_mort_s0_overall.csv'
            : 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/don_esrd_s0_overall.csv';
        const data = await fetchCSV(survivalFilePath);
        
        console.log('Survival File Path:', survivalFilePath);

        if (data.length === 0) {
            console.error('Error: No data found in don_s0.csv');
            return;
        }

        const [header, ...rows] = data;

        // Use the 2nd column for timePoints2 and 3rd column for s0_2
        timePoints2 = rows.map(row => parseFloat(row.split(',')[1])); // Use the 2nd column for timePoints2
        s0_2 = rows.map(row => parseFloat(row.split(',')[2])); // Use the 3rd column for s0_2

        console.log('Loaded second survival data:', { timePoints2, s0_2 });
    } catch (error) {
        console.error('Error loading second survival data from ${survivalFilePath}:', error);
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

// Function to calculate risk using the scenario vector
async function calculateRisk() {
    // Calculate log hazard ratio (logHR) using the dot product of scenarioVector and betaCoefficients
    console.log('Beta Coefficients:', betaCoefficients);
    console.log('Beta Coefficients 2:', betaCoefficients2);
    console.log('senarioVector:', scenarioVector);
    console.log('senarioVector2:', scenarioVector2);
    const logHR = scenarioVector.reduce((acc, value, index) => acc + value * betaCoefficients[index], 0);
    const logHR2 = scenarioVector2.reduce((acc, value, index) => acc + value * betaCoefficients2[index], 0);

    // time to load the confidence intervals
    // model1 - mortality
    // model2 - esrd
    // model1 - mort_var_overall.csv don_var1_overall.csv
    // model2 - esrd_var_overall.csv don_var2_overall.csv
    const covUrl_nhs = currentModel === 'model1' ? 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/mort_var_overall.csv' : 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/esrd_var_overall.csv';
    const covUrl_don = currentModel === 'model1' ? 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/don_var1_overall.csv' : 'https://raw.githubusercontent.com/Vince-Jin/testbin/refs/heads/main/test3/assets/csv/don_var2_overall.csv';
    const ci_nhs = await loadCovarianceMatrixAndCalculateCI(covUrl_nhs, betaCoefficients, scenarioVector);
    const ci_don = await loadCovarianceMatrixAndCalculateCI(covUrl_don, betaCoefficients2, scenarioVector2);
    const ci_nhs_lb = ci_nhs.lower;
    const ci_nhs_ub = ci_nhs.upper;
    const ci_don_lb = ci_don.lower;
    const ci_don_ub = ci_don.upper;

    console.log('Log Hazard Ratio (logHR):', logHR);
    console.log('Confidence Intervals Upper Bound(NHS):', ci_nhs_ub);
    console.log('Confidence Intervals Lower Bound(NHS):', ci_nhs_lb);
    console.log('Log Hazard Ratio 2 (logHR2):', logHR2);
    console.log('Confidence Intervals Upper Bound(Donor):', ci_don_ub);
    console.log('Confidence Intervals Lower Bound(Donor):', ci_don_lb);

    // Adjust f0 by the logHR to calculate the risk
    const modifier = currentModel === 'model1' ? 100 : 10000;
    const f0 = s0.map(s => (1 - s)); // Convert survival probability to mortality risk
    const f1help = f0.map((f, index) => Math.min(f * Math.exp(logHR), 1)); // Apply logHR to adjust risk
    const f1help_lb = f0.map((f, index) => Math.max(Math.min(f * Math.exp(ci_nhs_lb), 1), 0)); // Apply logHR to adjust risk
    const f1help_ub = f0.map((f, index) => Math.max(Math.min(f * Math.exp(ci_nhs_ub), 1), 0)); // Apply logHR to adjust risk
    console.log('f1help:', f1help);
    const f1 = f1help.map((f, index) => f * modifier); // Apply logHR to adjust risk
    const f1_lb = f1help_lb.map((f, index) => f * modifier); // Apply logHR to adjust risk
    const f1_ub = f1help_ub.map((f, index) => f * modifier); // Apply logHR to adjust risk
    console.log('f1:', f1);
    const f0_2 = s0_2.map(s => (1 - s)); // Convert survival probability to mortality risk
    const f1help2 = f0_2.map((f, index) => Math.min(f * Math.exp(logHR2), 1)); // Apply logHR to adjust risk
    const f1help_lb2 = f0_2.map((f, index) => Math.max(Math.min(f * Math.exp(ci_don_lb), 1), 0)); // Apply logHR to adjust risk
    const f1help_ub2 = f0_2.map((f, index) => Math.max(Math.min(f * Math.exp(ci_don_ub), 1), 0)); // Apply logHR to adjust risk
    const f1_2 = f1help2.map((f, index) => f * modifier); // Apply logHR to adjust risk
    const f1_lb2 = f1help_lb2.map((f, index) => f * modifier); // Apply logHR to adjust risk
    const f1_ub2 = f1help_ub2.map((f, index) => f * modifier); // Apply logHR to adjust risk

    const sortedData = timePoints.map((time, index) => ({ time, risk: f1[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_nhs_lb = timePoints.map((time, index) => ({ time, risk: f1_lb[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_nhs_ub = timePoints.map((time, index) => ({ time, risk: f1_ub[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_don_lb = timePoints2.map((time, index) => ({ time, risk: f1_lb2[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedData_don_ub = timePoints2.map((time, index) => ({ time, risk: f1_ub2[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedTimePoints = sortedData.map(item => item.time);
    const sortedF1 = sortedData.map(item => item.risk);
    const sortedF1_lb = sortedData_nhs_lb.map(item => item.risk);
    const sortedF1_ub = sortedData_nhs_ub.map(item => item.risk);
    const sortedF1_lb2 = sortedData_don_lb.map(item => item.risk);
    const sortedF1_ub2 = sortedData_don_ub.map(item => item.risk);
    
    const sortedData2 = timePoints2.map((time, index) => ({ time, risk: f1_2[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedTimePoints2 = sortedData2.map(item => item.time);
    const sortedF1_2 = sortedData2.map(item => item.risk);

    // Use Plotly.js to create the plot
    const name1 = currentModel === 'model1' ? 'Mortality' : 'ESRD';
    const data = [
        {
            x: sortedTimePoints,
            y: sortedF1,
            mode: 'lines',
            line: { color: 'navy' },
            name: 'General Population ' + name1 + ' Risk'
        },
        {
            x: sortedTimePoints,
            y: sortedF1_lb,
            mode: 'lines',
            line: { color: 'navy', dash: 'dash' },
            name: 'Lower Bound of ' + 'General Population ' + name1 + ' Risk'
        },
        {
            x: sortedTimePoints,
            y: sortedF1_ub,
            mode: 'lines',
            line: { color: 'navy', dash: 'dash' },
            name: 'Upper Bound of ' + 'General Population ' + name1 + ' Risk'
        },
        {
            x: sortedTimePoints2,
            y: sortedF1_2,
            mode: 'lines',
            line: { color: 'maroon' },
            name: 'Donor ' + name1 + ' Risk'
        },
        {
            x: sortedTimePoints2,
            y: sortedF1_lb2,
            mode: 'lines',
            line: { color: 'maroon', dash: 'dash' },
            name: 'Lower Bound of ' + 'Donor ' + name1 + ' Risk'
        },
        {
            x: sortedTimePoints2,
            y: sortedF1_ub2,
            mode: 'lines',
            line: { color: 'maroon', dash: 'dash' },
            name: 'Upper Bound of ' + 'Donor ' + name1 + ' Risk'
        }
    ];

    const subtitle_txt = currentModel === 'model1' ? 'Mortality Risk Over Time (%)' : 'ESRD Risk Over Time(per 10,000)';
    const layout = {
        title: subtitle_txt,
        xaxis: {
            title: 'Time (days)',
            showgrid: true,
            dtick: 10 // Set tick interval to every 10 units
        },
        yaxis: {
            title: 'Risk',
            range: [0, ],
            showgrid: true
        }
    };

    // Plotly rendering with error handling
    Plotly.newPlot('mortality-risk-graph', data, layout).catch(error => {
        console.error('Plotly Error:', error);
    });

    // Display updated scenario vector
    // displayScenarioVector();
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

// Ensure that model data and survival data are loaded when the page loads
window.onload = function () {
    const modelName = currentModel === 'model1' ? 'model1' : 'model2'; // Ensure correct model name without .csv extension

    updateVariableInputs(); // Update the variable inputs based on the selected model
    updateVariableInputs2();
    loadModelData(modelName); // Load model-specific data for beta coefficients

    console.log('Loaded model data for:', modelName);
};