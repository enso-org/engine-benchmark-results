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

const indexResp = await fetch(`${FS_URL}/cache/index.json`);
const indexContent = await indexResp.json();
const index = Index.fromJson(indexContent);
console.log("Index loaded");
const startDate = new Date("2024-05-01");
const endDate = new Date("2024-05-30");
const fnames = index.getFilenamesFromDate(startDate, endDate);
console.log("Fetching ", fnames.length, " files");

for (const fname of fnames) {
  const resp = await fetch(FS_URL + "/" + fname);
  const content = await resp.text();
  processSingleFile(content);
}
</script>

<style scoped>
</style>
