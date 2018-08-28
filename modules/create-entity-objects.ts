import {tsvParse} from "d3-dsv";
import getEntityData from "./get-entity-data";

let dataFile: String;
let debugOutput: HTMLElement;

const entities: Array<any> = [];

function mapEntities (data) {
    const entity: {
        id: string,
        entityType: string,
        geometry: any,
        properties: any
    } = {
        'id': '',
        'entityType': dataFile.toString().replace(/\.(?:json|tsv)/, ''),
        'geometry': '',
        'properties': {}
    };

    // console.log(d);

    for (const p in data) {

        switch (p) {
            case 'ID':
                entity['id'] = data[p];
                break;
            case 'id':
                entity['id'] = data[p];
                break;
            case 'feat_id': // 'id':
                entity['id'] = data[p];
                break;
            case 'entityType':
                entity['entityType'] = data[p];
                // entity['entityType'] = '';
                break;
            case 'featureType':
                entity['featureType'] = data[p];
                break;
            case 'geometry': // 'index_geometry':
                try {
                    entity['geometry'] = JSON.parse(data[p].toString());
                } catch (e) {
                    console.log(`GeoJSON parse error: ${e}`);
                    console.log(`${data['ID']}: `, data[p]);
                    entity['geometry'] = data[p];
                }
                break;
            default:
                const prop = p.toString()
                    .replace(/^\w/, (chr) => chr.toUpperCase())
                    .replace(/\_(\w)/, (chr, first) => ' ' + first.toUpperCase())
                    .replace(/\_/, ' ');
                entity['properties'][prop] = data[p];
        }
    }

    debugOutput.innerHTML = debugOutput.innerHTML + ((debugOutput.innerHTML.slice(-1)[0].match(/\[/) === null) ? `,
    ` : `
    `) +
        JSON.stringify(entity);
    return entities.push(entity);
}

export function createEntitiesFromJSON (jsonFile, entityObserver?) {

    dataFile = jsonFile;

    const output = debugOutput = document
        .getElementsByTagName('body')[0]
        .appendChild(document.createElement('pre'));

    (async () => await (await fetch(`./data/${jsonFile}`)).json()
            .then(response => {
                output.innerHTML = `[`;

                console.log(response);

                if  (typeof response.map === 'function') {
                    response.map(mapEntities);
                } else {
                    for (const d in response) if (response[d]) {
                        mapEntities(d);
                    }
                }

                output.innerHTML = output.innerHTML + `
]`;

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

export function createEntitiesFromTSV (tsvFile, entityObserver?) {
    const entities: Array<any> = [];

    const output = document
        .getElementsByTagName('body')[0]
        .appendChild(document.createElement('pre'));

    (async () => await getEntityData(tsvFile)
            .then(response => {
                    output.innerHTML = output.innerHTML + `[`;

                    tsvParse(response).map(d => {
                        const entity: {
                            id: string,
                            // entityType: string,
                            geometry: any,
                            properties: any
                        } = {
                            'id': '',
                            // 'entityType': tsvFile.toString().replace(/\.tsv/, ''),
                            'geometry': '',
                            'properties': {}
                        };

                        // console.log(d);

                        for (const p in d) {

                            switch (p) {
                                case 'ID':
                                    entity['id'] = d[p];
                                    break;
                                case 'id':
                                    entity['id'] = d[p];
                                    break;
                                case 'feat_id': // 'id':
                                    entity['id'] = d[p];
                                    break;
                                case 'entitytype':
                                    entity['entityType'] = d[p];
                                    break;
                                case 'geometry': // 'index_geometry':
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

                        output.innerHTML = output.innerHTML + ((output.innerHTML.slice(-1)[0].match(/\[/) === null) ? `,
    ` : `
    `) +
                            JSON.stringify(entity);
                        return entities.push(entity);
                    });

                    output.innerHTML = output.innerHTML + `
]`;

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
