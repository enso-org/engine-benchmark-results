import { defineStore } from 'pinia'
import type { Commit } from '../data'

export const useCommitStore = defineStore('commit', {
  state: () => ({
    commits: [] as Commit[],
  }),

  actions: {
    addCommit(commit: Commit) {
      this.commits.push(commit)
    },
    findCommitByID(id: string): Commit | null {
      return this.commits.find((c) => c.id === id) ?? null
    },
    findCommitsBetween(since: Date, until: Date): Commit[] {
      return this.commits.filter((c) => c.timestamp >= since && c.timestamp <= until)
    },
  },
})
