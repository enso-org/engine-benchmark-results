<template>
  <v-container v-if="isEmpty">
    No benchmarks to display
  </v-container>
  <v-container v-else>
    Status: {{ howManyLoaded }} loaded out of {{ benchesToDisplay }}
    <div v-for="label in labels" :key="label">
      <div v-if="isBenchmarkLoaded(label)">
        <BenchGraph
          :label="label"
          :startDate="startDate"
          :endDate="endDate"
          :benchData="getDataForBenchmark(label)"
        />
      </div>
      <div v-else>
        <LoadingSpinner />
        Loading benchmark {{ label }}
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Ref, ref, computed } from 'vue'
import BenchGraph from './BenchGraph.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{
  // Names (labels) of all the benchmarks that should be displayed
  labels: string[]
  branches: string[]
  // Start of the data - the minimum limit of the x axis
  startDate: Date
  // End of the data - the maximal limit of the x axis
  endDate: Date
}>()

function isBenchmarkLoaded(benchName: string): boolean {
  return loadedBenches.value.get(benchName) || false
}

function getDataForBenchmark(benchName: string): BenchData {
  console.assert(isBenchmarkLoaded(benchName))
  throw new Error('Not implemented')
}

const benchesToDisplay = ref(props.labels.length)
const howManyLoaded = ref(0)

// Maps labels (bench names) to their loading state
const loadedBenches: Ref<Map<string, boolean>> = ref(new Map())
for (let label of props.labels) {
  loadedBenches.value.set(label, false)
}

const isEmpty = computed(() => (props.labels.length === 0))


</script>
