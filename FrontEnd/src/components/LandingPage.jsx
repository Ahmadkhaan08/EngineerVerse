import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen } from 'lucide-react'
export default function LandingPage() {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BookOpen className='h-12 w-12'/>
        <motion.h1
          className="text-6xl font-bold mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
        >
          EngineerVerse
        </motion.h1>
        <motion.p
          className="text-xl mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1, type: "spring" }}
        >
          Connect. Collaborate. Create.
        </motion.p>
        <motion.div
          className="absolute inset-0 z-[-1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${Math.random() * 100}% ${
                  Math.random() * 100
                }%, rgba(99, 102, 241, 0.15), transparent 80%)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + i * 0.2, duration: 2, type: "spring" }}
            />
          ))}
        </motion.div>
      </motion.div>
    )
  }