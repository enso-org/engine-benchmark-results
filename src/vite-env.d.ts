/// <reference types="vite/client" />

declare const FS_URL: string
/**
 * How many days of data to fetch by default
 */
declare const DEFAULT_DAYS_TO_FETCH: number
/**
 * Maximum number of labels to display - how many benchmark graphs will be shown
 */
declare const MAX_LABELS: number
/**
 * The minimum dat that the data can be fetched from. i.e. oldest data available.
 * It is the oldest entry in the cache/index.json. Date in ISO format.
 */
declare const MIN_DATE: string