import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const serverDataDir = join(rootDir, 'server', 'data')
const publicDataDir = join(rootDir, 'public', 'data')

// Ensure public/data directory exists
if (!existsSync(publicDataDir)) {
  mkdirSync(publicDataDir, { recursive: true })
}

// Read all data files
const readJSON = (file) => {
  try {
    return JSON.parse(readFileSync(join(serverDataDir, file), 'utf-8'))
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message)
    return file === 'rules.json' ? { content: '' } : []
  }
}

// Bundle all data into single file
const bundledData = {
  players: readJSON('players.json'),
  tournaments: readJSON('tournaments.json'),
  results: readJSON('results.json'),
  punishments: readJSON('punishments.json'),
  rules: readJSON('rules.json').content,
  history: readJSON('history.json'),
}

// Write bundled data
const outputPath = join(publicDataDir, 'data.json')
writeFileSync(outputPath, JSON.stringify(bundledData, null, 2))

console.log('✓ Data bundled successfully to public/data/data.json')
