function plotRisk(timePoints, mortalityRisk, esrdRisk) {
    // Calculate the difference between the two lines
    const difference = mortalityRisk.map((value, index) => value - esrdRisk[index]);

    // Data for the first line (Mortality Risk)
    const trace1 = {
        x: timePoints,
        y: mortalityRisk,
        mode: 'lines',
        line: { color: 'green' },
        name: 'Mortality Risk',
        hovertemplate: 'Mortality Risk: %{y}<br>Risk Difference: %{customdata}<extra></extra>',
        customdata: difference // Add the difference as custom data for hover
    };

    // Data for the second line (ESRD Risk)
    const trace2 = {
        x: timePoints,
        y: esrdRisk,
        mode: 'lines',
        line: { color: 'blue' },
        name: 'ESRD Risk',
        hovertemplate: 'ESRD Risk: %{y}<br>Risk Difference: %{customdata}<extra></extra>',
        customdata: difference // Add the difference as custom data for hover
    };

    // Combine all traces
    const data = [trace1, trace2];

    // Layout for the plot
    const layout = {
        title: 'Risk Over Time',
        xaxis: {
            title: 'Time (years)',
            showgrid: true
        },
        yaxis: {
            title: 'Risk (%)',
            range: [0, 100],
            showgrid: true
        }
    };

    // Create the plot
    Plotly.newPlot('risk-graph', data, layout);
}