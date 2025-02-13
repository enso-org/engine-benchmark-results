<template>
  <v-container>
    <BenchmarksInfo :startDate="startDate" :endDate="endDate" />
    <BenchSearch
      :minDate="minDate"
      :maxDate="maxDate"
      :since="startDate"
      :until="endDate"
      :branches="branches"
      @updateBenchData="updateBenchData($event.since, $event.until, $event.branches, $event.labels)"
    />
    <v-divider thickness="3" />
    <BenchGraphs
      :labels="labelsToDisplay"
      :branches="branches"
      :startDate="startDate"
      :endDate="endDate"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loadData, loadIndex } from '../utils/data'
import BenchSearch from './BenchSearch.vue'
import { subDays } from 'date-fns'
import BenchGraphs from './BenchGraphs.vue'
import BenchmarksInfo from './BenchmarksInfo.vue'

const branches = ref(['develop'])
const minDate = new Date('2022-12-01')
const maxDate = new Date('2024-06-01')
const startDate = ref(subDays(maxDate, DEFAULT_DAYS_TO_FETCH))
const endDate = ref(maxDate)

// Load initial data
const index = await loadIndex()
await loadData(index, startDate.value, endDate.value)

const labelsToDisplay = ref<string[]>([])

function updateBenchData(since: Date, until: Date, newBranches: string[], labels: string[]) {
  console.log('Updating bench data')
  startDate.value = since
  endDate.value = until
  branches.value = newBranches
  labelsToDisplay.value = labels
}
</script>

<style scoped></style>
