export default async function getEntityData (fromCSV: string, parseFn?) {

    let promise: Promise<any>;

    console.log('Fetching data');

    promise = (await fetch(`./data/${fromCSV}`)).text();

    return promise;
}