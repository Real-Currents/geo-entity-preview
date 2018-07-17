import * as d3 from 'd3';
import * as topojson from 'topojson';
import createChart from "./chart-factory";

export const geoDemo = (async (enabled) => {
    if (!enabled) return;
    const chart = createChart();

    const projection = d3.geoEquirectangular()
        .center([ 8, 56 ])
        .scale(500);

    const world = await Promise.all([
        (await fetch('data/water.json')).json(),
        (await fetch('data/land.json')).json,
        (await fetch('data/cultural.json')).json()
    ]);

    const addToMap = (collection, key) => chart.container.append('g')
        .selectAll('path')
        .data(topojson.feature(collection, collection.objects[key]).features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(projection));

})(true);
 