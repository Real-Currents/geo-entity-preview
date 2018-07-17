import createEntityObjects from './modules/create-entity-objects';
import { Observable } from "rxjs/Observable";
import { geoDemo } from "./modules/get-geo-data";

const style = require('./styles/index.css');

const entityContainer: Observable<Array<any>> = Observable.create(obs => createEntityObjects(obs));

entityContainer.subscribe(entities => {
    entities.map(e => console.log(e));
});


