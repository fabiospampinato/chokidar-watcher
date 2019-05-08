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
type Handlers = {
  add?: ( filePath: string, stats: fs.Stats ) => void,
  change?: ( filePath: string, stats: fs.Stats ) => void,
  rename?: ( prevFilePath: string, nextFilePath: string ) => void,
  unlink?: ( filePath: string ) => void
};

function watcher ( paths: ChokidarPaths, options: ChokidarOptions, handlers: Handlers ): ChokidarWatcher // Basically the same API as chokidar, plus the "handlers" object
```

- ℹ️ The only unsupported chokidar option is `ignoreInitial`, you can't set it to `false` because this library needs it for detecting renames.

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
