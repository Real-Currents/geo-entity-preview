import {tsvParse} from "d3-dsv";
import getEntityData from "./get-entity-data";
import {Observable} from "rxjs/Observable";

export default function createEntityObjects (entityObserver?) {
    const entities: Array<any> = [];

    const output = document
        .getElementsByTagName('body')[0]
        .appendChild(document.createElement('pre'));

    (async () => await getEntityData('AL071_with_header.tsv')
            .then(response => {
                tsvParse(response).map(d => {
                    const entity: {
                        id: string,
                        entityType: string,
                        geometry: any,
                        properties: any
                    } = {
                        'id': '',
                        'entityType': '',
                        'geometry': '',
                        'properties': {}
                    };

                    for (const p in d) {
                        switch (p) {
                            case 'id':
                                entity['id'] = d[p];
                                break;
                            case 'entitytype':
                                entity['entityType'] = d[p];
                                entity['entityType'] = '';
                                break;
                            case 'index_geometry':
                                try {
                                    entity['geometry'] = JSON.parse(d[p].toString());
                                } catch (e) {
                                    console.log(`GeoJSON parse error: ${e}`);
                                    entity['geometry'] = d[p];
                                }
                                break;
                            case 'a2_code':
                                entity['properties']['A2_CODE'] = d[p];
                                break;
                            case 'micode':
                                entity['properties']['MICODE'] = d[p];
                                break;
                            default:
                                const prop = p.toString()
                                    .replace(/^\w/, (chr) => chr.toUpperCase())
                                    .replace(/\_(\w)/, (chr, first) => ' ' + first.toUpperCase())
                                    .replace(/\_/, ' ');
                                entity['properties'][prop] = d[p];
                        }
                    }

                    output.innerHTML = output.innerHTML + `
${JSON.stringify(entity)},
`;
                    return entities.push(entity);
                });

                if (typeof entityObserver.next == "function") {
                    entityObserver.next(entities);
                }
            },
            error => {
                console.log(error);
            }
            )
    )();

}
