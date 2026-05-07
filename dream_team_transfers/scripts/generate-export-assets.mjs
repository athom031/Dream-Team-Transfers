import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'assets', 'generated');

const OUTPUTS = {
  players: {
    csv: 'players.csv',
    id: 'player_id',
    url: 'player_portrait_small_pic',
    directory: 'players',
    size: 160,
  },
  nations: {
    csv: 'nations.csv',
    id: 'nation_id',
    url: 'nation_flag_small_pic',
    directory: 'nations',
    size: 64,
  },
  teams: {
    csv: 'teams.csv',
    id: 'team_id',
    url: 'team_crest_small_pic',
    directory: 'teams',
    size: 128,
  },
};

function parseArgs() {
  const args = {
    force: false,
    only: new Set(Object.keys(OUTPUTS)),
    ids: new Map(),
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg === '--force') {
      args.force = true;
      return;
    }

    if (arg.startsWith('--only=')) {
      args.only = new Set(
        arg
          .replace('--only=', '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      );
      return;
    }

    const idMatch = arg.match(/^--(players|nations|teams)=(.+)$/);
    if (idMatch) {
      args.ids.set(
        idMatch[1],
        new Set(
          idMatch[2]
            .split(',')
            .map((value) => Number(value.trim()))
            .filter((value) => Number.isFinite(value))
        )
      );
    }
  });

  return args;
}

function parseCSV(csvText) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      row.push(field);
      field = '';
      if (row.some((value) => value.trim())) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    field += char;
  }

  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value.trim())) {
      rows.push(row);
    }
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [
        header.trim(),
        values[index]?.trim() || '',
      ])
    )
  );
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      accept:
        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'user-agent': 'Dream-Team-Transfers asset generator',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function generateAsset(record, config, args) {
  const id = Number(record[config.id]);
  const url = record[config.url];

  if (!Number.isFinite(id) || !url) {
    return { status: 'skipped' };
  }

  const allowedIds = args.ids.get(config.directory);
  if (allowedIds && !allowedIds.has(id)) {
    return { status: 'skipped' };
  }

  const outputPath = path.join(
    OUTPUT_DIR,
    config.directory,
    `${String(id)}.webp`
  );

  if (!args.force && (await pathExists(outputPath))) {
    return { status: 'cached' };
  }

  const source = await downloadImage(url);
  await sharp(source)
    .resize(config.size, config.size, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(outputPath);

  return { status: 'generated' };
}

async function generateGroup(groupName, config, args) {
  await fs.mkdir(path.join(OUTPUT_DIR, config.directory), { recursive: true });

  const csvText = await fs.readFile(path.join(PUBLIC_DIR, config.csv), 'utf8');
  const records = parseCSV(csvText);
  const totals = {
    generated: 0,
    cached: 0,
    skipped: 0,
    failed: 0,
  };

  for (const record of records) {
    try {
      const result = await generateAsset(record, config, args);
      totals[result.status] += 1;
    } catch (error) {
      totals.failed += 1;
      console.warn(
        `Failed ${groupName} ${record[config.id]} from ${record[config.url]}: ${error.message}`
      );
    }
  }

  console.log(
    `${groupName}: ${totals.generated} generated, ${totals.cached} cached, ${totals.skipped} skipped, ${totals.failed} failed`
  );
}

async function main() {
  const args = parseArgs();

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const [groupName, config] of Object.entries(OUTPUTS)) {
    if (!args.only.has(groupName)) continue;
    await generateGroup(groupName, config, args);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
