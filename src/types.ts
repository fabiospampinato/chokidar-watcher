
/* TYPES */

type ID = string | undefined;

type Event = 'add' | 'change' | 'rename' | 'unlink';

type Stats = {
  [filePath: string]: import ( 'fs' ).Stats
};

type Locks = {
  [id: string]: Function
};

type LockOptions = {
  locks: {
    read: Locks,
    write: Locks
  },
  handlers: {
    free: Function,
    override: Function,
    overridden: Function
  }
};

type Handlers = {
  add?: ( filePath: string, stats: import ( 'fs' ).Stats ) => void,
  change?: ( filePath: string, stats: import ( 'fs' ).Stats ) => void,
  rename?: ( prevFilePath: string, nextFilePath: string ) => void,
  unlink?: ( filePath: string ) => void
};

/* EXPORT */

export {ID, Event, Stats, Locks, LockOptions, Handlers};
