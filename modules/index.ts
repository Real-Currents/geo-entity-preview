import * as d3 from 'd3';
import geoDemo from './get-geo-data';
import createChart from './chart-factory';
import loadSVG from "./load-svg";

require('../styles/index.css');

const model = loadSVG('models/canvas.svg');

export default async function index() {
    (async () => {
        const d3GeoChart = await createChart({
            width: innerWidth,
            height: innerHeight,
            margin: {top: 0, right: 0, bottom: 0, left: 0}
        }, d3.select(model));

        model.setAttribute('style', 'width: 512px; height: 256px;');
        window.document.body.appendChild(model);

        console.log(d3GeoChart.container);

        await geoDemo(
            d3GeoChart,
            true
        );

        // const d3GeoChart = createChart({
        //     width: innerWidth,
        //     height: innerHeight,
        //     margin: {top: 0, right: 0, bottom: 0, left: 0}
        // });

        // const entityContainer: Observable<Array<any>> = Observable.create(obs => {
        //     if (window.location.search.match('counties') == null ||
        //         window.location.search.match('entities') == null) {
        //         return obs.next([]);
        //     }
        //
        //     const locationQuery = new URLSearchParams(window.location.search);
        //     const countyFips: String[] = locationQuery.get('counties').split(',');
        //     const entityType: String[] = locationQuery.get('entities').split(',');
        //
        //     if (countyFips.length > 0 && entityType.length > 0) {
        //         createEntitiesFromJSON(`${entityType[0]}/${countyFips[0]}.json`, obs);
        //     }
        // });
        //
        // entityContainer.subscribe(entities => {
        // entities.map(e => console.log(e));
        const entities = [];

        if (entities.length > 0 && !!entities[0]['geometry']) {

            (async () => {
                // console.log(d3GeoChart.container);

                const geoWorld = await geoDemo(
                    d3GeoChart,
                    true,
                    [ -74, 42 ],
                    15000
                );

                const entitiesContainer = d3GeoChart.container.append('g')
                    .attr('class', 'entities');

                for (const entity of entities) {
                    // console.log(entity['geometry']);

                    const path = entitiesContainer.append("path") // .selectAll("path")
                        .datum({
                            "type": "FeatureCollection",
                            "features": [
                                {
                                    "type": "Feature",
                                    "properties": entity['properties'],
                                    "geometry": entity['geometry'] // {
                                    //     "type":"LineString","coordinates":[[-86.835275,33.536856],[-86.83553,33.536751]]
                                    // }
                                }
                            ]
                        })
                        .attr('class', entity['entityType'])
                        .attr('d', d3.geoPath().projection(geoWorld['projection']))
                        .attr('stroke', 'blue')
                        .attr('stroke-width', '4px')
                        .on("click", (d, i) => {
                            console.log(entity)
                        });

                    // console.log(path);
                }
            })();
        }

        // });
    })();
}
