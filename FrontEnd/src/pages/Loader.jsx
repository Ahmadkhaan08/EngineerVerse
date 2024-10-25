"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { useState, useEffect } from "react"

export default function TypewriterBookLoader() {
  const [text, setText] = useState("")
  const fullText = "Loading..."

  useEffect(() => {
    const interval = setInterval(() => {
      setText((current) =>
        current.length === fullText.length
          ? ""
          : fullText.slice(0, current.length + 1)
      )
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center justify-center w-96 h-64 bg-gray-400">
      <motion.div
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <BookOpen className="w-16 h-16 text-black-500 mb-4" aria-hidden="true" />
      </motion.div>
      <div className="h-6 font-mono text-lg">
        {text}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          |
        </motion.span>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}