import { Observable } from "rxjs/Observable";
import createEntityObjects from './create-entity-objects';
import geoDemo from "./get-geo-data";

const style = require('../styles/index.css');

export default function index () {
    // const entityContainer: Observable<Array<any>> = Observable.create(obs => createEntityObjects(obs));
    //
    // entityContainer.subscribe(entities => {
    //     entities.map(e => console.log(e));
    // });

    geoDemo(true);
}
