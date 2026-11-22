import * as migration_20261121_212104_baseline from './20261121_212104_baseline';
import * as migration_20261122_151926_add_cad_image from './20261122_151926_add_cad_image';

export const migrations = [
  {
    up: migration_20261121_212104_baseline.up,
    down: migration_20261121_212104_baseline.down,
    name: '20261121_212104_baseline',
  },
  {
    up: migration_20261122_151926_add_cad_image.up,
    down: migration_20261122_151926_add_cad_image.down,
    name: '20261122_151926_add_cad_image'
  },
];
