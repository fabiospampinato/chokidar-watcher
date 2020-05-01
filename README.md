# Chokidar Watcher

File system watcher based on [`chokidar`](https://github.com/paulmillr/chokidar) that emits add/change/rename/unlink events.

The main reason this library exists is to provide a "rename" event too, if you don't need that you might just want to use [`chokidar`](https://github.com/paulmillr/chokidar) directly.

## Install

```sh
npm install --save chokidar-watcher
```

## API

This library provides the following interface:

```ts
type Handler = ( filePath: string, nextFilePathOrStats?: import ( 'fs' ).Stats | string ) => void;

type Handlers = {
  add?: ( filePath: string, stats: fs.Stats ) => void,
  change?: ( filePath: string, stats: fs.Stats ) => void,
  rename?: ( prevFilePath: string, nextFilePath: string ) => void,
  unlink?: ( filePath: string ) => void
};

function watcher ( paths: ChokidarPaths, options: ChokidarOptions, handler: Handler ): ChokidarWatcher // Basically the same API as chokidar, plus the "handler" function which will handle all events
function watcher ( paths: ChokidarPaths, options: ChokidarOptions, handlers: Handlers ): ChokidarWatcher // Basically the same API as chokidar, plus the "handlers" object
```

## Usage

```ts
import watcher from 'chokidar-watcher';

const options = {
  usePolling: true,
  interval: 100
};

const handlers = {
  add ( filePath, stats ) { /* ... */ },
  change ( filePath, stats ) { /* ... */ },
  rename ( prevFilePath, nextFilePath ) { /* ... */ },
  unlink ( filePath ) { /* ... */ }
};

watcher ( '/Users/fabio/Desktop', options, handlers );
```

## License

MIT © Fabio Spampinato
