<template>
  <v-container>
    User: Pavel <br />
    <BenchFilters :minDate="minDate" :maxDate="maxDate" :branches="branches" />
    <BenchGraph :benchData="devBenchGraphProps" :label="label" />
  </v-container>
</template>

<script setup lang="ts">
import { BenchDataPoint, Index } from '../utils/data'
import { processSingleFile } from '../utils/data'
import { type BenchData } from './BenchGraph.vue'
import BenchFilters from './BenchFilters.vue'
import BenchGraph from './BenchGraph.vue'
import { useCommitStore } from '../stores/commitStore'
import { useBenchRunStore } from '../stores/benchRunStore'
import { useDataPointStore } from '../stores/dataPointsStore'

const branches = ['develop', 'wip/akirathan/1234-some-issue']
const minDate = new Date('2022-12-01')
const maxDate = new Date()

const indexResp = await fetch(`${FS_URL}/cache/index.json`)
const indexContent = await indexResp.json()
const index = Index.fromJson(indexContent)
console.log('Index loaded')
const startDate = new Date('2024-05-01')
const endDate = new Date('2024-05-30')
const fnames = index.getFilenamesFromDate(startDate, endDate)
console.log('Fetching ', fnames.length, ' files')

for (const fname of fnames) {
  const resp = await fetch(FS_URL + '/' + fname)
  const content = await resp.text()
  processSingleFile(content)
}

function getFirstLabel(): string {
  const commitStore = useCommitStore()
  const benchRunStore = useBenchRunStore()
  const datapointStore = useDataPointStore()
  const commits = commitStore.findCommitsBetween(startDate, endDate)
  const commitIds = commits.map((c) => c.id)
  const benchRuns = benchRunStore.findBenchRunsOnCommits(commitIds)
  console.assert(benchRuns.length > 0, 'No bench runs found')
  const datapoints = datapointStore.findDataPointsOnBenchRun(benchRuns[0].id)
  console.assert(datapoints.length > 0)
  return datapoints[0].label
}

function getDatapointsForLabel(label: string): BenchDataPoint[] {
  const commitStore = useCommitStore()
  const benchRunStore = useBenchRunStore()
  const datapointStore = useDataPointStore()
  const commits = commitStore.findCommitsBetween(startDate, endDate)
  const commitIds = commits.map((c) => c.id)
  const benchRuns = benchRunStore.findBenchRunsOnCommits(commitIds)
  const datapoints = new Array<BenchDataPoint>()
  for (const benchRun of benchRuns) {
    const dps = datapointStore.findDataPointsOnBenchRun(benchRun.id)
    for (const dp of dps) {
      if (dp.label === label) {
        datapoints.push(dp)
      }
    }
  }
  return datapoints
}

// Default data for the develop branch
const devBenchData: BenchData[] = new Array()
const label = getFirstLabel()
console.log('First label', label)
const devBenchDatapoints = getDatapointsForLabel(label)
for (const dp of devBenchDatapoints) {
  const benchData = {
    score: dp.score,
    timestamp: dp.benchRun.headCommit.timestamp,
    benchRun: dp.benchRun,
  }
  devBenchData.push(benchData)
}
const devBenchGraphProps: Map<string, BenchData[]> = new Map()
console.log('devBenchData', devBenchData)
devBenchGraphProps.set('develop', devBenchData)
</script>

<style scoped></style>
