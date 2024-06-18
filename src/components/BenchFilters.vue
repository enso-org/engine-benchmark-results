<script setup lang="ts">
import { ref } from 'vue'

const today = new Date(Date.now())
// today - 14 days
let daysAgo = new Date()
daysAgo.setDate(today.getDate() - 14)

const since = ref(daysAgo)
const until = ref(today)

// emit events
const emit = defineEmits<{}>()

const props = defineProps<{
  minDate: Date
  maxDate: Date
  branches: string[]
}>()

const selectedBranches = ref<string[]>(['develop'])

function updateBenchData() {
  console.log('Updating bench data')
  console.log('Since:', since.value)
  console.log('Until:', until.value)
  console.log('Selected branches:', selectedBranches.value)
}
</script>

<template>
  <v-container>
    <!-- Date pickers -->
    <v-row>
      <v-col>
        <v-card :variant="'outlined'" class="bench-filters">
          <v-card-title class="filters-title"> Filters </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-date-picker
                    v-model="since"
                    label="Since"
                    title="Since"
                    :max="props.maxDate"
                    :min="props.minDate"
                  ></v-date-picker>
                </v-col>
                <v-col>
                  <v-date-picker
                    v-model="until"
                    label="Until"
                    title="Until"
                    :max="props.maxDate"
                    :min="props.minDate"
                  ></v-date-picker>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Branches -->
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="selectedBranches"
          label="Branches"
          :items="props.branches"
          multiple
        ></v-autocomplete>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn size="x-large" :location="'center'" :color="'primary'" @click="updateBenchData"
          >Filter</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.filters-title {
  font-size: 20px;
  font-weight: bold;
}
</style>
