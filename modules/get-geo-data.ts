import * as d3 from 'd3';
import * as topojson from 'topojson';

export default async function geoDemo (chart, enabled, center?, scale?) {
    if (!enabled) return;

    const projection = d3.geoMercator().center(center || [ -110, 40 ])
        // .geoAlbersUsa()
        // .geoConicEqualArea().parallels([ 30, 40 ]).rotate([ 100, 0 ])
        // .geoEquirectangular().center(center || [ -125, 55 ])
        .scale(scale || 500);

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
        chart.svg.node().classList.add('map');
        addToMap((await world('land'))[0], 'land').classed('land', true);
        // addToMap((await world('roads'))[0], 'roads').classed('roads', true);
    // })(world);

    return world;
};
