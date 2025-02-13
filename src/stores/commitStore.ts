import { defineStore } from 'pinia'
import type { Commit } from '../utils/data'

export const useCommitStore = defineStore('commit', {
  state: () => ({
    commits: new Map<string, Commit>(),
  }),

  actions: {
    addCommit(commit: Commit) {
      this.commits.set(commit.id, commit)
    },

    findCommitByID(id: string): Commit | null {
      const res = this.commits.get(id)
      if (res === undefined) {
        return null
      } else {
        return res
      }
    },

    findCommitsBetween(since: Date, until: Date): Commit[] {
      return Array.from(this.commits.values()).filter((c) => {
        return c.timestamp >= since && c.timestamp <= until
      })
    },
  },
})

export type CommitStore = ReturnType<typeof useCommitStore>
