import * as migration_20261121_212104_baseline from './20261121_212104_baseline';

export const migrations = [
  {
    up: migration_20261121_212104_baseline.up,
    down: migration_20261121_212104_baseline.down,
    name: '20261121_212104_baseline'
  },
];
