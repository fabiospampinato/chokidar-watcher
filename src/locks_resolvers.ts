
/* LOCKS RESOLVERS */

// Registering a single interval scales much better than registering N timeouts
// Timeouts are respected within the interval margin
// We only use a constant timeout currently, so the functions set is assumed to be ordered

const LocksResolvers = {

  /* VARIABLES */

  interval: 100,
  intervalId: undefined as NodeJS.Timeout | undefined,
  fns: new Map<Function, number> (),

  /* LIFECYCLE */

  init: (): void => {

    if ( LocksResolvers.intervalId ) return;

    LocksResolvers.intervalId = setInterval ( LocksResolvers.resolve, LocksResolvers.interval );

  },

  reset: (): void => {

    if ( !LocksResolvers.intervalId ) return;

    clearInterval ( LocksResolvers.intervalId );

    delete LocksResolvers.intervalId;

  },

  /* API */

  add: ( fn: Function, timeout: number ): void => {

    LocksResolvers.fns.set ( fn, Date.now () + timeout );

    LocksResolvers.init ();

  },

  remove: ( fn: Function ): void => {

    LocksResolvers.fns.delete ( fn );

  },

  resolve: (): void => {

    if ( !LocksResolvers.fns.size ) return LocksResolvers.reset ();

    const now = Date.now ();

    for ( const [fn, threshold] of LocksResolvers.fns ) {

      if ( threshold >= now ) return; // We should still wait for the rest

      LocksResolvers.remove ( fn );

      fn ();

    }

  }

};

/* EXPORT */

export default LocksResolvers;
