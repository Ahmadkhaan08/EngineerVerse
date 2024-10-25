import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Filter, SortDesc, Bookmark, MapPin, DollarSign, Briefcase, Calendar, Users, TrendingUp } from 'lucide-react'

export default function JobsSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const jobListings = [
    { id: 1, title: "Senior Software Engineer", company: "TechCorp", location: "San Francisco, CA", salary: "$120k - $160k", skills: ["Python", "React", "AWS"], postedDate: "2 days ago", applicants: 45, trending: true },
    { id: 2, title: "Mechanical Design Engineer", company: "InnovateEng", location: "Boston, MA", salary: "$90k - $120k", skills: ["CAD", "SolidWorks", "3D Printing"], postedDate: "1 week ago", applicants: 32, trending: false },
    { id: 3, title: "Data Scientist", company: "DataDriven", location: "New York, NY", salary: "$100k - $140k", skills: ["Machine Learning", "Python", "SQL"], postedDate: "3 days ago", applicants: 58, trending: true },
    { id: 4, title: "Frontend Developer", company: "WebWizards", location: "Remote", salary: "$80k - $120k", skills: ["JavaScript", "React", "CSS"], postedDate: "1 day ago", applicants: 27, trending: true },
    { id: 5, title: "DevOps Engineer", company: "CloudMasters", location: "Seattle, WA", salary: "$110k - $150k", skills: ["Docker", "Kubernetes", "AWS"], postedDate: "5 days ago", applicants: 39, trending: false },
  ]

  const filteredJobs = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search jobs, companies, or skills..." 
            className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-full text-purple-600 border-purple-200">
          <Filter className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full text-purple-600 border-purple-200">
              <SortDesc className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Most Relevant</DropdownMenuItem>
            <DropdownMenuItem>Most Recent</DropdownMenuItem>
            <DropdownMenuItem>Salary: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <AnimatePresence>
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800">{job.title}</CardTitle>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.company}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {job.postedDate}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applicants} applicants
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {job.trending && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Trending in your area
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-purple-50">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200" onClick={() => setSelectedJob(job)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg">
            Post a Job
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post a New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Job Title" />
            <Input placeholder="Company Name" />
            <Input placeholder="Location" />
            <Input placeholder="Salary Range" />
            <Input placeholder="Required Skills (comma-separated)" />
            <textarea
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Job Description"
              rows={4}
            ></textarea>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Post Job</Button>
          </div>
        </DialogContent>
      </Dialog>
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700">{selectedJob.company}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedJob.location}</p>
              <p className="text-sm text-gray-600 mt-1">{selectedJob.salary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedJob.skills.map((skill) => (
                  <Badge key={skill} className="bg-purple-100 text-purple-800">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                Apply Now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
