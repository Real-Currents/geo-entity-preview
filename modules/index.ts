import geoDemo from './get-geo-data';
import createChart from './chart-factory';

const style = require('../styles/index.css');

export default async function index() {
    (async () => {
        const d3GeoChart = await createChart({
            width: innerWidth,
            height: innerHeight,
            margin: {top: 0, right: 0, bottom: 0, left: 0}
        });

        console.log(d3GeoChart.container);

        await geoDemo(
            d3GeoChart,
            true
        );
    })();
}
