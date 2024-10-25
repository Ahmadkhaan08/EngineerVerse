'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MessageCircle, Users, FileCode,  Briefcase,Handshake  } from 'lucide-react'
import LandingPage from '../components/LandingPage'
import Header from '../components/Header'
import { Link } from 'react-router-dom'

export default function App() {
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false)
    }, 5000) // Show landing page for 5 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {showLanding ? (
          <LandingPage key="landing" />
        ) : (
          <HomePage key="home" />
        )}
      </AnimatePresence>
    </div>
  )
}
<LandingPage/>



function HomePage() {
  const features = [
    { icon:  Briefcase , title: "Find Jobs", description: "Find your deam jobs and conquer the world." },
    { icon: Handshake, title: "Join Communities", description: "Become part of vibrant communities and collaborate with peers in your field." },
    { icon: Users, title: "Follow Engineers", description: "Build your professional network." },
    { icon: MessageCircle, title: "Direct Messaging", description: "Communicate privately with peers." },
    { icon: Search, title: "Search", description: "Find engineers and projects easily." },
    { icon: FileCode, title: "Project Collaboration", description: "Work together on exciting projects." },
  ]

  return (
    <motion.div
      className="min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-12">
        <Header/>
        <motion.h2
          className="text-4xl font-bold mb-4 mt-3"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Welcome to EngineerVerse
        </motion.h2>
        <motion.p
          className="text-xl text-gray-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          The social network built for engineers, by engineers.
        </motion.p>
      </header>
      <main>
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-800 p-6 rounded-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
              >
                <feature.icon className="w-8 h-8 text-indigo-500 mb-4" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <motion.section
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          
          <Link to='/sign-up'>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
            Join EngiNet Today
          </button></Link>
        </motion.section>
      </main>
    </motion.div>
  )
}