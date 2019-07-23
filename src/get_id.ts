
/* IMPORT */

import * as fs from 'fs';
import {ID, Stats} from './types';

/* GET ID */

let isStatsReliable: boolean; // Under Windows we need stats objects using bigints https://github.com/nodejs/node/issues/12115

const statsCache: Stats = {}; //TODO: These values shouldn't be kept forever, or this could eventually become a memory leak

function getID ( filePath: string, stats?: fs.Stats ): ID {

  if ( stats ) {

    if ( typeof isStatsReliable !== 'boolean' ) isStatsReliable = ( process.platform !== 'win32' ) || typeof stats.ino === 'bigint';

    stats = isStatsReliable ? stats : statsCache[filePath];

  } else {

    stats = statsCache[filePath];

  }

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
