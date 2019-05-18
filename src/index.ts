
/* IMPORT */

import * as chokidar from 'chokidar';
import {FSWatcher, WatchOptions} from 'chokidar';
import * as fs from 'fs';
import {Event, Locks, Handlers} from './types';
import {RENAME_TIMEOUT} from './consts';
import getID from './get_id';
import getLock from './get_lock';

/* WATCHER */

//TODO: Write a test suite

function watcher ( paths: string, options: WatchOptions = {}, handlers: Handlers = {} ): FSWatcher {

  /* VARIABLES */

  const locksAdd: Locks = {},
        locksUnlink: Locks = {};

  /* HELPERS */

  function emit ( event: Event, args: any[] ) {

    const handler = handlers[event];

    if ( !handler ) return;

    handler.apply ( undefined, args );

  }

  /* HANDLERS */

  function change ( filePath: string, stats?: fs.Stats ) {

    emit ( 'change', [filePath, stats] );

  }

  function add ( filePath: string, stats?: fs.Stats ) {

    const id = getID ( filePath, stats );

    getLock ( id, RENAME_TIMEOUT, {
      locks: {
        read: locksUnlink,
        write: locksAdd
      },
      handlers: {
        free: () => emit ( 'add', [filePath, stats] ),
        override: ( prevPath: string ) => emit ( 'rename', [prevPath, filePath] ),
        overridden: () => filePath
      }
    });

  }

  function unlink ( filePath: string ) {

    const id = getID ( filePath );

    getLock ( id, RENAME_TIMEOUT, {
      locks: {
        read: locksAdd,
        write: locksUnlink
      },
      handlers: {
        free: () => emit ( 'unlink', [filePath] ),
        override: ( newPath: string ) => emit ( 'rename', [filePath, newPath] ),
        overridden: () => filePath
      }
    });

  }

  /* CHOKIDAR */

  const chokidarOptions = Object.assign ( {}, options, { ignoreInitial: false } );

  return chokidar.watch ( paths, chokidarOptions ).on ( 'add', add ).on ( 'change', change ).on ( 'unlink', unlink );

}

/* EXPORT */

export default watcher;
