
/* IMPORT */

import * as fs from 'fs';
import {ID, Stats} from './types';

/* GET ID */

const statsCache: Stats = {}; //TODO: These values shouldn't be kept forever, or this could eventually become a memory leak

function getID ( filePath: string, stats?: fs.Stats ): ID {

  // stats = stats || statsCache[filePath]; //TODO: We can't use chokidar-provided stats objects yet, as they don't use BigInts https://github.com/paulmillr/chokidar/issues/844
  stats = statsCache[filePath];

  if ( !stats ) {

    try {

      stats = ( fs.statSync as any )( filePath, { bigint: true } ) as fs.Stats; // Without BigInts ino numbers are unreliable https://github.com/nodejs/node/issues/12115 //TSC

    } catch {

      return;

    }

  }

  statsCache[filePath] = stats;

  if ( !stats.ino ) return;

  return `${stats.ino}`;

}

/* EXPORT */

export default getID;
