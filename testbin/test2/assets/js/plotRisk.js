function plotRisk(timePoints, mortalityRisk) {
    const data = [{
        x: timePoints,
        y: mortalityRisk,
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
}
