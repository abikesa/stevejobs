let scenarioVectors = {}; // Object to store scenario vectors for each variable
let scenarioVectorHelper = []; // Helper vector to aggregate all scenario vectors for categorical variables
let baseValues = {}; // Object to store base values for continuous variables
let scenarioVector = []; // Final scenario vector to be used in RiskCalculator.js

let scenarioVectors2 = {}; // Object to store scenario vectors for each variable for the second menu
let scenarioVectorHelper2 = []; // Helper vector to aggregate all scenario vectors for categorical variables for the second menu
let baseValues2 = {}; // Object to store base values for continuous variables for the second menu
let scenarioVector2 = []; // Final scenario vector to be used in RiskCalculator.js for the second menu

async function loadVariableData(filePath) {
    const data = await fetchCSV(filePath);

    if (data.length === 0) {
        console.error(`Error: No data found in ${filePath}`);
        return [];
    }

    const [header, ...rows] = data;
    const variables = rows.map(row => {
        const cols = row.split(',');
        return {
            variable: cols[0],
            value_label: cols[1],
            categorical: parseInt(cols[2], 10),
            values: cols[3],
            base: parseInt(cols[4], 10),
            display_text: cols[5]
        };
    });

    return variables;
}

async function updateVariableInputs() {
    const variableInputsDiv = document.getElementById('variable-inputs');
    variableInputsDiv.innerHTML = ''; // Clear previous inputs

    const variables = await loadVariableData('https://raw.githubusercontent.com/Vince-Jin/testbin/main/test3/assets/csv/variable.csv');

    // Group variables by their names
    const groupedVariables = variables.reduce((acc, variable) => {
        if (!acc[variable.variable]) {
            acc[variable.variable] = [];
        }
        acc[variable.variable].push(variable);
        return acc;
    }, {});

    // Initialize scenario vectors based on the variable names
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model1`;

        if (firstVariable.categorical === 1) {
            scenarioVectors[variableNameWithModel] = new Array(variableGroup.length).fill(0);
            variableGroup.forEach((variable, idx) => {
                if (variable.base === 1) {
                    scenarioVectors[variableNameWithModel][idx] = 1; // Set default value based on "base" column
                }
            });
        } else {
            scenarioVectors[variableNameWithModel] = firstVariable.base; // Initialize continuous variables with base value
            baseValues[variableNameWithModel] = firstVariable.base; // Store base value for continuous variables
        }
    });

    // Display non-categorical variables first
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model1`;

        if (firstVariable.categorical !== 1) {
            // Create slider and input for continuous variables
            const continuousGroup = document.createElement('div');
            continuousGroup.innerHTML = `
                <label for="${variableNameWithModel}">${firstVariable.display_text}:</label>
                <input type="number" id="${variableNameWithModel}" name="${variableNameWithModel}" value="${firstVariable.base}">
                <input type="range" id="${variableNameWithModel}Range" min="0" max="200" value="${firstVariable.base}" oninput="document.getElementById('${variableNameWithModel}').value = this.value">
            `;

            const numberInput = continuousGroup.querySelector(`input[type="number"]`);
            const rangeInput = continuousGroup.querySelector(`input[type="range"]`);

            numberInput.addEventListener('input', (e) => {
                rangeInput.value = e.target.value; // Sync slider with input
                updateScenarioVector(variableNameWithModel, parseFloat(e.target.value));
            });

            rangeInput.addEventListener('input', (e) => {
                numberInput.value = e.target.value; // Sync input with slider
                updateScenarioVector(variableNameWithModel, parseFloat(e.target.value));
            });

            variableInputsDiv.appendChild(continuousGroup);
        }
    });

    // Display categorical variables
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model1`;

        if (firstVariable.categorical === 1) {
            // Create radio group for categorical variables
            const radioGroup = document.createElement('div');
            radioGroup.innerHTML = `<label>${firstVariable.display_text}:</label><br>`;

            variableGroup.forEach((variable, idx) => {
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.id = `${variableNameWithModel}${idx}`;
                radioInput.name = variableNameWithModel;
                radioInput.value = variable.values;
                if (variable.base === 1) {
                    radioInput.checked = true;
                    scenarioVectors[variableNameWithModel][idx] = 1; // Set default value based on "base" column
                }

                const radioLabel = document.createElement('label');
                radioLabel.htmlFor = radioInput.id;
                radioLabel.innerText = variable.value_label;

                radioGroup.appendChild(radioInput);
                radioGroup.appendChild(radioLabel);

                radioInput.addEventListener('change', () => {
                    updateScenarioVector(variableNameWithModel, idx);
                    console.log(`Updated Scenario Vector for ${variable.variable}:`, scenarioVectors[variableNameWithModel]);
                });
            });

            variableInputsDiv.appendChild(radioGroup);
        }
    });

    // Display all constructed scenario vectors for categorical variables
    Object.keys(scenarioVectors).forEach(variableNameWithModel => {
        if (Array.isArray(scenarioVectors[variableNameWithModel])) {
            console.log(`Constructed Scenario Vector for ${variableNameWithModel}:`, scenarioVectors[variableNameWithModel]);
        }
    });

    // Display the overall scenarioVectorHelper
    updateScenarioVectorHelper();
    console.log('Overall Scenario Vector Helper:', scenarioVectorHelper);

    // Set scenarioVector to be equal to scenarioVectorHelper
    scenarioVector = [...scenarioVectorHelper];
    console.log('Final Scenario Vector:', scenarioVector);
}

async function updateVariableInputs2() {
    const variableInputsDiv2 = document.getElementById('variable-inputs-2');
    variableInputsDiv2.innerHTML = ''; // Clear previous inputs

    const variables = await loadVariableData('https://raw.githubusercontent.com/Vince-Jin/testbin/main/test3/assets/csv/variable_control.csv');

    // Group variables by their names
    const groupedVariables = variables.reduce((acc, variable) => {
        if (!acc[variable.variable]) {
            acc[variable.variable] = [];
        }
        acc[variable.variable].push(variable);
        return acc;
    }, {});

    // Initialize scenario vectors based on the variable names
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model2`;

        if (firstVariable.categorical === 1) {
            scenarioVectors2[variableNameWithModel] = new Array(variableGroup.length).fill(0);
            variableGroup.forEach((variable, idx) => {
                if (variable.base === 1) {
                    scenarioVectors2[variableNameWithModel][idx] = 1; // Set default value based on "base" column
                }
            });
        } else {
            scenarioVectors2[variableNameWithModel] = firstVariable.base; // Initialize continuous variables with base value
            baseValues2[variableNameWithModel] = firstVariable.base; // Store base value for continuous variables
        }
    });

    // Display non-categorical variables first
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model2`;

        if (firstVariable.categorical !== 1) {
            // Create slider and input for continuous variables
            const continuousGroup = document.createElement('div');
            continuousGroup.innerHTML = `
                <label for="${variableNameWithModel}">${firstVariable.display_text}:</label>
                <input type="number" id="${variableNameWithModel}" name="${variableNameWithModel}" value="${firstVariable.base}">
                <input type="range" id="${variableNameWithModel}Range" min="0" max="200" value="${firstVariable.base}" oninput="document.getElementById('${variableNameWithModel}').value = this.value">
            `;

            const numberInput = continuousGroup.querySelector(`input[type="number"]`);
            const rangeInput = continuousGroup.querySelector(`input[type="range"]`);

            numberInput.addEventListener('input', (e) => {
                rangeInput.value = e.target.value; // Sync slider with input
                updateScenarioVector2(variableNameWithModel, parseFloat(e.target.value));
            });

            rangeInput.addEventListener('input', (e) => {
                numberInput.value = e.target.value; // Sync input with slider
                updateScenarioVector2(variableNameWithModel, parseFloat(e.target.value));
            });

            variableInputsDiv2.appendChild(continuousGroup);
        }
    });

    // Display categorical variables
    Object.keys(groupedVariables).forEach(variableName => {
        const variableGroup = groupedVariables[variableName];
        const firstVariable = variableGroup[0];
        const variableNameWithModel = `${variableName}_model2`;

        if (firstVariable.categorical === 1) {
            // Create radio group for categorical variables
            const radioGroup = document.createElement('div');
            radioGroup.innerHTML = `<label>${firstVariable.display_text}:</label><br>`;

            variableGroup.forEach((variable, idx) => {
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.id = `${variableNameWithModel}${idx}`;
                radioInput.name = variableNameWithModel;
                radioInput.value = variable.values;
                if (variable.base === 1) {
                    radioInput.checked = true;
                    scenarioVectors2[variableNameWithModel][idx] = 1; // Set default value based on "base" column
                }

                const radioLabel = document.createElement('label');
                radioLabel.htmlFor = radioInput.id;
                radioLabel.innerText = variable.value_label;

                radioGroup.appendChild(radioInput);
                radioGroup.appendChild(radioLabel);

                radioInput.addEventListener('change', () => {
                    updateScenarioVector2(variableNameWithModel, idx);
                    console.log(`Updated Scenario Vector for ${variable.variable}:`, scenarioVectors2[variableNameWithModel]);
                });
            });

            variableInputsDiv2.appendChild(radioGroup);
        }
    });

    // Display all constructed scenario vectors for categorical variables
    Object.keys(scenarioVectors2).forEach(variableNameWithModel => {
        if (Array.isArray(scenarioVectors2[variableNameWithModel])) {
            console.log(`Constructed Scenario Vector for ${variableNameWithModel}:`, scenarioVectors2[variableNameWithModel]);
        }
    });

    // Display the overall scenarioVectorHelper
    updateScenarioVectorHelper2();
    console.log('Overall Scenario Vector Helper 2:', scenarioVectorHelper2);

    // Set scenarioVector2 to be equal to scenarioVectorHelper2
    scenarioVector2 = [...scenarioVectorHelper2];
    console.log('Final Scenario Vector 2:', scenarioVector2);
}

// Update the scenario vector based on user input
function updateScenarioVector(variableName, value) {
    if (Array.isArray(scenarioVectors[variableName])) {
        scenarioVectors[variableName] = scenarioVectors[variableName].map((_, i) => (i === value ? 1 : 0)); // Update scenario vector for categorical variables
    } else {
        scenarioVectors[variableName] = value; // Update scenario vector for continuous variables
    }

    // Log the updated scenario vector to the console for debugging
    console.log(`Updated Scenario Vector for ${variableName} (for debugging):`, scenarioVectors[variableName]);

    updateScenarioVectorHelper(); // Update the overall scenarioVectorHelper

    calculateRisk(); // Trigger the risk calculation in riskCalculator.js
}

// Update the scenario vector based on user input for the second menu
function updateScenarioVector2(variableName, value) {
    if (Array.isArray(scenarioVectors2[variableName])) {
        scenarioVectors2[variableName] = scenarioVectors2[variableName].map((_, i) => (i === value ? 1 : 0)); // Update scenario vector for categorical variables
    } else {
        scenarioVectors2[variableName] = value; // Update scenario vector for continuous variables
    }

    // Log the updated scenario vector to the console for debugging
    console.log(`Updated Scenario Vector for ${variableName} (for debugging):`, scenarioVectors2[variableName]);

    updateScenarioVectorHelper2(); // Update the overall scenarioVectorHelper2

    calculateRisk(); // Trigger the risk calculation in riskCalculator.js
}

// Update the overall scenarioVectorHelper
function updateScenarioVectorHelper() {
    scenarioVectorHelper = []; // Clear the helper vector
    Object.keys(scenarioVectors).forEach(variableName => {
        if (Array.isArray(scenarioVectors[variableName])) {
            scenarioVectorHelper = scenarioVectorHelper.concat(scenarioVectors[variableName]);
        } else {
            scenarioVectorHelper.push(scenarioVectors[variableName] - baseValues[variableName]); // Add continuous variable values minus base value
        }
    });

    // Log the updated overall scenarioVectorHelper to the console for debugging
    console.log('Updated Overall Scenario Vector Helper (for debugging):', scenarioVectorHelper);

    // Update the final scenarioVector
    scenarioVector = [...scenarioVectorHelper];
    console.log('Final Scenario Vector:', scenarioVector);
}

// Update the overall scenarioVectorHelper for the second menu
function updateScenarioVectorHelper2() {
    scenarioVectorHelper2 = []; // Clear the helper vector
    Object.keys(scenarioVectors2).forEach(variableName => {
        if (Array.isArray(scenarioVectors2[variableName])) {
            scenarioVectorHelper2 = scenarioVectorHelper2.concat(scenarioVectors2[variableName]);
        } else {
            scenarioVectorHelper2.push(scenarioVectors2[variableName] - baseValues2[variableName]); // Add continuous variable values minus base value
        }
    });

    // Log the updated overall scenarioVectorHelper to the console for debugging
    console.log('Updated Overall Scenario Vector Helper 2 (for debugging):', scenarioVectorHelper2);

    // Update the final scenarioVector2
    scenarioVector2 = [...scenarioVectorHelper2];
    console.log('Final Scenario Vector 2:', scenarioVector2);
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

// Initialize the form with default values for the selected model
window.onload = function () {
    updateVariableInputs();
    updateVariableInputs2();
};