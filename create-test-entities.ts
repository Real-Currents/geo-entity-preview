import {csvParse, tsvParse} from 'd3-dsv';

export default function creatTestEntities (fromCSV: string, parseFn?) {

    const getData = async () => {
        console.log('Fetching data');
        const promise = (await fetch(`./data/${fromCSV}`)).text();

        return {
            responseText: await promise
        };
    };

    (async function() {
        let someData;

        console.log(typeof parseFn);

        if (typeof parseFn == 'function') {
            someData = tsvParse((await getData()).responseText);
        } else {
            someData = tsvParse((await getData()).responseText, parseFn);
        }

        console.log(someData);

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

    })();
}