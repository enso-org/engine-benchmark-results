<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLabelStore } from '../stores/labelStore'
import { classNameForLabel } from '../utils/data'
import { red } from 'vuetify/util/colors'
import { VDateInput } from 'vuetify/labs/VDateInput'

const emit = defineEmits<{
  updateBenchData: [
    {
      since: Date
      until: Date
      branches: string[]
      labels: string[]
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
const selectedLabels = ref<string[]>([])
const selectedClasses = ref<string[]>([])

watch(selectedLabels, (newSelectedLabels, oldSelectedLabels) => {
  console.log('selectedLabels changed')
  if (oldSelectedLabels.length > newSelectedLabels.length) {
    selectedClasses.value = classesFromLabels(newSelectedLabels)
  }
})

// Check if some class was removed and remove all labels from it
watch(selectedClasses, (newSelectedClasses, oldSelectedClasses) => {
  if (oldSelectedClasses.length > newSelectedClasses.length) {
    selectedLabels.value = selectedLabels.value.filter((label) => {
      for (const klazz of newSelectedClasses) {
        if (label.startsWith(klazz)) {
          return true
        }
      }
      return false
    })
  }
})

const labelStore = useLabelStore()
const allClasses = Array.from(labelStore.getAllClassNames())
const labelsToSuggest = computed(() => {
  if (selectedClasses.value.length === 0) {
    return []
  }
  const labels = new Array<string>()
  for (const klazzName of selectedClasses.value) {
    labels.push(...labelStore.getLabelsForClass(klazzName))
  }
  return labels
})

function updateBenchData() {
  console.debug('Updating bench data')
  console.debug('Since:', since.value)
  console.debug('Until:', until.value)
  console.debug('Selected branches:', selectedBranches.value)

  let labels = selectedLabels.value
  if (labels.length == 0) {
    labels = labelsToSuggest.value
  }

  emit('updateBenchData', {
    since: since.value,
    until: until.value,
    branches: selectedBranches.value,
    labels: labels,
  })
}

function classesFromLabels(labels: Array<string>): Array<string> {
  const classes = new Set<string>()
  for (const label of labels) {
    classes.add(classNameForLabel(label))
  }
  return Array.from(classes)
}

/**
 * Selects all classes and labels that are engine benchmarks.
 */
function selectAllEngineBenchmarks() {
  const engineLabels = Array.from(labelStore.getAllEngineLabels())
  const engineClasses = classesFromLabels(engineLabels)
  selectedLabels.value = engineLabels
  selectedClasses.value = engineClasses
}

function selectAllStandardLibrariesBenchmarks() {
  const stdlibLabels = Array.from(labelStore.getAllStdlibLabels())
  const stdlibClasses = classesFromLabels(stdlibLabels)
  selectedLabels.value = stdlibLabels
  selectedClasses.value = stdlibClasses
}

function clearSelection() {
  selectedLabels.value = []
  selectedClasses.value = []
  selectedBranches.value = ['develop']
}
</script>

<template>
  <v-container>
    <!-- Date pickers -->
    <v-row>
      <v-col>
        <v-card :variant="'outlined'" class="bench-filters">
        <!-- Classes -->
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="selectedClasses"
              label="Benchmark Classes"
              :items="allClasses"
              multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- Benchmarks (depends on which classes are selected) -->
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="selectedLabels"
              label="Individual Benchmarks"
              :items="labelsToSuggest"
              multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-card-title class="filters-title"> Filters </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-date-input
                    v-model="since"
                    label="Since"
                    title="Since"
                    :max="props.maxDate"
                    :min="props.minDate"
                    persistent-placeholder
                  ></v-date-input>
                </v-col>
                <v-col>
                  <v-date-input
                    v-model="until"
                    label="Until"
                    title="Until"
                    :max="props.maxDate"
                    :min="props.minDate"
                  ></v-date-input>
                </v-col>
                <!-- Branches -->
                <v-col>
                  <v-autocomplete
                    v-model="selectedBranches"
                    label="Branches"
                    :items="props.branches"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Buttons for selecting Engine and Stdlib benchmarks -->
    <v-row>
      <v-col>
        <v-btn :color="'secondary'" @click="selectAllEngineBenchmarks">
          Select all Engine benchmarks
        </v-btn>
      </v-col>
      <v-col>
        <v-btn :color="'secondary'" @click="selectAllStandardLibrariesBenchmarks">
          Select all Standard libraries benchmarks
        </v-btn>
      </v-col>

      <v-col>
        <v-btn :color="red.lighten3" @click="clearSelection"> Clear selection </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-tooltip text="Show all the selected benchmarks">
          <template #activator="{ props }">
            <v-btn
              size="x-large"
              :location="'center'"
              :color="'primary'"
              v-bind="props"
              @click="updateBenchData"
            >
              Show
            </v-btn>
          </template>
        </v-tooltip>
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
