let scenarioVector2_90day = []; // New vector to store age, gender, and race input

function updateVariableInputs() {
    const variableInputsDiv = document.getElementById('variable-inputs');
    variableInputsDiv.innerHTML = ''; // Clear previous inputs

    if (currentModel_90day === 'model1') {
        // Model 1: Categorical variables
        scenarioVector = [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]; // Reset scenarioVector for Model 1
        scenarioVector2_90day = [0, 0, 1, 0, 1, 0, 0, 1]; // Initialize scenarioVector2_90day for Model 1

        variableInputsDiv.innerHTML = `
            <div>
                <label for="ageGroup">Age Group:</label><br>
                <div class="radio-group">
                    <input type="radio" id="ageGroup1" name="ageGroup" value="<=40">
                    <label for="ageGroup1"> <=40</label>
                    <input type="radio" id="ageGroup2" name="ageGroup" value="40-49">
                    <label for="ageGroup2"> 40-49</label>
                    <input type="radio" id="ageGroup3" name="ageGroup" value=">=50" checked>
                    <label for="ageGroup3"> >=50</label>
                </div>
            </div>

            <div>
                <label for="gender">Gender:</label><br>
                <div class="radio-group">
                    <input type="radio" id="genderMale" name="gender" value="male">
                    <label for="genderMale"> Male</label>
                    <input type="radio" id="genderFemale" name="gender" value="female" checked>
                    <label for="genderFemale"> Female</label>
                </div>
            </div>

            <div>
                <label for="raceEthnicity">Race/Ethnicity:</label><br>
                <div class="radio-group">
                    <input type="radio" id="raceEthnicity1" name="raceEthnicity" value="black">
                    <label for="raceEthnicity1"> Black</label>
                    <input type="radio" id="raceEthnicity2" name="raceEthnicity" value="other-multiracial">
                    <label for="raceEthnicity2"> Other and Multiracial</label>
                    <input type="radio" id="raceEthnicity3" name="raceEthnicity" value="white" checked>
                    <label for="raceEthnicity3"> White</label>
                </div>
            </div>

            <div>
                <label for="selfRatedHealth">Self-Rated Health:</label><br>
                <div class="radio-group">
                    <input type="radio" id="selfRatedHealth1" name="selfRatedHealth" value="excellent">
                    <label for="selfRatedHealth1"> Excellent</label>
                    <input type="radio" id="selfRatedHealth2" name="selfRatedHealth" value="very-good">
                    <label for="selfRatedHealth2"> Very Good</label>
                    <input type="radio" id="selfRatedHealth3" name="selfRatedHealth" value="good" checked>
                    <label for="selfRatedHealth3"> Good</label>
                    <input type="radio" id="selfRatedHealth4" name="selfRatedHealth" value="fair">
                    <label for="selfRatedHealth4"> Fair</label>
                    <input type="radio" id="selfRatedHealth5" name="selfRatedHealth" value="poor">
                    <label for="selfRatedHealth5"> Poor</label>
                </div>
            </div>
        `;

        // Event listeners for categorical variables to update scenarioVector and scenarioVector2
        document.getElementsByName('ageGroup').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([0, 1, 2], idx);
                updateScenarioVector2FromInput([0, 1, 2], idx); // Also update scenarioVector2
            });
        });
        document.getElementsByName('gender').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([3, 4], idx);
                updateScenarioVector2FromInput([3, 4], idx); // Also update scenarioVector2
            });
        });
        document.getElementsByName('raceEthnicity').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([5, 6, 7], idx);
                updateScenarioVector2FromInput([5, 6, 7], idx); // Also update scenarioVector2
            });
        });
        document.getElementsByName('selfRatedHealth').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([8, 9, 10, 11, 12], idx);
            });
        });
    } else if (currentModel_90day === 'model2') {
        // Model 2: Continuous and Categorical variables
        scenarioVector = [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0]; // Reset scenarioVector for Model 2
        scenarioVector2_90day = [60, 0, 1, 0, 0, 1]; // Initialize scenarioVector2 for Model 2

        variableInputsDiv.innerHTML = `
            <div>
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" value="60">
                <input type="range" id="ageRange" min="18" max="100" value="60" oninput="document.getElementById('age').value = this.value">
            </div>

            <div>
                <label for="gender">Gender:</label><br>
                <div class="radio-group">
                    <input type="radio" id="genderMale" name="gender" value="male">
                    <label for="genderMale"> Male</label>
                    <input type="radio" id="genderFemale" name="gender" value="female" checked>
                    <label for="genderFemale"> Female</label>
                </div>
            </div>

            <div>
                <label for="raceEthnicity">Race/Ethnicity:</label><br>
                <div class="radio-group">
                    <input type="radio" id="raceEthnicity1" name="raceEthnicity" value="mexican-american">
                    <label for="raceEthnicity1"> Mexican American</label>
                    <input type="radio" id="raceEthnicity2" name="raceEthnicity" value="other-hispanic">
                    <label for="raceEthnicity2"> Other Hispanic</label>
                    <input type="radio" id="raceEthnicity3" name="raceEthnicity" value="non-hispanic-white" checked>
                    <label for="raceEthnicity3"> Non-Hispanic White</label>
                    <input type="radio" id="raceEthnicity4" name="raceEthnicity" value="non-hispanic-black">
                    <label for="raceEthnicity4"> Non-Hispanic Black</label>
                    <input type="radio" id="raceEthnicity5" name="raceEthnicity" value="other">
                    <label for="raceEthnicity5"> Other</label>
                </div>
            </div>

            <div>
                <label for="selfRatedHealth">Self-Rated Health:</label><br>
                <div class="radio-group">
                    <input type="radio" id="selfRatedHealth1" name="selfRatedHealth" value="excellent">
                    <label for="selfRatedHealth1"> Excellent</label>
                    <input type="radio" id="selfRatedHealth2" name="selfRatedHealth" value="very-good">
                    <label for="selfRatedHealth2"> Very Good</label>
                    <input type="radio" id="selfRatedHealth3" name="selfRatedHealth" value="good" checked>
                    <label for="selfRatedHealth3"> Good</label>
                    <input type="radio" id="selfRatedHealth4" name="selfRatedHealth" value="fair">
                    <label for="selfRatedHealth4"> Fair</label>
                    <input type="radio" id="selfRatedHealth5" name="selfRatedHealth" value="poor">
                    <label for="selfRatedHealth5"> Poor</label>
                </div>
            </div>
        `;

        // Event listeners for Model 2 variables
        const ageInput = document.getElementById('age');
        const ageRange = document.getElementById('ageRange');

        const updateAge = (value) => {
            let adjustedValue = parseFloat(value) - 60; // Decrease the input by 60
            updateScenarioVectorFromInput([0], adjustedValue); // For scenarioVector
            updateScenarioVector2FromInput([0], parseFloat(value)); // Direct value for scenarioVector2
        };

        ageInput.addEventListener('input', (e) => {
            ageRange.value = e.target.value; // Sync slider with input
            updateAge(e.target.value);
        });

        ageRange.addEventListener('input', (e) => {
            ageInput.value = e.target.value; // Sync input with slider
            updateAge(e.target.value);
        });

        document.getElementsByName('gender').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([1, 2], idx); // Update scenarioVector for gender
                updateScenarioVector2FromInput([1, 2], idx); // Update scenarioVector2 for gender
            });
        });

        document.getElementsByName('raceEthnicity').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([3, 4, 5, 6, 7], idx); // Update scenarioVector for race
                // Update scenarioVector2: In Model 2, only the last three positions are relevant for race
                updateScenarioVector2FromInput2([3, 4, 5, 6, 7], idx);
            });
        });

        document.getElementsByName('selfRatedHealth').forEach((input, idx) => {
            input.addEventListener('change', () => {
                updateScenarioVectorFromInput([8, 9, 10, 11, 12], idx);
            });
        });
    }
}

// Update the scenario vector based on user input
function updateScenarioVectorFromInput(indices, value) {
    indices.forEach((index, idx) => {
        if (indices.length === 1 && index === 0) {
            scenarioVector[index] = value; // For age, set the value directly
        } else {
            scenarioVector[index] = idx === value ? 1 : 0; // For categorical variables
        }
    });

    // Log the updated scenario vector to the console for debugging
    console.log('Updated Scenario Vector (for debugging):', scenarioVector);

    calculateRisk(); // Trigger the risk calculation in riskCalculator.js
}

// Update the scenarioVector2 based on user input
function updateScenarioVector2FromInput2(indices, value) {
    indices.forEach((index, idx) => {
        if (indices.length === 1 && index === 0) {
            scenarioVector2_90day[index] = value; // For age, set the value directly
        } else if (indices.length === 3 && index >= 3 && index <= 5) {
            // For race in Model 2, set one index to 1 and the others to 0
            indices.forEach((raceIndex, raceIdx) => {
                scenarioVector2_90day[raceIndex] = (raceIdx === value) ? 1 : 0; // Set selected race to 1, others to 0
            });
        } else {
            scenarioVector2_90day[index] = idx === value ? 1 : 0; // For gender and other inputs
        }
    });

    if (scenarioVector2_90day[3] === 1 | scenarioVector2_90day[4] === 1 | scenarioVector2_90day[7] === 1) {
        // If Non-Hispanic Black is selected, update the last index to 1
        scenarioVector2_90day[3] = 0;
        scenarioVector2_90day[4] = 1;
        scenarioVector2_90day[5] = 0;
    } else if (scenarioVector2_90day[6] === 1) {
        // If Other is selected, update the last index to 1
        scenarioVector2_90day[3] = 1;
        scenarioVector2_90day[4] = 0;
        scenarioVector2_90day[5] = 0;
    }  else if (scenarioVector2_90day[5] === 1) {
        // If Other is selected, update the last index to 1
        scenarioVector2_90day[3] = 0;
        scenarioVector2_90day[4] = 0;
        scenarioVector2_90day[5] = 1;
    }

    // Truncate the last two values of scenarioVector2_90day
    scenarioVector2_90day = scenarioVector2_90day.slice(0, -2);

    // Log the updated scenarioVector2_90day to the console for debugging
    console.log('Updated Scenario Vector 2 (for debugging):', scenarioVector2_90day);
}

// Update the scenarioVector2_90day based on user input
function updateScenarioVector2FromInput(indices, value) {
    indices.forEach((index, idx) => {
        if (indices.length === 1 && index === 0) {
            scenarioVector2_90day[index] = value; // For age, set the value directly
        } else {
            scenarioVector2_90day[index] = idx === value ? 1 : 0; // For gender and race
        }
    });

    // Log the updated scenarioVector2_90day to the console for debugging
    console.log('Updated Scenario Vector 2 (for debugging):', scenarioVector2_90day);
}

// Initialize the form with default values for the selected model
window.onload = function () {
    updateVariableInputs(); // Ensure variables for the selected model are displayed
};

