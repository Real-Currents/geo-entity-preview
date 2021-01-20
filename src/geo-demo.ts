import * as d3 from 'd3';
import * as topojson from 'topojson';

export default async function geoDemo (chart, enabled, center?, scale?) {
    if (!enabled) return;

    let start_x = chart.width/2, start_y = chart.height/2;

    const projection = d3.geoMercator().center(center || [ -120, 45 ])
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

    let mouse_down = false,
        mouse_x = 0,
        mouse_y = 0;

    chart.svg.node().classList.add('map');
    addToMap((await world('land'))[0], 'land').classed('land', true);
    addToMap((await world('water'))[0], 'water').classed('water', true);
    // addToMap((await world('roads'))[0], 'roads').classed('roads', true);

    const dragStart = e => {
        const event = new MouseEvent('d3-mouse', d3.event.sourceEvent);
        start_x = event.clientX;
        start_y = event.clientY;
        mouseHit(event);
        mouse_down = true;
    };

    const dragPan = e => {
        console.log('lon x lat', projection.invert([d3.event.x, d3.event.y]));
        const event = new MouseEvent('d3-mouse', d3.event.sourceEvent);
        start_x = event.clientX;
        start_y = event.clientY;
        mouseHit(event);
    };

    const dragHandler = d3.drag()
        .on('start', dragStart)
        .on('drag', dragPan);

    // dragHandler(background);

    const zoomHandler = d3.zoom()
        .scaleExtent([1, 8])
        .on('start', dragStart)
        .on('zoom', e => {
            console.log('Zoom to transform', d3.event.transform);
            chart.container.attr('transform',
                `translate(${d3.event.transform.x}, ${d3.event.transform.y}) ` +
                `scale(${d3.event.transform.k})`
            );
        });

    chart.svg.append("rect")
        .attr("class", 'overlay')
        .attr('width', chart.width)
        .attr('height', chart.height)
        .call(zoomHandler);

    const mouseHit = function mouseHit(event: MouseEvent) {
        const delta_x = (event.clientX - mouse_x); // (mouse_down) ? (event.clientX - mouse_x) / canvas.width : 0.0;
        const delta_y = (event.clientY - mouse_y); // (mouse_down) ? (event.clientY - mouse_y) / canvas.height : 0.0;
        if (!mouse_down) {
            console.log('mouse coords start (', event.clientX, ',', event.clientY, ')');
        } else {
            console.log('mouse movement (', delta_x, ',', delta_y, ')');
        }
        mouse_x = event.clientX; // (event.clientX - cv_pos.left + document.scrollLeft()) * cv_w;
        mouse_y = event.clientY; // (event.clientY - cv_pos.top + document.scrollTop()) * cv_h;
        if (!!mouse_down) {

        }
    };

    const touchHit = function touchHit(event) {
        mouseHit(event.touches[0]);
    };

    return world;
};
