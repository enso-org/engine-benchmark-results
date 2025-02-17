<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number | null
  scoreDiff: number | null
  scoreDiffPerc: number | null
  commitDate: string | null
  commitMessage: string | null
  benchRunURL: string | null
}>()

const undefinedMsg = 'No selection'
const scoreMsg = computed(() => {
  if (props.score) {
    return props.score.toPrecision(5)
  } else {
    return undefinedMsg
  }
})
const commitDateMsg = computed(() => (props.commitDate ? props.commitDate : undefinedMsg))
const commitMessageMsg = computed(() => (props.commitMessage ? props.commitMessage : undefinedMsg))
const scoreDiffMsg = computed(() => {
  if (props.scoreDiff && props.scoreDiffPerc) {
    return props.scoreDiff.toPrecision(5) + ' (' + props.scoreDiffPerc.toPrecision(5) + '%)'
  } else {
    return 'NA'
  }
})
const benchRunURL = computed(() => (props.benchRunURL ? props.benchRunURL : undefinedMsg))
const isSomeElementSelected = computed(() => {
  return (
    props.score !== null &&
    props.scoreDiff !== null &&
    props.scoreDiffPerc !== null &&
    props.commitDate !== null &&
    props.commitMessage !== null &&
    props.benchRunURL !== null
  )
})
</script>

<template>
  <v-container class="bench-sel">
    <v-row>
      <v-col>Score: </v-col>
      <v-col>{{ scoreMsg }}</v-col>
    </v-row>
    <v-row>
      <v-col>Score diff:</v-col>
      <v-col>{{ scoreDiffMsg }}</v-col>
    </v-row>
    <v-row>
      <v-col>Commit date:</v-col>
      <v-col>{{ commitDateMsg }}</v-col>
    </v-row>
    <v-row>
      <v-col>Commit message:</v-col>
      <v-col>{{ commitMessageMsg }}</v-col>
    </v-row>
    <v-row>
      <v-col>Bench run URL</v-col>
      <v-col>
        <div v-if="isSomeElementSelected">
          <a :href="benchRunURL" target="_blank">{{ benchRunURL }}</a>
        </div>
        <div v-else>{{ undefinedMsg }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.bench-sel {
  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
  font-family: sans-serif;
  font-size: small;
  font-weight: lighter;
  text-align: left;
}
</style>
