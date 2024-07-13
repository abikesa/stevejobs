'use strict';

var scenarioVector = [0, 0, 1]; // Default to general population scenario
let beta = [];
let s0 = [];
let timePoints = [];
let recognition;
let mortalityChart;
let lastScenario = null;
let lastCalculationTime = 0;
const CALCULATION_COOLDOWN = 1; // 1 second cooldown; not convinced of this

async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.trim()).filter(row => row);
}

async function loadData() {
    try {
        // Fetch coefficients
        const coefficientsData = await fetchCSV('https://abikesa.github.io/flow/_downloads/b57ad99810799d0be5a9e18f54115561/b.csv');
        const [header, ...rows] = coefficientsData;
        beta = rows[0].split(',').map(Number);
        console.log('Coefficients loaded:', beta);

        // Fetch survival data
        const survivalData = await fetchCSV('https://abikesa.github.io/flow/_downloads/9c26f2afd014707dc60aefc8facbf60d/s0.csv');
        const [survivalHeader, ...survivalRows] = survivalData;
        timePoints = [];
        s0 = [];
        survivalRows.forEach(row => {
            const [time, survival] = row.split(',').map(Number);
            timePoints.push(time);
            s0.push(survival);
        });
        console.log('Survival data loaded:', {timePoints, s0});

        // Enable the calculate button after data is loaded
        document.getElementById('calculate-risk-button').disabled = false;
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check the console for details.');
    }
}

function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = function(event) {
            const result = event.results[0][0].transcript;
            document.getElementById('dictation-result').textContent = result;
            processDictationResult(result);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };
    } else {
        alert('Speech recognition is not supported in this browser.');
    }
}

function processDictationResult(result) {
    console.log('Processing:', result);
    
    const keywords = {
        donor: /donor/i,
        control: /control/i,
        general: /general\s*population/i
    };

    let scenario = 'genpop'; // Default scenario

    if (keywords.donor.test(result)) {
        scenario = 'donor';
    } else if (keywords.control.test(result)) {
        scenario = 'control';
    }

    console.log('Detected scenario:', scenario);
    document.getElementById('scenario-dropdown').value = scenario;
    selectScenario(scenario);  // Correct function call to update scenarioVector
}

function selectScenario(scenario) {
    switch (scenario) {
        case 'donor':
            scenarioVector = [1, 0, 0];
            break;
        case 'control':
            scenarioVector = [0, 1, 0];
            break;
        case 'genpop':
        default:
            scenarioVector = [0, 0, 1];
            break;
    }
    throttledCalculateRisk(scenario);
}

function throttledCalculateRisk(scenario) {
    const now = Date.now();
    if (now - lastCalculationTime > CALCULATION_COOLDOWN) {
        lastCalculationTime = now;
        calculateMortalityRisk(scenario);
    }
}

function calculateMortalityRisk(scenario) {
    console.log('calculateMortalityRisk called with scenario:', scenario);

    if (beta.length === 0 || s0.length === 0 || timePoints.length === 0) {
        alert('Data is not yet loaded. Please wait.');
        return;
    }

    const logHR = beta.reduce((acc, curr, index) => acc + (curr * scenarioVector[index]), 0);
    const f0 = s0.map(s => (1 - s) * 100);
    const f1 = f0.map((f, index) => f * Math.exp(logHR));

    const colorSchemes = {
        'donor': 'rgba(0, 191, 255, 1)',
        'control': 'rgba(255, 0, 255, 1)',
        'genpop': 'rgba(106, 168, 79, 1)'
    };

    const ctx = document.getElementById('mortality-risk-graph').getContext('2d');

    if (!mortalityChart) {
        mortalityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timePoints.map(t => t.toFixed(2)),
                datasets: [{
                    label: 'Mortality Risk',
                    data: f1,
                    stepped: true,
                    borderColor: colorSchemes[scenario],
                    backgroundColor: colorSchemes[scenario].replace('1)', '0.2)'),
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Ensure the aspect ratio is maintained
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Timepoints (years)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Mortality Risk (%)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                animation: {
                    duration: 0 // Disable animation to prevent continuous updating issue
                }
            }
        });
    } else {
        mortalityChart.data.datasets[0].data = f1;
        mortalityChart.data.datasets[0].borderColor = colorSchemes[scenario];
        mortalityChart.data.datasets[0].backgroundColor = colorSchemes[scenario].replace('1)', '0.2)');
        mortalityChart.update();
    }

    document.getElementById("mortality-risk-results").innerText = timePoints.map((time, index) => `Risk at ${time.toFixed(2)} years: ${f1[index].toFixed(2)}%`).join('\n');
}

// Event Listeners
window.addEventListener('load', function() {
    loadData();
    setupSpeechRecognition();
});

document.getElementById("scenario-dropdown").addEventListener("change", function() {
    selectScenario(this.value);  // Correct function call to update scenarioVector
});

document.getElementById("calculate-risk-button").addEventListener("click", function() {
    const scenario = document.getElementById("scenario-dropdown").value;
    selectScenario(scenario);  // Correct function call to update scenarioVector
});

document.getElementById('start-dictation').addEventListener('click', function() {
    if (recognition) {
        recognition.start();
    } else {
        alert('Speech recognition is not set up.');
    }
});
