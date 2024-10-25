import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-2 bg-black">
        <nav className="flex justify-between items-center shadow-md">
          <motion.h1
            className=" text-white ml-2 text-3xl font-bold flex flex-row items-center gap-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <BookOpen />
            EngineerVerse
          </motion.h1>

          {/* Container for Sign Up and Login buttons */}
          <div className="flex space-x-2 mr-2"> {/* Flex container with spacing */}
            <Link to='/sign-up'>
              <motion.button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Sign Up
              </motion.button>
            </Link>
            <Link to='/login'>
              <motion.button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Login
              </motion.button>
            </Link>
          </div>
        </nav>
      </div>
    </motion.div>
  )
}
