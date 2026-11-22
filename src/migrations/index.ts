import * as migration_20261121_212104_baseline from './20261121_212104_baseline';
import * as migration_20261122_151926_add_cad_image from './20261122_151926_add_cad_image';
import * as migration_20261122_201022_add_off_season from './20261122_201022_add_off_season';
import * as migration_20261122_204500_add_offseason_ui_text from './20261122_204500_add_offseason_ui_text';
import * as migration_20261122_155900_add_chief_delphi from './20261122_155900_add_chief_delphi';
import * as migration_20261122_161200_backfill_drift from './20261122_161200_backfill_drift';
import * as migration_20261122_230000_panel_controls from './20261122_230000_panel_controls';

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
  {
    up: migration_20261122_201022_add_off_season.up,
    down: migration_20261122_201022_add_off_season.down,
    name: '20261122_201022_add_off_season'
  },
  {
    up: migration_20261122_204500_add_offseason_ui_text.up,
    down: migration_20261122_204500_add_offseason_ui_text.down,
    name: '20261122_204500_add_offseason_ui_text'
  },
  {
    up: migration_20261122_230000_panel_controls.up,
    down: migration_20261122_230000_panel_controls.down,
    name: '20261122_230000_panel_controls'
  },
];
