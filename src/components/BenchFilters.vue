<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  updateBenchData: [
    {
      since: Date
      until: Date
      branches: string[]
    },
  ]
}>()

/**
 * minDate: The minimum date that can be selected.
 * maxDate: The maximum date that can be selected.
 * since: The currently selected start date.
 * until: The currently selected end date.
 * branches: The list of all branches that can be selected.
 */
const props = defineProps<{
  minDate: Date
  maxDate: Date
  since: Date
  until: Date
  branches: string[]
}>()

const selectedBranches = ref<string[]>(['develop'])
const since = ref(props.since)
const until = ref(props.until)

function updateBenchData() {
  console.log('Updating bench data')
  console.log('Since:', since.value)
  console.log('Until:', until.value)
  console.log('Selected branches:', selectedBranches.value)
  emit('updateBenchData', {
    since: since.value,
    until: until.value,
    branches: selectedBranches.value,
  })
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
