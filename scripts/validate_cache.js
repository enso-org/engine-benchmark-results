import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { readdirSync, readFileSync } from 'fs'

const ajv = new Ajv()
addFormats(ajv)

const schemaPath = './schema/cache-v1.json'

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const validate = ajv.compile(schema)

// Iterate over all files in the cache directory
readdirSync('./cache').forEach((file) => {
  if (file.endsWith('index.json') || file.endsWith('schema.json')) {
    return
  }
  const data = JSON.parse(readFileSync(`./cache/${file}`, 'utf8'))
  const valid = validate(data)
  if (!valid) {
    console.error(`Schema validation failed for ${file}: ${ajv.errorsText(validate.errors)}`)
    process.exit(1)
  }
})

console.log('Schema validation passed for all cache files')
