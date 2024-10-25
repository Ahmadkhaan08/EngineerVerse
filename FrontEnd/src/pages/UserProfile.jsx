import React, {useState, useEffect} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Linkedin, ExternalLink, Mail, FileText, UserPlus, Users } from "lucide-react"
import Loader from './Loader'
import { useUserContext } from '@/userContext'
import { useParams } from 'react-router-dom'

export default function Component() {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const { userId } = useParams(); // Get the userId from the URL
    const [posts, setPosts] = useState([]);
    
    
    

  const Data = {
    name: "Jane Doe",
    username: "@janedoe",
    location: "San Francisco, CA",
    title: "Software Engineer",
    profilePicture: "/placeholder.svg",
    resume: "/jane-doe-resume.pdf",
    skills: [
      { name: "Python", proficiency: 90 },
      { name: "JavaScript", proficiency: 85 },
      { name: "React", proficiency: 80 },
      { name: "Node.js", proficiency: 75 },
      { name: "AWS", proficiency: 70 },
      { name: "Docker", proficiency: 65 },
    ],
    projects: [
      { title: "AI Chatbot", description: "Developed an AI-powered chatbot using NLP techniques", link: "https://github.com/janedoe/ai-chatbot" },
      { title: "IoT Home Automation", description: "Created a smart home system with Arduino and Raspberry Pi", link: "https://github.com/janedoe/iot-home" },
    ],
    experience: [
      { title: "Senior Software Engineer", company: "Tech Corp", year: "2020 - Present" },
      { title: "Software Engineer", company: "Startup Inc", year: "2018 - 2020" },
      { title: "B.S. Computer Science", company: "University of Technology", year: "2014 - 2018" },
    ],
    email: "jane.doe@example.com",
    portfolioLinks: {
      github: "https://github.com/janedoe",
      linkedin: "https://linkedin.com/in/janedoe",
      website: "https://janedoe.com",
    },
    posts: [
      { id: 1, type: 'image', content: '/placeholder.svg', description: 'Working on a new AI project!', likes: 42, comments: 2 },
      { id: 2, type: 'video', content: '/placeholder-video.mp4', description: 'Quick demo of my latest IoT setup', likes: 38, comments: 1 },
    ],
    followers: 1234,
    following: 567,
    connections: 890,
  }
  
  const fetchCurrentUser = async () => {
    try {
      // Make a GET request to the backend route to fetch the current user
      
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/v1/users/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is okay (status 200-299)
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
  
      // Parse the JSON response
      const user = await response.json();
      console.log("User : ", user) 
      setUserData(user);
      console.log("User Data : ", userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current user:', error);
      setLoading(false)
      throw error; // Rethrow error so it can be handled elsewhere if needed
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [userId]); 

  const fetchPosts = async() => {
    try{
        console.log("atFetchPosts")
      const token = localStorage.getItem('accessToken') // assuming token is store
      const response = await fetch(`http://localhost:8000/api/v1/post/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include JWT token for authentication
          'Content-Type': 'application/json'  // Optional, but helps ensure the correct content type
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Posts created by user:', response)
        setPosts(data)
      } else {
        console.error('Failed to fetch posts for the user:', response.status)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } 
  }

  if(loading)
    return <Loader/>
  return (
    <div className="container mx-auto p-4 space-y-8 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={userData.avatar} alt={userData.fullName} />
              <AvatarFallback>{userData?.fullName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-grow items-center space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold">{userData.fullName}</h1>
              <p className="text-xl text-muted-foreground">{userData.title}</p>
              <p className="text-sm text-muted-foreground">{userData.location}</p>
              <p className="text-sm text-muted-foreground">{userData.username}</p>
            </div>
            <div className="md:ml-auto space-y-2">
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Follow
              </Button>
              <div className="flex space-x-4 mt-2">
                <div className="text-center">
                  <p className="font-bold">{userData?.followers?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{userData?.following?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{0}</p>
                  <p className="text-sm text-muted-foreground">Connections</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Resume View Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => window.open(userData.resume, '_blank')}>
                <FileText className="mr-2 h-4 w-4" />
                {!userData.resume ? "No Resume Yet" : "View Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Data.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Portfolio Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <a href={Data.portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="h-5 w-5" />
                <a href={Data.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <a href={Data.portfolioLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                
              </div>
            </CardContent>
          </Card>

                  </div>

        {/* Right Column  */}
        <div className="md:col-span-2 space-y-8">
          {/* Tabs for Projects, Experience, and Posts */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="posts" onClick={() => {fetchPosts()
                console.log("Triggered")
              }}>Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              {Data.projects.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                      View Project
                    </a>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="experience" className="space-y-4">
              {Data.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{exp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{exp.company}</p>
                    <p className="text-muted-foreground">{exp.year}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="posts" className="space-y-4"  >
              {!posts ? <Loader/> : posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4 space-y-4">
                    {
                      <img src={post.file} alt="Post" className="w-full max-h-screen rounded-lg" />
                     }
                    <p>{post.text}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}