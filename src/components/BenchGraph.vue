<script setup lang="ts">
import { defineProps, ref } from "vue"
import { Line } from "vue-chartjs"
import "chartjs-adapter-date-fns"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  type ChartEvent,
  type ActiveElement,
  Chart,
ChartOptions,
TimeScale,
} from "chart.js"
import type { BenchDataPoint, BenchRun } from "../utils/data"
import BenchElemSelection from "./BenchElemSelection.vue"

export interface BenchData {
  score: number
  timestamp: Date
  benchRun: BenchRun
}

const props = defineProps<{
  // Name (label) of the benchmark
  label: string
  // Maps branches to their data
  benchData: Map<string, BenchData[]>
}>()

console.assert(props.benchData.size > 0, "No bench data provided")

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, TimeScale)

// Reactive values for the selected datapoint
const scoreSel = ref<number | null>(null)
const commitDateSel = ref<string | null>(null)
const commitMsgSel = ref<string | null>(null)
const scoreDiffSel = ref<number | null>(null)
const scoreDiffPercSel = ref<number | null>(null)

// Map over entries of the props.benchData
const datasets = Array.from(props.benchData.entries()).map(([branch, benchData]) => {
  const scores = benchData.map((bd) => bd.score)
  const timestamps = benchData.map((bd) => bd.timestamp)
  // Zip scores and timestamps into an array
  console.assert(scores.length === timestamps.length)
  let data = new Array()
  for (let i = 0; i < scores.length; i++) {
    console.assert(scores[i] !== undefined)
    console.assert(timestamps[i] !== undefined)
    data.push({ x: timestamps[i], y: scores[i] })
  }
  const ret = {
    label: branch,
    data: data,
    fill: false,
    pointRadius: 3
  }
  console.log(`Created dataset for branch ${branch} with data:`, ret)
  return ret
})

function onClick(event: ChartEvent, elements: ActiveElement[], chart: Chart) {
  if (elements.length === 0 || event.type !== "click") {
    return
  }
  const element = elements[0]
  const datasetIndex = element.datasetIndex
  const index = element.index
  const dataset = chart.data.datasets[datasetIndex]
  const data = dataset.data[index]
  const branch = dataset.label as string
  const score = data.y as number
  const timestamp = data.x as Date

  console.log(
    `Clicked on label(branch) ${branch} at ${timestamp} with score ${score}, index: ${index}`
  )
  // BenchData for the clicked element
  let benchData = props.benchData.get(branch)?.at(index) as BenchData
  console.assert(benchData !== undefined)
  let commitMsg = benchData.benchRun.displayTitle
  scoreSel.value = score
  commitDateSel.value = benchData.timestamp.toString()
  commitMsgSel.value = commitMsg
  if (index > 0) {
    // Look at the previous score
    let prevScore = props.benchData.get(branch)?.at(index - 1)?.score as number
    let scoreDiff = score - prevScore
    let scoreDiffPerc = (scoreDiff / prevScore) * 100
    scoreDiffSel.value = scoreDiff
    scoreDiffPercSel.value = scoreDiffPerc
  } else {
    scoreDiffSel.value = null
    scoreDiffPercSel.value = null
  }
}

const chartData = {
  datasets: datasets
}
const chartOpts: ChartOptions<"line"> = {
  onClick: onClick,
  scales: {
    x: {
      type: "time"
    }
  },
  elements: {
    point: {
      radius: 3
    }
  },
}

</script>

<template>
  <v-card :variant="'outlined'" class="bench-graph">
    <v-card-title class="bench-title">
      {{ props.label }}
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <Line :data="chartData" :options="chartOpts" />
          </v-col>
        </v-row>
        <v-row>
          <BenchElemSelection
            :score="scoreSel"
            :scoreDiff="scoreDiffSel"
            :scoreDiffPerc="scoreDiffPercSel"
            :commitDate="commitDateSel"
            :commitMessage="commitMsgSel"
          />
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>


<style scoped>
.bench-graph {
  margin-left: 5%;
  margin-right: 5%;
}

.bench-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>