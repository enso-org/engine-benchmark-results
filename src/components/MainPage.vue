<template>
  <v-container>
    <BenchFilters
      :minDate="minDate"
      :maxDate="maxDate"
      :since="startDate"
      :until="endDate"
      :branches="branches"
    />
    <BenchGraph :benchData="devBenchGraphProps" :label="label" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BenchDataPoint, Index } from '../utils/data'
import { processSingleFile } from '../utils/data'
import { type BenchData } from './BenchGraph.vue'
import BenchFilters from './BenchFilters.vue'
import BenchGraph from './BenchGraph.vue'
import { useDataPointStore } from '../stores/dataPointsStore'
import { useLabelStore } from '../stores/labelStore'
import { subDays } from 'date-fns'

const branches = ['develop', 'wip/akirathan/1234-some-issue']
const minDate = new Date('2022-12-01')
const maxDate = new Date()
const startDate = ref(subDays(maxDate, 30))
const endDate = ref(maxDate)
console.log('startDate', startDate.value)
console.log('endDate', endDate.value)

const labelStore = useLabelStore()
const datapointStore = useDataPointStore()

/**
 * Fetches the index file.
 */
async function loadIndex(): Promise<Index> {
  const indexResp = await fetch(`${FS_URL}/cache/index.json`)
  const indexContent = await indexResp.json()
  const index = Index.fromJson(indexContent)
  console.log('Index loaded')
  return index
}

/**
 * Load all the data for the given index and date range. The data is loaded from
 * files stored in server's cache directory.
 */
async function loadData(index: Index, startDate: Date, endDate: Date): Promise<void> {
  const fnames = index.getFilenamesFromDate(startDate, endDate)
  console.log('Fetching ', fnames.length, ' files')
  for (const fname of fnames) {
    const resp = await fetch(FS_URL + '/' + fname)
    const content = await resp.text()
    processSingleFile(content)
  }
}

function getFirstLabel(): string {
  const firstLabel = labelStore.getAllLabels().values().next().value
  return firstLabel
}

function getDatapointsForLabel(label: string): BenchDataPoint[] {
  const datapoints = datapointStore.findDataPointsByLabel(label, startDate.value, endDate.value)
  return datapoints
}

const index = await loadIndex()
await loadData(index, startDate.value, endDate.value)

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
