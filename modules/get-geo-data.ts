import * as d3 from 'd3';
import * as topojson from 'topojson';

export default async function geoDemo (chart, enabled, center?, scale?) {
    if (!enabled) return;

    let start_x = chart.width/2, start_y = chart.height/2;

    const projection = d3.geoMercator().center(center || [ -110, 40 ])
        // .geoAlbersUsa()
        // .geoConicEqualArea().parallels([ 30, 40 ]).rotate([ 100, 0 ])
        // .geoEquirectangular().center(center || [ -125, 55 ])
        .scale(scale || 500)
        .translate([ 100, 100 ]);

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

    const background = chart.container.append('rect');

    background
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('style', 'fill:#eeeeff; stroke:none');

    chart.svg.node().classList.add('map');
    addToMap((await world('land'))[0], 'land').classed('land', true);
    // addToMap((await world('roads'))[0], 'roads').classed('roads', true);

    const dragStart = d => {
        start_x = +d3.event.x;
        start_y = +d3.event.y;
    };

    const dragPan = d => {
      console.log('lon x lat', projection.invert([d3.event.x, d3.event.y]));
    };

    const dragHandler = d3.drag()
        .on('start', dragStart)
        .on('drag', dragPan);

    dragHandler(background);

    return world;
};
