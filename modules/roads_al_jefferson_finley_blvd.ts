import { Observable } from "rxjs/Observable";
import * as d3 from 'd3';
import createEntityObjects from './create-entity-objects';
import geoDemo from "./get-geo-data";
import createChart from "./chart-factory";

const style = require('../styles/index.css');

export default async function index() {
    const entityContainer: Observable<Array<any>> = Observable.create(obs =>
        createEntityObjects('roads_al_jefferson_finley_blvd.tsv', obs));

    (async () => {
        const d3GeoChart = await createChart({
            width: innerWidth,
            height: innerHeight,
            margin: {top: 0, right: 0, bottom: 0, left: 0}
        });

        console.log(d3GeoChart.container);

        const geoWorld = await geoDemo(
            d3GeoChart,
            true,
            [ -86.85, 33.54 ],
            1500000
        );

        entityContainer.subscribe(entities => {
            // entities.map(e => console.log(e));

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
        });
    })();
}
