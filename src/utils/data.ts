import { useBenchRunStore } from '../stores/benchRunStore'
import { useCacheFileStore } from '../stores/cacheFileStore'
import { useCommitStore } from '../stores/commitStore'
import { useDataPointStore } from '../stores/dataPointsStore'
import { useLabelStore } from '../stores/labelStore'

export interface Commit {
  id: string
  message: string
  author: string
  url: string
  timestamp: Date
}

export interface BenchRun {
  id: string
  htmlUrl: string
  runAttempt: number
  event: string
  displayTitle: string
  headCommit: Commit
  branch: string
}

export interface BenchDataPoint {
  label: string
  score: number
  benchRun: BenchRun
}

export function dataPointHash(dp: BenchDataPoint): string {
  return `${dp.label}-${dp.score}-${dp.benchRun.id}`
}

async function processSingleFile(content: string): Promise<void> {
  const commitStore = useCommitStore()
  const benchRunStore = useBenchRunStore()
  const dataPointStore = useDataPointStore()
  const labelStore = useLabelStore()

  const jsObj = JSON.parse(content)
  const benchRun = jsObj['bench_run']
  const benchRunId = benchRun['id']
  const htmlUrl = benchRun['html_url']
  const runAttempt = benchRun['run_attempt']
  const event = benchRun['event']
  const displayTitle = benchRun['display_title']
  const headCommit = benchRun['head_commit']
  const commitId = headCommit['id']
  const commitMsg = headCommit['message']
  const commitAuthor = headCommit['author']['name']
  const commitTimestamp = new Date(headCommit['timestamp'])
  const commitUrl = headCommit['url']
  const commit: Commit = {
    id: commitId,
    message: commitMsg,
    author: commitAuthor,
    url: commitUrl,
    timestamp: commitTimestamp,
  }
  if (commitStore.findCommitByID(commitId) === null) {
    commitStore.addCommit(commit)
  }
  const benchRunModel: BenchRun = {
    id: benchRunId,
    htmlUrl: htmlUrl,
    runAttempt: runAttempt,
    event: event,
    displayTitle: displayTitle,
    headCommit: commit,
    branch: 'develop',
  }
  if (benchRunStore.findBenchRunById(benchRunId) === null) {
    benchRunStore.addBenchRun(benchRunModel)
  }
  const scoreDict = jsObj['label_score_dict']
  for (const [label, score] of Object.entries(scoreDict)) {
    if (!labelStore.containsLabel(label)) {
      labelStore.addLabel(label)
    }
    const scoreNum = Number.parseFloat(score as string)
    const dataPoint: BenchDataPoint = {
      label: label,
      score: scoreNum,
      benchRun: benchRunModel,
    }
    if (!dataPointStore.containsDatapoint(dataPoint)) {
      dataPointStore.addDataPoint(dataPoint)
    }
  }
}

/**
 * Fetches the index file.
 */
export async function loadIndex(): Promise<Index> {
  const indexResp = await fetch(`${FS_URL}/cache/index.json`)
  const indexContent = await indexResp.json()
  const index = Index.fromJson(indexContent)
  console.log('Index loaded')
  return index
}

/**
 * Loads all the data in the given date range.
 * @param index
 * @param startDate
 * @param endDate
 */
export async function loadData(index: Index, startDate: Date, endDate: Date): Promise<void> {
  const fnames = index.getFilenamesFromDate(startDate, endDate)
  console.log('Fetching ', fnames.length, ' files')
  const fetchAndLoadPromises: Array<Promise<void>> = new Array()
  for (const fname of fnames) {
    if (!isFileLoaded(fname)) {
      fetchAndLoadPromises.push(fetchAndProcessFile(fname))
    }
  }
  await Promise.all(fetchAndLoadPromises)
}

function isFileLoaded(filename: string): boolean {
  const cacheFileStore = useCacheFileStore()
  return cacheFileStore.wasFileProcessed(filename)
}

async function fetchAndProcessFile(filename: string): Promise<void> {
  console.log('Processing file ', filename)
  const cacheFileStore = useCacheFileStore()
  if (cacheFileStore.wasFileProcessed(filename)) {
    console.log('File already processed ', filename)
    return
  }
  console.log('Fetching file: ', filename)
  const resp = await fetch(FS_URL + '/' + filename)
  const content = await resp.text()
  await processSingleFile(content)
  cacheFileStore.markFileAsProcessed(filename)
  console.log('Processed file: ', filename)
}

export class Index {
  private content: Map<string, Date> = new Map<string, Date>()

  public static fromFileContent(content: string): Index {
    const map: Map<string, Date> = new Map<string, Date>()
    const jsObj = JSON.parse(content)
    for (const [filename, date] of Object.entries(jsObj)) {
      map.set(filename, new Date(date as string))
    }
    return new Index(map)
  }

  public static fromJson(json: Map<string, string>): Index {
    const map: Map<string, Date> = new Map<string, Date>()
    for (const [filename, dateStr] of Object.entries(json)) {
      map.set(filename, new Date(dateStr))
    }
    return new Index(map)
  }

  constructor(map: Map<string, Date>) {
    this.content = map
  }

  public getFilenamesFromDate(startDate: Date, endDate: Date): string[] {
    const filenames: string[] = []
    for (const [filename, date] of this.content.entries()) {
      if (date >= startDate && date <= endDate) {
        filenames.push(filename)
      }
    }
    return filenames
  }
}

// Distill class names from labels
export function classNameForLabel(label: string): string {
  const items = label.split('.')
  const n = items.length
  console.assert(n >= 2, 'Incorrect label format: ' + label)
  const classFullName = items.slice(0, n - 1).join('.')
  return classFullName
}
