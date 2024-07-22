<template>
  <v-container>
    <BenchmarksInfo :startDate="startDate" :endDate="endDate" />
    <BenchSearch
      :minDate="minDate"
      :maxDate="maxDate"
      :since="startDate"
      :until="endDate"
      :branches="branches"
      @update-bench-data="
        updateBenchData($event.since, $event.until, $event.branches, $event.labels)
      "
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
import { useRoute } from 'vue-router'
import { loadData, loadIndex } from '../utils/data'
import BenchSearch from './BenchSearch.vue'
import BenchGraphs from './BenchGraphs.vue'
import BenchmarksInfo from './BenchmarksInfo.vue'

const branches = ref(['develop'])
const minDate = MIN_DATE
const maxDate = MAX_DATE

const route = useRoute()
const startDate = ref(new Date(route.query.startDate as string))
const endDate = ref(new Date(route.query.endDate as string))

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
