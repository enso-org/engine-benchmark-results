import { defineStore } from 'pinia'

export const useLabelStore = defineStore('label', {
  state: () => ({
    labels: new Set<string>(),
  }),

  actions: {
    addLabel(label: string) {
      this.labels.add(label)
    },

    getAllLabels(): Set<string> {
      return this.labels
    },
  },
})
