
/* IMPORT */

import * as fs from 'fs';
import {ID, IDs, Stats} from './types';

/* GET ID */

let isStatsReliable: boolean; // Under Windows we need stats objects using bigints https://github.com/nodejs/node/issues/12115

function getID ( ids: IDs, filePath: string, stats?: Stats ): ID {

  if ( filePath in ids ) return ids[filePath];

  if ( !stats && isStatsReliable !== false ) stats = fs.statSync ( filePath, { bigint: true } ); // Without BigInts ino numbers are unreliable https://github.com/nodejs/node/issues/12115 //TSC

  if ( stats && typeof isStatsReliable !== 'boolean' ) isStatsReliable = ( process.platform !== 'win32' ) || typeof stats.ino === 'bigint';

  if ( stats && stats.ino && isStatsReliable ) return ids[filePath] = String ( stats.ino );

  return ids[filePath] = undefined;

}

/* EXPORT */

export default getID;
