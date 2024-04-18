document.addEventListener("DOMContentLoaded", function() {
    const labels = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00"
    ];
    let dataset1 = [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40];
    let dataset2 = [73, 6, 10, 42, 94, 75, 22, 65, 59, 80, 81, 56, 55, 40];
    let dataset3 = [13, 27, 30, 97, 99, 69, 73, 65, 59, 80, 81, 56, 55, 40];

    const ctx = document.getElementById("timeSeriesChart").getContext("2d");
    const timeSeriesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: [], data: dataset1, borderColor: "cyan", borderWidth: 1, fill: false, cubicInterpolationMode: "monotone" },
                { label: [], data: dataset2, borderColor: "red", borderWidth: 1, fill: false, cubicInterpolationMode: "stepped" },
                { label: [], data: dataset3, borderColor: "green", borderWidth: 1, fill: false }
            ]
        },
        options: {
            responsive: true,
            title: { display: true, text: "Time Series Graph" },
            scales: { x: { display: true, min: 0, stepSize: 1 }, y: { display: true, min: 0, max: 100 } }
        }
    });

    // Create a draggable play head
    const displayDiv = document.getElementById("display");
    const mainChart = document.getElementById("timeSeriesChart");
    const playHead = document.createElement("div");
    playHead.id = "playhead";
    playHead.style.position = "absolute";
    playHead.style.height = mainChart.style.height;
    playHead.style.borderLeft = "2px solid black";
    playHead.style.left = mainChart.style.left + "32px";
    playHead.style.top = "0";
    playHead.style.cursor = "pointer";
    playHead.style.pointerEvents = "auto"; 
    displayDiv.appendChild(playHead);

    // Tip of playhead
    const triangleTip = document.createElement("div");
    triangleTip.id = "playhead_tip";
    playHead.appendChild(triangleTip);

    triangleTip.style.position = "absolute";
    triangleTip.style.borderLeft = "8px solid transparent";
    triangleTip.style.borderRight = "8px solid transparent";
    triangleTip.style.borderTop = "12px solid black";
    triangleTip.style.right = "-7px";

    // Initialise Play head info display
    playheadInfo = document.getElementById("playheadInfo")
    playheadInfo.innerHTML = "00:00:00:00";

    // Add dragging functionality
    playHead.addEventListener("mousedown", startDragging);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("mousemove", dragPlayHead);

    let isDragging = false;

    function startDragging(e) {
        isDragging = true;
    }

    function stopDragging() {
        isDragging = false;
    }

    const mouseXOffset = document.body.clientWidth - mainChart.clientWidth;

    // Function to drag the play head
    function dragPlayHead(event) {
        if (isDragging) {
            const rect = timeSeriesChart.canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            if (x < 0) {
                x = 0;
            } else if (x > rect.width) {
                x = rect.width;
            }
            playHead.style.left = `${x}px`;
            const index = (x / rect.width) * (labels.length - 1);
            const sample = Math.floor(index);
            const values = timeSeriesChart.data.datasets.map((dataset) => dataset.data[sample]);
            document.getElementById("value1").value = values[0];
            document.getElementById("value2").value = values[1];
            document.getElementById("value3").value = values[2];
            const centisecond = Math.round((index - sample) * 60);
            const time = `${String(sample).padStart(1, "0")}:${String(centisecond).padStart(1, "0")}`;
            playheadInfo.innerHTML = `00:00:${time}`;
        }
    }

    // Add zoom functionality
    const zoomrangeSlider = document.getElementById("zoomSlider");
    zoomrangeSlider.addEventListener("input", updateZoom);

    function updateZoom() {
        const zoomLevel = parseInt(zoomrangeSlider.value);
        timeSeriesChart.options.scales.x.min = zoomLevel;
        timeSeriesChart.update();
    }

    // Add displacement slider functionality
    const displacementSlider = document.getElementById("displacementSlider");
    displacementSlider.addEventListener("input", updateChart);

    function updateChart() {
        const displacement = parseInt(displacementSlider.value);
        const startIndex = Math.max(0, displacement - 1);
        const endIndex = labels.length;
        timeSeriesChart.data.labels = labels.slice(startIndex, endIndex);
        timeSeriesChart.data.datasets.forEach((dataset, index) => {
            dataset.data = getDatasetByIndex(index).slice(startIndex, endIndex);
        });
        timeSeriesChart.update();
    }

    // Function to get dataset by index
    function getDatasetByIndex(index) {
        switch (index) {
            case 0: return dataset1;
            case 1: return dataset2;
            case 2: return dataset3;
            default: return [];
        }
    }
});
