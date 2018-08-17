const Rx = require('rxjs');
const { readFile, watch, exists } = require('fs');
const { join } = require('path');
const {
  map,
  mergeMap,
  filter,
  catchError,
  empty,
  retry,
} = require('rxjs/operators');

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
  .pipe(
    mergeMap(e => Rx.bindNodeCallback(readFile)(e.filename)),
    retry(error => Rx.of('[]')),
  )

  .pipe(
    map(JSON.parse),
    retry(error => Rx.of([])),
  )
  .pipe(mergeMap(e => Rx.from(e)))

  .subscribe(
    result => {
      console.log(`
    ********
        Nome: ${result.name},
        Idade: ${result.age}
    `);
    },
    error => console.error(`errror`, error),
    end => console.log('ACABAOU', end),
  );
