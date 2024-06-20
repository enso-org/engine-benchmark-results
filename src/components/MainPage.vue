<template>
  <v-container>
    <BenchFilters
      :minDate="minDate"
      :maxDate="maxDate"
      :since="startDate"
      :until="endDate"
      :branches="branches"
      @update-bench-data="updateBenchData($event.since, $event.until, $event.branches)"
    />
    <LoadingSpinner v-if="isLoading" />
    <div v-for="label in benchDatas.keys()" v-if="!isLoading" :key="label">
      <BenchGraph
        :label="label"
        :benchData="benchDatas.get(label) ?? new Map()"
        :startDate="startDate"
        :endDate="endDate"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { BenchDataPoint, Index } from '../utils/data'
import { processSingleFile } from '../utils/data'
import { type BenchData } from './BenchGraph.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import BenchFilters from './BenchFilters.vue'
import BenchGraph from './BenchGraph.vue'
import { useDataPointStore } from '../stores/dataPointsStore'
import { useLabelStore } from '../stores/labelStore'
import { subDays } from 'date-fns'
import { useBenchRunStore } from '../stores/benchRunStore'

const branches = ref(['develop'])
const minDate = new Date('2022-12-01')
const maxDate = new Date()
const startDate = ref(subDays(maxDate, DEFAULT_DAYS_TO_FETCH))
const endDate = ref(maxDate)
// TODO: Progress?
const isLoading = ref(true)

const labelStore = useLabelStore()
const datapointStore = useDataPointStore()
const benchRunStore = useBenchRunStore()

// Load initial data
const index = await loadIndex()
await loadData(startDate.value, endDate.value)

// label -> branch -> BenchData[]
const benchDatas: Ref<Map<string, Map<string, BenchData[]>>> = ref(new Map())
let labelCnt = 0
for (const label of labelStore.getAllLabels()) {
  if (labelCnt >= MAX_LABELS) {
    console.log('Maximum number of labels reached')
    break
  }
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
  labelCnt++
}

isLoading.value = false

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
async function loadData(startDate: Date, endDate: Date): Promise<void> {
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

async function fetchAndProcessFile(filename: string): Promise<void> {
  console.log('Fetching file: ', filename)
  const resp = await fetch(FS_URL + '/' + filename)
  const content = await resp.text()
  processSingleFile(content)
  console.log('Processed file: ', filename)
}

function isFileLoaded(filename: string): boolean {
  // file names correspond to bench run Ids.
  const benchRunId = filename.substring('cache/'.length, filename.length - '.json'.length)
  const benchRun = benchRunStore.findBenchRunById(benchRunId)
  return benchRun !== null
}

/**
 * This function is called when BenchFilters emits the update-bench-data event.
 */
async function updateBenchData(newStartDate: Date, newEndDate: Date, branches: string[]) {
  console.log('MainPage: updateBenchData: ', newStartDate, newEndDate, branches)
  isLoading.value = true
  startDate.value = newStartDate
  endDate.value = newEndDate
  await loadData(newStartDate, newEndDate)
  for (const branch of branches) {
    for (const label of benchDatas.value.keys()) {
      const dp = datapointStore.findDatapoints({
        startDate: newStartDate,
        endDate: newEndDate,
        branch: branch,
        label: label,
      })
      const dpProps = transformDatapointProps(dp)
      console.assert(benchDatas.value.has(label))
      benchDatas.value.get(label)?.set(branch, dpProps)
    }
  }
  isLoading.value = false
}

/**
 * Transform bench data into the format required by BenchGraph component..
 */
function transformDatapointProps(datapoints: BenchDataPoint[]): BenchData[] {
  const ret: BenchData[] = new Array()
  for (const dp of datapoints) {
    const benchData = {
      score: dp.score,
      timestamp: dp.benchRun.headCommit.timestamp,
      benchRun: dp.benchRun,
    }
    ret.push(benchData)
  }
  return ret
}
</script>

<style scoped></style>
