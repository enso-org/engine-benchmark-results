<template>
  <v-container>
    <BenchFilters
      :minDate="minDate"
      :maxDate="maxDate"
      :since="startDate"
      :until="endDate"
      :branches="branches"
    />
    <div v-for="label in benchDatas.keys()" :key="label">
      <BenchGraph :label="label" :benchData="benchDatas.get(label) ?? new Map()" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
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
const startDate = ref(subDays(maxDate, DEFAULT_DAYS_TO_FETCH))
const endDate = ref(maxDate)

const labelStore = useLabelStore()
const datapointStore = useDataPointStore()
const benchRunStore = useBenchRunStore()

// Load initial data
const index = await loadIndex()
await loadData(startDate.value, endDate.value)

// label -> branch -> BenchData[]
const benchDatas: Ref<Map<string, Map<string, BenchData[]>>> = ref(new Map())
for (const label of labelStore.getAllLabels()) {
  const labelBenchDatas = new Map()
  for (const branch of branches.value) {
    const dp = datapointStore.findDatapoints({
      startDate: startDate.value,
      endDate: endDate.value,
      branch: branch,
      label: label,
    })
    const benchData = transformDatapointProps(dp)
    labelBenchDatas.set(branch, benchData)
  }
  benchDatas.value.set(label, labelBenchDatas)
}

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
  const fetchAndLoadPromises: Array<Promise<void>> = new Array()
  for (const fname of fnames) {
    if (!isFileLoaded(fname)) {
      fetchAndLoadPromises.push(
        fetchAndProcessFile(fname)
      )
    }
  }
  await Promise.all(fetchAndLoadPromises)
}

async function fetchAndProcessFile(filename: string): Promise<void> {
  console.log('Fetching file: ', filename)
  const resp = await fetch(FS_URL + '/' + filename)
  const content = await resp.text()
  processSingleFile(content)
  console.log('Processed file: ', filename)
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
</script>

<style scoped></style>
