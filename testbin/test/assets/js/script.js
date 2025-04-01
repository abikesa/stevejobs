'use strict';

let scenarioVector = [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0]; // Default scenarioVector
let betaCoefficients = []; // Beta coefficients for scenarioVector
let s0 = [];
let timePoints = [];
let variableNames = [];
let lastCalculationTime = 0;
const CALCULATION_COOLDOWN = 1000; // 1 second cooldown

const continuousVars = ['age_c', 'bpxsar_c', 'bpxdar_c', 'bmi_c', 'egfr_c', 'uacr_c', 'ghb_c']; // Continuous variables

async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return text.split('\n').map(row => row.trim()).filter(row => row);
    } catch (error) {
        console.error(`Error fetching CSV from ${url}:`, error);
    }
}

async function loadData() {
    try {
        // Load variable names from the menu file (ignore coefficient column)
        const menuData = await fetchCSV('https://raw.githubusercontent.com/Vince-Jin/testbin/main/menu.csv');
        const [menuHeader, ...menuRows] = menuData;
        variableNames = menuRows.map(row => row.split(',')[0]);  // Extract variable names
        console.log('Variable Names:', variableNames);

        // Dynamically populate the UI with variable inputs
        populateVariableOptions(variableNames);

        // Load beta coefficients
        const betaData = await fetchCSV('https://raw.githubusercontent.com/abikesa/philosophy/main/kitabo/ensi/data/b_nondonor.csv');
        const betaRow = betaData[1].split(','); // Get the second row for beta coefficients
        betaCoefficients = betaRow.map(Number); // Convert to numbers
        console.log('Beta Coefficients:', betaCoefficients);

        // Load survival data (unchanged)
        const s0Data = await fetchCSV('https://raw.githubusercontent.com/abikesa/philosophy/main/kitabo/ensi/data/s0_nondonor.csv');
        const s0Headers = s0Data[0].split(',');
        const timeIndex = s0Headers.indexOf('_t');
        const survivalIndex = s0Headers.indexOf('s0_nondonor');
        timePoints = [];
        s0 = [];
        s0Data.slice(1).forEach(row => {
            const rowData = row.split(',');
            timePoints.push(parseFloat(rowData[timeIndex]));
            s0.push(parseFloat(rowData[survivalIndex]));
        });
        console.log('Survival data loaded:', { timePoints, s0 });

        // Enable the calculate button after data is loaded
        document.getElementById('calculate-risk-button').disabled = false;
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check the console for details.');
    }
}

function populateVariableOptions(variableNames) {
    const variableContainer = document.getElementById('variable-options');
    const dropdownGroups = {}; // To store grouped dropdown variables

    // Loop through variables and aggregate them based on the prefix
    variableNames.forEach((variable, index) => {
        const prefix = variable.split('_')[0]; // Get the prefix before the underscore

        if (continuousVars.includes(variable)) {
            // For continuous variables, set the default value from scenarioVector
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `var-${index}`;
            input.value = scenarioVector[index]; // Set the value based on the scenarioVector
            input.step = "any"; // Allow decimal inputs
            input.addEventListener('input', () => updateScenarioVectorFromInput(index, parseFloat(input.value)));

            const label = document.createElement('label');
            label.htmlFor = `var-${index}`;
            label.textContent = `${variable}: `;

            variableContainer.appendChild(label);
            variableContainer.appendChild(input);
            variableContainer.appendChild(document.createElement('br'));
        } else {
            // For non-continuous variables, aggregate into dropdown lists
            if (!dropdownGroups[prefix]) {
                dropdownGroups[prefix] = [];
            }
            dropdownGroups[prefix].push({ variable, index });
        }
    });

    // Create dropdowns for each group of variables with the same prefix
    for (const prefix in dropdownGroups) {
        const group = dropdownGroups[prefix];
        const select = document.createElement('select');
        select.id = `var-${group[0].index}`;
        select.addEventListener('change', () => {
            const selectedOptionIndex = select.selectedIndex;
            updateScenarioVectorFromInput(group[selectedOptionIndex].index, 1); // Set selected level to 1
            group.forEach(({ index }, idx) => {
                if (idx !== selectedOptionIndex) updateScenarioVectorFromInput(index, 0); // Set others to 0
            });
        });

        const label = document.createElement('label');
        label.htmlFor = `var-${group[0].index}`;
        label.textContent = `${prefix}: `;

        // Populate the dropdown with options
        group.forEach(({ variable, index }, idx) => {
            const option = document.createElement('option');
            option.value = scenarioVector[index]; // Set the value based on the scenarioVector
            option.textContent = variable.replace(`${prefix}_`, ''); // Use the part after the prefix
            option.selected = scenarioVector[index] === 1; // Set the option based on the scenarioVector

            select.appendChild(option);
        });

        variableContainer.appendChild(label);
        variableContainer.appendChild(select);
        variableContainer.appendChild(document.createElement('br'));
    }
}

function updateScenarioVectorFromInput(index, value) {
    scenarioVector[index] = value; // Update scenario vector with user input
    console.log('Updated Scenario Vector:', scenarioVector);
    throttledCalculateRisk(); // Recalculate risk after scenario update
}

function throttledCalculateRisk() {
    const now = Date.now();
    if (now - lastCalculationTime > CALCULATION_COOLDOWN) {
        lastCalculationTime = now;
        calculateMortalityRisk();
    }
}

function calculateMortalityRisk() {
    console.log('Calculating Mortality Risk...');

    if (s0.length === 0 || timePoints.length === 0 || betaCoefficients.length === 0) {
        alert('Data is not yet loaded. Please wait.');
        return;
    }

    // Calculate log hazard ratio (logHR) using the dot product of scenarioVector and betaCoefficients
    const logHR = scenarioVector.reduce((acc, value, index) => acc + value * betaCoefficients[index], 0);
    console.log('Log Hazard Ratio (logHR):', logHR);

    // Adjust f0 by the logHR to calculate the risk
    const f0 = s0.map(s => (1 - s) * 100); // Convert survival probability to mortality risk
    const f1 = f0.map((f, index) => Math.min(f * Math.exp(logHR), 100)); // Apply logHR to adjust risk
    // !!!!!: the min hides the fact that some of the f1 are exceeding 100%

    const sortedData = timePoints.map((time, index) => ({ time, risk: f1[index] }))
        .sort((a, b) => a.time - b.time); // Sort by time

    const sortedTimePoints = sortedData.map(item => item.time);
    const sortedF1 = sortedData.map(item => item.risk);

    // Use Plotly.js to create the plot
    const data = [{
        x: sortedTimePoints,
        y: sortedF1,
        mode: 'lines',
        line: { color: 'green' },
        name: 'Mortality Risk'
    }];

    const layout = {
        title: 'Mortality Risk Over Time',
        xaxis: {
            title: 'Time (years)',
            showgrid: true
        },
        yaxis: {
            title: 'Mortality Risk (%)',
            range: [0, 100],
            showgrid: true
        }
    };

    Plotly.newPlot('mortality-risk-graph', data, layout);

    // Display the scenarioVector below the plot
    displayScenarioVector();
}

function displayScenarioVector() {
    const scenarioDisplay = document.getElementById('scenario-vector-display');
    scenarioDisplay.innerHTML = `<strong>Scenario Vector:</strong> [${scenarioVector.join(', ')}]`;
}

// Event listeners
window.addEventListener('load', function() {
    loadData();
});

document.getElementById("calculate-risk-button").addEventListener("click", function() {
    throttledCalculateRisk();
});
