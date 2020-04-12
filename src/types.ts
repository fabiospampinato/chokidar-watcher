
/* TYPES */

type ID = string | undefined;

type IDs = Record<string, ID>;

type Event = 'add' | 'change' | 'rename' | 'unlink';

type Locks = Record<string, Function>;

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

type Handler = ( filePath: string, nextFilePathOrStats?: string | Stats ) => void;

type Handlers = {
  add?: ( filePath: string, stats: Stats ) => void,
  change?: ( filePath: string, stats: Stats ) => void,
  rename?: ( prevFilePath: string, nextFilePath: string ) => void,
  unlink?: ( filePath: string ) => void
};

type Stats = import ( 'fs' ).Stats | import ( 'fs' ).BigIntStats;

/* EXPORT */

export {ID, IDs, Event, Locks, LockOptions, Handler, Handlers, Stats};
