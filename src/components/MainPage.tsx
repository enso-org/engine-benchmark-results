import { useState, useEffect } from "react"
import { loadData, loadIndex, type Index } from "../data"



export default function MainPage() {
  const branches = ['develop']
  const minDate = new Date('2022-12-01')
  const maxDate = new Date('2024-06-01')
  let [index, setIndex] = useState<Index | null>(null)

  useEffect(() => {
    async function fetchIndex() {
      const idx = await loadIndex()
      setIndex(idx)
      console.log('Index loaded')
    }
    fetchIndex()
  })

  return (
    <div>

    </div>
  )
}

