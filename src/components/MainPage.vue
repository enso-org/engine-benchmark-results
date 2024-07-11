<template>
  <v-container>
    <BenchSearch
      :minDate="minDate"
      :maxDate="maxDate"
      :since="startDate"
      :until="endDate"
      :branches="branches"
      @update-bench-data="updateBenchData($event.since, $event.until, $event.branches, $event.labels)"
    />
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
import { useLabelStore } from '../stores/labelStore'
import { subDays } from 'date-fns'
import BenchGraphs from './BenchGraphs.vue'

const branches = ref(['develop'])
const minDate = new Date('2022-12-01')
const maxDate = new Date('2024-06-01')
const startDate = ref(subDays(maxDate, DEFAULT_DAYS_TO_FETCH))
const endDate = ref(maxDate)

const labelStore = useLabelStore()

// Load initial data
const index = await loadIndex()
await loadData(index, startDate.value, endDate.value)

const labelsToDisplay = ref<string[]>([])
const allLabels = Array.from(labelStore.getAllLabels())

async function updateBenchData(since: Date, until: Date, newBranches: string[], labels: string[]) {
  console.log('Updating bench data')
  startDate.value = since
  endDate.value = until
  branches.value = newBranches
  labelsToDisplay.value = labels
}

</script>

<style scoped></style>
