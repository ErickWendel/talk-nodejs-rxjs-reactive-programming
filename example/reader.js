const Rx = require('rxjs');
const { readFile, watch, exists } = require('fs');
const { join } = require('path');
const { map, mergeMap, filter } = require('rxjs/operators');

const watchDir = directory => {
  console.log(`Wating for changes at ${directory}`);
  return Rx.Observable.create(observer => {
    watch(directory, (eventType, filename) => {
      console.log(`Event raised! type: ${eventType}`);
      return observer.next({
        eventType,
        filename: `${directory}/${filename.toString()}`,
      });
    });
  });
};

watchDir(join(__dirname, 'temp'))
  .pipe(mergeMap(e => Rx.bindNodeCallback(readFile)(e.filename)))
  .pipe(map(JSON.parse))
  .pipe(mergeMap(e => Rx.from(e)))

  .subscribe(
    result => {
      console.log(`
    ********
        Nome: ${result.name},
        Idade: ${result.age}
    `);
    },
    error => console.error('errouuuu', error.message),
  );
