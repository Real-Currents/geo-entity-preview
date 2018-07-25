import * as d3 from 'd3';
import * as topojson from 'topojson';
import createChart from "./chart-factory";

export default async function geoDemo (chart, enabled, center?, scale?) {
    if (!enabled) return;

    const projection = d3.geoEquirectangular().center(center || [ -86.862, 33.545 ])
        // .geoConicEqualArea().parallels([ 30, 40 ]).rotate([ 100, 0 ])
        // .geoAlbersUsa()
        // .geoEquirectangular()
        .scale(scale || 1500000);

    const world = async (geoClass) => await Promise.all([
            (await fetch(`data/${geoClass}.json`)).json()
    ]);

    (<any> world).projection = projection;

    const addToMap = (collection, key) => {
        console.log(key, collection);

        return chart.container.append('g')
            .selectAll('path')
            .data(topojson.feature(collection, collection.objects[key]).features)
            .enter()
            .append('path')
            .attr('d', d3.geoPath().projection(projection))
            .attr('fill', 'none');
    };

    // await (async (getWorldData) => {
        const sea = (await world('water'))[0];
        const land = (await world('land'))[0];
        const roads = (await world('roads'))[0];
        //const cultural = (await world('cultural'))[0];
        addToMap(sea, 'water').classed('water', true);
        addToMap(land, 'land').classed('land', true);
        addToMap(roads, 'roads').classed('roads', true);
        //addToMap(cultural, 'ne_10m_admin_0_boundary_lines_land').classed('boundary', true);
        chart.svg.node().classList.add('map');
    // })(world);

    return world;
};
