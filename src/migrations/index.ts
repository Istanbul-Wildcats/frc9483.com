import * as migration_20261121_212104_baseline from './20261121_212104_baseline';
import * as migration_20261122_151926_add_cad_image from './20261122_151926_add_cad_image';
import * as migration_20261122_201022_add_off_season from './20261122_201022_add_off_season';
import * as migration_20261122_155900_add_chief_delphi from './20261122_155900_add_chief_delphi';
import * as migration_20261122_161200_backfill_drift from './20261122_161200_backfill_drift';

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
  {
    up: migration_20261122_155900_add_chief_delphi.up,
    down: migration_20261122_155900_add_chief_delphi.down,
    name: '20261122_155900_add_chief_delphi'
  },
  {
    up: migration_20261122_161200_backfill_drift.up,
    down: migration_20261122_161200_backfill_drift.down,
    name: '20261122_161200_backfill_drift'
  },
];
