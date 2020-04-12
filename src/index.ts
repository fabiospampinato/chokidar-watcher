
/* IMPORT */

import * as chokidar from 'chokidar';
import {FSWatcher, WatchOptions} from 'chokidar';
import {IDs, Event, Locks, Handler, Handlers, Stats} from './types';
import {RENAME_TIMEOUT} from './consts';
import getID from './get_id';
import getLock from './get_lock';

/* WATCHER */

//TODO: Write a test suite

function watcher ( paths: string, options: WatchOptions = {}, handlers: Handler | Handlers = {} ): FSWatcher {

  /* UNIVERSAL HANDLER */

  if ( typeof handlers === 'function' ) {

    return watcher ( paths, options, {
      add: handlers,
      change: handlers,
      rename: handlers,
      unlink: handlers
    });

  }

  /* VARIABLES */

  let ids: IDs = {},
      locksAdd: Locks = {},
      locksUnlink: Locks = {};

  /* HELPERS */

  function emit ( event: Event, args: any[] ) {

    const handler = handlers[event];

    if ( !handler ) return;

    handler.apply ( undefined, args );

  }

  /* HANDLERS */

  function change ( filePath: string, stats?: Stats ) {

    emit ( 'change', [filePath, stats] );

  }

  function add ( filePath: string, stats?: Stats ) {

    const isInitial = !( filePath in ids ),
          id = getID ( ids, filePath, stats );

    if ( options.ignoreInitial && isInitial ) return; // Ignoring initial, while still registering it

    getLock ( id, RENAME_TIMEOUT, {
      locks: {
        read: locksUnlink,
        write: locksAdd
      },
      handlers: {
        free: () => emit ( 'add', [filePath, stats] ),
        override: ( prevPath: string ) => {
          if ( prevPath === filePath ) {
            emit ( 'change', [filePath] );
          } else {
            emit ( 'rename', [prevPath, filePath] )
          }
        },
        overridden: () => filePath
      }
    });

  }

  function unlink ( filePath: string ) {

    const id = getID ( ids, filePath );

    getLock ( id, RENAME_TIMEOUT, {
      locks: {
        read: locksAdd,
        write: locksUnlink
      },
      handlers: {
        free: () => emit ( 'unlink', [filePath] ),
        override: ( newPath: string ) => {
          if ( filePath === newPath ) {
            emit ( 'change', [filePath] );
          } else {
            emit ( 'rename', [filePath, newPath] )
          }
        },
        overridden: () => filePath
      }
    });

  }

  /* CHOKIDAR */

  const chokidarOptions = Object.assign ( {}, options, { ignoreInitial: false } ),
        chokidarWatcher = chokidar.watch ( paths, chokidarOptions ).on ( 'add', add ).on ( 'change', change ).on ( 'unlink', unlink );

  /* CLEANUP */

  const _close = chokidarWatcher.close;

  chokidarWatcher.close = () => {

    ids = {};
    locksAdd = {};
    locksUnlink = {};

    return _close.call ( chokidarWatcher );

  };

  /* RETURN */

  return chokidarWatcher;

}

/* EXPORT */

export default watcher;
