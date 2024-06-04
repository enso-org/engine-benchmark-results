<template>
  <v-container>
    User: Pavel <br>
    <BenchFilters :min-date="minDate" :max-date="maxDate" :branches="branches" />
  </v-container>
</template>

<script setup lang="ts">
import { Index } from '../utils/data';
import { processSingleFile } from '../utils/data';
import BenchFilters from './BenchFilters.vue';

const branches = ["develop", "wip/akirathan/1234-some-issue"];
const minDate = new Date("2022-12-01");
const maxDate = new Date();

const indexResp = await fetch("http://localhost:5500/cache/index.json");
const indexContent = await indexResp.json();
const index = Index.fromJson(indexContent);
console.log("Index loaded");
const startDate = new Date("2022-12-13T14:36:56Z");
const endDate = new Date("2023-01-28T04:37:40Z");
const fnames = index.getFilenamesFromDate(startDate, endDate);
console.log("Fetching ", fnames.length, " files");

for (const fname of fnames) {
  const resp = await fetch("http://localhost:5500/" + fname);
  const content = await resp.text();
  processSingleFile(content);
}
</script>

<style scoped>
</style>
