async function loadCalculator() {
    const selectedCalculator = document.querySelector('input[name="calculator"]:checked').value;
    const calculatorContainer = document.getElementById('calculator-container');
    const dynamicScripts = document.getElementById('dynamic-scripts');

    // Clear previous content
    calculatorContainer.innerHTML = '';

    // Clear existing scripts
    while (dynamicScripts.firstChild) {
        dynamicScripts.removeChild(dynamicScripts.firstChild);
    }

    // Load the general files if not already loaded
    let scriptsToLoad = [];

    if (selectedCalculator === '30year') {
        scriptsToLoad = [
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test3/assets/js/modelSwitch.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test3/assets/js/plotRisk.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test3/assets/js/riskCalculator.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test3/assets/js/variableMenu.js'
        ];
    } else if (selectedCalculator === '90day') {
        scriptsToLoad = [
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test2/assets/js/modelSwitch.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test2/assets/js/plotRisk.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test2/assets/js/riskCalculator.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test2/assets/js/variableMenu.js'
        ];
    } else {
        scriptsToLoad = [
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test4/assets/js/variableMenu.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test4/assets/js/riskCalculator.js',
            'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test4/assets/js/plotRisk.js'
        ];
    }

    const loadScripts = scriptsToLoad.map(src => {
        return new Promise((resolve, reject) => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement('script');
                script.src = src;
                script.async = false; // Ensure scripts are executed in order
                script.onload = resolve;
                script.onerror = reject;
                dynamicScripts.appendChild(script);
            } else {
                resolve();
            }
        });
    });

    if (!document.querySelector('link[href="https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test5/assets/css/style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://raw.githack.com/Vince-Jin/testbin/refs/heads/main/test5/assets/css/style.css';
        document.head.appendChild(link);
    }

    // Load the calculator content based on the selection
    if (selectedCalculator === '90day') {
        calculatorContainer.innerHTML = `
            <div class="calculator-container">
                <h1>90-Day Mortality Risk Calculator</h1>
                <!-- Model Selection Slide Bar -->
                <div class="model-toggle-container">
                    <span id="model1Label">Model 1</span>
                    <label class="switch">
                        <input type="checkbox" id="modelSwitch" onclick="toggleModel()">
                        <span class="slider round"></span>
                    </label>
                    <span id="model2Label">Model 2</span>
                </div>
                <form id="calculator-form">
                    <h2>Set Variables</h2>
                    <div id="variable-inputs"></div>
                    <button type="button" onclick="calculateRisk()">Calculate Risk</button>
                </form>
                <h2>Risk Plot</h2>
                <div id="mortality-risk-graph-container">
                    <div id="mortality-risk-graph"></div>
                </div>
            </div>
        `;
    } else if (selectedCalculator === '30year') {
        calculatorContainer.innerHTML = `
            <div class="calculator-container">
                <h1>30-Year Mortality Risk Calculator</h1>
                <!-- Model Selection Slide Bar -->
                <div class="model-toggle-container">
                    <span id="model1Label">Mortality</span>
                    <label class="switch">
                        <input type="checkbox" id="modelSwitch" onclick="toggleModel()">
                        <span class="slider round"></span>
                    </label>
                    <span id="model2Label">ESRD</span>
                </div>
                <form id="calculator-form">
                    <h2>Set Variables For Control Population</h2>
                    <div id="variable-inputs"></div>
                    <h2>Set Variables For Donor Population</h2>
                    <div id="variable-inputs-2"></div>
                    <button type="button" onclick="calculateRisk()">Calculate Risk</button>
                </form>
                <h2>Risk Plot</h2>
                <div id="mortality-risk-graph-container">
                    <div id="mortality-risk-graph"></div>
                </div>
            </div>
        `;
    } else if (selectedCalculator === 'hospitalization') {
        calculatorContainer.innerHTML = `
            <div class="calculator-container">
                <h1>All-cause Hospitalization After Nephrectomy</h1>
                <h1>Among Live Kidney Donors</h1>
                <form id="calculator-form">
                    <h2>Set Variables</h2>
                    <div id="variable-inputs"></div>
                    <button type="button" onclick="calculateRisk()">Calculate Risk</button>
                </form>
                <h2>Risk Plot</h2>
                <div id="hospitalization-risk-graph-container">
                    <div id="hospitalization-risk-graph"></div>
                </div>
            </div>
        `;
    }

    // Ensure the scripts are executed after being added to the DOM
    await Promise.all(loadScripts);

    // Load model data and survival data
    if (selectedCalculator === '30year' || selectedCalculator === '90day') {
        toggleModel();
    } else {
        await loadModelData();
        await loadSurvivalData();
        updateVariableInputs();
    }
}