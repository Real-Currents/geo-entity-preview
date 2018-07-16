import { tsvParse } from 'd3-dsv';

export default async function createTestEntities (fromCSV: string, parseFn?) {

    let promise: Promise<any>;

    const getData = async () => {
        console.log('Fetching data');
        const promise = (await fetch(`./data/${fromCSV}`)).text();

        return {
            responseText: await promise
        };
    };


    // const dataPromise = (async function() {
        console.log('Fetching data');

        promise = (await fetch(`./data/${fromCSV}`)).text();

        return promise;
    // })();
    //
    // dataPromise.then(
    //     response => {
    //         console.log('Async Work Complete: ');
    //
    //         const someData = tsvParse(response);
    //
    //         console.log(typeof parseFn);
    //
    //         if (typeof parseFn == 'function') {
    //             someData.map(parseFn);
    //         }
    //     },
    //     error => {
    //         console.log(error);
    //     }
    // );
    //
    // return dataPromise;

    // const regions = someData.reduce((last: [ any ], row) => {
    //     const region = row.Region;
    //     if (!last[ region ]) {
    //         last[ region ] = [];
    //     }
    //     last[ region ].push(row);
    //     return last;
    // }, {});
    //
    // console.log(regions);
    //
    // const regionsPctTurnout = Object.entries(regions)
    //     .map(([ region, areas ]) => {
    //             return {
    //                 Region: region,
    //                 'First Region Code': areas[0]['Region_Code'],
    //                 'Mean % Turnout': d3.mean(areas as ArrayLike<any>, d => d[ 'Pct_Turnout' ])
    //             };
    //         }
    //     );
    //
    // console.log(regionsPctTurnout);
}