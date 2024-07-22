<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script setup lang="ts">
import { subDays } from 'date-fns'
import { useRouter } from 'vue-router'

const startDate = subDays(MAX_DATE, DEFAULT_DAYS_TO_FETCH)
const endDate = new Date(MAX_DATE)

const router = useRouter()
router.push({
  path: '/',
  query: {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  },
})
</script>

<style scoped></style>
