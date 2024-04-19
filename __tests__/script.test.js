import { updateZoom, updateChart, getDatasetByIndex } from './src/scripts/script.js';

// Mock Chart.js library
jest.mock('chart.js', () => {
    const mockChart = {
        update: jest.fn(),
        data: {
            datasets: [
                { data: [1, 2, 3] },
                { data: [4, 5, 6] },
                { data: [7, 8, 9] }
            ]
        }
    };
    return jest.fn().mockImplementation(() => mockChart);
});

describe('Script tests', () => {
    let timeSeriesChart;

    beforeEach(() => {
        // Mock the canvas context
        document.body.innerHTML = '<canvas id="timeSeriesChart"></canvas>';
        timeSeriesChart = new Chart(document.getElementById('timeSeriesChart').getContext('2d'), {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateZoom', () => {
        it('should update the chart\'s scale options and call update', () => {
            updateZoom(5);
            expect(timeSeriesChart.options.scales.x.min).toBe(5);
            expect(timeSeriesChart.update).toHaveBeenCalled();
        });
    });

    describe('updateChart', () => {
        it('should update the chart\'s data and call update', () => {
            updateChart(2);
            expect(timeSeriesChart.data.labels).toEqual(['02:00', '03:00', '04:00']);
            expect(timeSeriesChart.data.datasets[0].data).toEqual([3]);
            expect(timeSeriesChart.update).toHaveBeenCalled();
        });
    });

    describe('getDatasetByIndex', () => {
        it('should return the correct dataset based on the index', () => {
            expect(getDatasetByIndex(0)).toEqual([1, 2, 3]);
            expect(getDatasetByIndex(1)).toEqual([4, 5, 6]);
            expect(getDatasetByIndex(2)).toEqual([7, 8, 9]);
            expect(getDatasetByIndex(3)).toEqual([]);
        });
    });
});
