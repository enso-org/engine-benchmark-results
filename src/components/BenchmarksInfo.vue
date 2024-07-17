<script setup lang="ts">
/**
 * This file contains information about all the benchmarks from the cache.
 * It just displays some text about the database.
 */
import { useDataPointStore } from '../stores/dataPointsStore'
import { useLabelStore } from '../stores/labelStore'
import { useBenchRunStore } from '../stores/benchRunStore'
import { useCommitStore } from '../stores/commitStore'

const props = defineProps<{
  startDate: Date
  endDate: Date
}>()

const datapointStore = useDataPointStore()
const labelStore = useLabelStore()
const benchRunStore = useBenchRunStore()
const commitStore = useCommitStore()
const allLabels = Array.from(labelStore.getAllLabels())

/*const computeStatsPromises: Array<Promise<Statistics>> = new Array()
for (const label of allLabels) {
  computeStatsPromises.push(fetchStats(label))
}
const stats = await Promise.all(computeStatsPromises)*/
const benchStats: Map<string, Statistics> = new Map()
// for i in range(0, len(allLabels)):
for (let i = 0; i < allLabels.length; i++) {
  const label = allLabels[i]
  benchStats.set(label, await fetchStats(label))
}

interface Statistics {
  mean: number
  stdDev: number
}

async function fetchStats(label: string): Promise<Statistics> {
  const dps = datapointStore.findDatapoints({
    startDate: props.startDate,
    endDate: props.endDate,
    label: label,
    branch: 'develop',
  })
  const scores = dps.map((dp) => dp.score)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const stdDev = Math.sqrt(
    scores.map((score) => Math.pow(score - mean, 2)).reduce((a, b) => a + b, 0) / scores.length,
  )
  return {
    mean: mean,
    stdDev: stdDev,
  }
}

function getStats(label: string): Statistics {
  return benchStats.get(label) ?? { mean: -1, stdDev: -1 }
}
</script>

<template>
  <v-container>
    <h2>Statistics of benchmarks</h2>
    <h3>Gathered for data from {{ startDate }} to {{ endDate }}</h3>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Benchmark name (label)</th>
          <th class="text-left">Mean</th>
          <th class="text-left">Standard deviation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="label in allLabels" :key="label">
          <td>{{ label }}</td>
          <td>{{ getStats(label).mean }}</td>
          <td>{{ getStats(label).stdDev }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
