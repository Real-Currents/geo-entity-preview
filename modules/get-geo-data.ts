import * as d3 from 'd3';
import * as topojson from 'topojson';
import createChart from "./chart-factory";

export default async function geoDemo (enabled) {
    if (!enabled) return;
    const chart = createChart({
        width: innerWidth,
        height: innerHeight,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const projection = d3.geoEquirectangular()
        .center([ -120, 60 ])
        .scale(500);

    const world = async (geoClass) => await Promise.all([
            (await fetch(`data/${geoClass}.json`)).json()
    ]);

    const addToMap = (collection, key) => {
        console.log(key, collection);

        return chart.container.append('g')
            .selectAll('path')
            .data(topojson.feature(collection, collection.objects[key]).features)
            .enter()
            .append('path')
            .attr('d', d3.geoPath().projection(projection));
    };

    (async (getWorldData) => {
        const sea = (await getWorldData('water'))[0];
        const land = (await getWorldData('land'))[0];
        const cultural = (await getWorldData('cultural'))[0];
        addToMap(sea, 'water').classed('water', true);
        addToMap(land, 'land').classed('land', true);
        addToMap(cultural, 'ne_10m_admin_0_boundary_lines_land').classed('boundary', true);
        chart.svg.node().classList.add('map');
    })(world);
};
