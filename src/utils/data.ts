import { useBenchRunStore } from '../stores/benchRunStore'
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

export function processSingleFile(content: string): void {
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