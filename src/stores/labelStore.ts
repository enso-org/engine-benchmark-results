import { defineStore } from 'pinia'
import { classNameForLabel } from '../utils/data'

export const useLabelStore = defineStore('label', {
  state: () => ({
    labels: new Set<string>(),
    // Maps class names to their labels
    classToLables: new Map<string, Set<string>>(),
  }),

  actions: {
    addLabel(label: string) {
      const klazzName = classNameForLabel(label)
      const lbls = this.classToLables.get(klazzName)
      if (lbls !== undefined) {
        lbls.add(label)
      } else {
        this.classToLables.set(klazzName, new Set([label]))
      }
      this.labels.add(label)
    },

    getAllClassNames(): Set<string> {
      return new Set(this.classToLables.keys())
    },

    /**
     * Returns optionally empty set of labels for a class name.
     */
    getLabelsForClass(className: string): Set<string> {
      const labels = this.classToLables.get(className)
      if (labels !== undefined) {
        return labels
      } else {
        return new Set()
      }
    },

    getAllLabels(): Set<string> {
      return this.labels
    },

    /**
     * Returns set of all the labels inside Engine benchmarks.
     */
    getAllEngineLabels(): Set<string> {
      return new Set([...this.labels].filter(isEngineLabel))
    },

    getAllStdlibLabels(): Set<string> {
      return new Set([...this.labels].filter(isStdlibLabel))
    },

    containsLabel(label: string): boolean {
      return this.labels.has(label)
    },
  },
})

export type LabelStore = ReturnType<typeof useLabelStore>

function isEngineLabel(label: String): boolean {
  return !isStdlibLabel(label)
}

function isStdlibLabel(label: String): boolean {
  return label.startsWith('org.enso.benchmarks.generated')
}
