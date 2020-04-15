import { Observable } from 'rxjs';
import * as d3 from 'd3';
import geoDemo from './geo-demo';
import createChart from './chart-factory';
import { createEntitiesFromTSV } from './create-entity-objects';

const style = require('../styles/index.css');

export default async function index() {
    const d3GeoChart = await createChart({
        width: innerWidth,
        height: innerHeight,
        margin: {top: 0, right: 0, bottom: 0, left: 0}
    });

    const entityContainer: Observable<Array<any>> = Observable.create(obs => {
        if (window.location.search.match('entityType') == null) {
            return obs.next([]);
        }

        const locationQuery = new URLSearchParams(window.location.search);
        const entityType: String = locationQuery.get('entityType');

        createEntitiesFromTSV(`${entityType}.tsv`, obs);
    });

    entityContainer.subscribe(entities => {
        // entities.map(e => console.log(e));

        if (entities.length > 0 && !!entities[0]['geometry']) {

            (async () => {

                // console.log(d3GeoChart.container);

                const geoWorld = await geoDemo(
                    d3GeoChart,
                    true,
                    [-151, 61.5],
                    15000
                );

                const entitiesContainer = d3GeoChart.container.append('g')
                    .attr('class', 'entities');

                for (const entity of entities) {
                    // console.log(entity['geometry']);

                    const path = entitiesContainer.append("path") // .selectAll("path")
                        .datum({
                            "type": "FeatureCollection",
                            "features": [((entity['geometry'] !== undefined) ?
                                    {
                                        "type": "Feature",
                                        "geometry": entity['geometry'],
                                        "properties": entity['properties']
                                    }
                                    : {
                                        "type": "Feature",
                                        "properties": entity['properties']
                                    }
                            )]
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
    });
}
