import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Users, TrendingUp, MessageSquare, Calendar, Globe, Lock } from 'lucide-react'

export default function CommunitiesSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState(null)

  const communities = [
    { id: 1, name: "AI Enthusiasts", members: 5000, description: "Discuss the latest in artificial intelligence and machine learning", tags: ["AI", "Machine Learning"], trending: true, posts: 120, events: 5, isPublic: true },
    { id: 2, name: "Robotics Revolution", members: 3500, description: "Exploring advancements in robotics and automation", tags: ["Robotics", "Automation"], trending: false, posts: 85, events: 3, isPublic: true },
    { id: 3, name: "Sustainable Engineering", members: 2800, description: "Innovations in green technology and sustainable engineering practices", tags: ["Sustainability", "Green Tech"], trending: true, posts: 95, events: 4, isPublic: false },
    { id: 4, name: "Quantum Computing Pioneers", members: 1200, description: "Exploring the frontiers of quantum computing and its applications", tags: ["Quantum", "Computing"], trending: true, posts: 60, events: 2, isPublic: true },
    { id: 5, name: "Cybersecurity Experts", members: 4200, description: "Discussing the latest trends and techniques in cybersecurity", tags: ["Cybersecurity", "InfoSec"], trending: false, posts: 110, events: 6, isPublic: false },
  ]

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search communities..." 
            className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Community Name" />
              <Input placeholder="Description" />
              <Input placeholder="Tags (comma-separated)" />
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </Button>
                <Button variant="outline" className="flex-1">
                  <Lock className="h-4 w-4 mr-2" />
                  Private
                </Button>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Create Community</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <AnimatePresence>
          {filteredCommunities.map((community) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarImage src={`/placeholder-community-${community.id}.jpg`} />
                        <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800">{community.name}</CardTitle>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          {community.members.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="bg-white hover:bg-purple-100 text-purple-600 border-purple-200"
                      onClick={() => setSelectedCommunity(community)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-3">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {community.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {community.posts} posts
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {community.events} upcoming events
                    </span>
                    <span className="flex items-center">
                      {community.isPublic ? <Globe className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                      {community.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  {community.trending && (
                    <div className="flex items-center text-green-600 text-sm font-medium mt-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Trending in your network
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      {selectedCommunity && (
        <Dialog open={!!selectedCommunity} onOpenChange={() => setSelectedCommunity(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedCommunity.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mt-1">{selectedCommunity.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {selectedCommunity.members.toLocaleString()} members
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {selectedCommunity.posts} posts
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedCommunity.events} events
                </span>
              </div>
              <div className="mt-4">
                <h5 className="font-semibold text-gray-700">Tags:</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCommunity.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">Join Community</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}