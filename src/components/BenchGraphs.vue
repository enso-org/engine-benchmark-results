<template>
  <v-container v-if="isEmpty"> No benchmarks to display </v-container>
  <v-container v-else>
    <v-row> Status: {{ loadedBenches.size }} loaded out of {{ labels.length }} </v-row>
    <v-row v-for="label in labels" :key="label" alignContent="center">
      <v-col>
        <BenchGraph
          v-if="loadedBenches.has(label)"
          :label="label"
          :startDate="startDate"
          :endDate="endDate"
          :benchData="allBenchData.get(label) ?? new Map()"
        />
        <div v-else>
          <LoadingSpinner />
          Loading benchmark {{ label }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BenchGraph from './BenchGraph.vue'
import { BenchData } from './BenchGraph.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { BenchDataPoint } from '../utils/data'
import { useDataPointStore } from '../stores/dataPointsStore'

const props = defineProps<{
  // Names (labels) of all the benchmarks that should be displayed
  labels: string[]
  branches: string[]
  // Start of the data - the minimum limit of the x axis
  startDate: Date
  // End of the data - the maximal limit of the x axis
  endDate: Date
}>()

const datapointStore = useDataPointStore()
const isEmpty = computed(() => props.labels.length === 0)
// label -> branch -> BenchData[]
const allBenchData = ref<Map<string, Map<string, BenchData[]>>>(new Map())
const loadedBenches = ref<Set<string>>(new Set())

watch(
  () => props.labels,
  (newLabels) => {
    allBenchData.value.clear()
    loadedBenches.value.clear()
    for (let label of newLabels) {
      const benchData = loadDataForBenchmark(label)
      allBenchData.value.set(label, benchData)
      loadedBenches.value.add(label)
    }
  },
)

watch(
  () => [props.startDate, props.endDate],
  ([newStartDate, newEndDate]) => {
    for (let label of props.labels) {
      const branchBenchData = allBenchData.value.get(label)!
      const newBranchBenchData = new Map<string, BenchData[]>()
      for (let branch of props.branches) {
        const benchData = branchBenchData.get(branch)!
        const filteredBenchData = filterByDate(benchData, newStartDate, newEndDate)
        newBranchBenchData.set(branch, filteredBenchData)
      }
      allBenchData.value.set(label, newBranchBenchData)
    }
  },
)

function loadDataForBenchmark(benchName: string): Map<string, BenchData[]> {
  const benchData = new Map<string, BenchData[]>()
  for (const branch of props.branches) {
    const dp = datapointStore.findDatapoints({
      startDate: props.startDate,
      endDate: props.endDate,
      branch: branch,
      label: benchName,
    })
    const dpProps = transformDatapointProps(dp)
    // Sort dpProps by date
    const dpPropsSorted = dpProps.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    benchData.set(branch, dpPropsSorted)
  }
  return benchData
}

function filterByDate(benchData: BenchData[], startDate: Date, endDate: Date): BenchData[] {
  return benchData.filter((bd) => bd.timestamp >= startDate && bd.timestamp <= endDate)
}

/**
 * Transform bench data into the format required by BenchGraph component
 */
function transformDatapointProps(datapoints: BenchDataPoint[]): BenchData[] {
  const ret: BenchData[] = []
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
