
/* IMPORT */

import LocksResolvers from './locks_resolvers';
import {ID, LockOptions} from './types';

/* GET LOCK */

function getLock ( id: ID, timeout: number, options: LockOptions ) {

  if ( !id ) return options.handlers.free (); // Free

  const release = options.locks.read[id];

  if ( release ) { // Override

    options.handlers.override ( release () );

  } else {

    const resolver = () => { // Free

      delete options.locks.write[id];

      options.handlers.free ();

    };

    LocksResolvers.add ( resolver, timeout );

    options.locks.write[id] = () => { // Overridden // Function for releasing the lock

      LocksResolvers.remove ( resolver );

      delete options.locks.write[id];

      return options.handlers.overridden ();

    };

  }

}

/* EXPORT */

export default getLock;
