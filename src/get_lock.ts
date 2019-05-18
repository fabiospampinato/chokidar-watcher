
/* IMPORT */

import {ID, LockOptions} from './types';

/* GET LOCK */

function getLock ( id: ID, timeout: number, options: LockOptions ) {

  if ( !id ) return options.handlers.free (); // Free

  const release = options.locks.read[id];

  if ( release ) { // Override

    options.handlers.override ( release () );

  } else {

    const timeoutId = setTimeout ( () => { // Free

      delete options.locks.write[id];

      options.handlers.free ();

    }, timeout );

    options.locks.write[id] = () => { // Overridden // Function for releasing the lock

      clearTimeout ( timeoutId );

      delete options.locks.write[id];

      return options.handlers.overridden ();

    };

  }

}

/* EXPORT */

export default getLock;
