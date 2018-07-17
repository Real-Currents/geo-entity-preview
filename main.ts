import createEntityObjects from './modules/create-entity-objects';
import {Observable} from "rxjs/Observable";

const style = require('./styles/index.css');

const entityContainer: Observable<Array<any>> = Observable.create(obs => createEntityObjects(obs));

entityContainer.subscribe(entities => {
    entities.map(e => console.log(e));
});
