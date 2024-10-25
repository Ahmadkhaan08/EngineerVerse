import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Linkedin, ExternalLink, Mail, Edit2, Save, Plus, Trash2, Upload, Image as ImageIcon, Video, X, Heart, MessageCircle, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserContext } from '@/userContext'
import axios from 'axios'


export default function Component() {
  const [isEditing, setIsEditing] = useState(false)
  const {userData, setUserData} = useUserContext()
  const {setIsDataChange} = useUserContext();
  const [userDetails, setUserDetails] = useState({name : userData.fullName, username: '@'+ userData.username, location: 'Location', title: "Designation", avatar:"/placeholder.svg", resume: null })
  const [data, setData] = useState({
    name: userData.fullName,
    username: userData.username,
    location: "Location",
    title: "Designation",
    profilePicture: "/placeholder.svg",
    resume: null,
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
  })

  const [newPost, setNewPost] = useState({ type: 'image', content: null, description: '' })
  const [newComment, setNewComment] = useState('')
  const [profileData, setProfileData] = useState({
    name: userData.fullName,
    username:userData.username,
    location: userData.location,
    title: userData.title,
    profilePicture: "/placeholder.svg"
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

  

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...data.skills]
    newSkills[index][field] = value
    setData({ ...data, skills: newSkills })
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...data.projects]
    newProjects[index][field] = value
    setData({ ...data, projects: newProjects })
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...data.experience]
    newExperience[index][field] = value
    setData({ ...data, experience: newExperience })
  }

  const handlePortfolioLinkChange = (field, value) => {
    setData({ ...data, portfolioLinks: { ...data.portfolioLinks, [field]: value } })
  }

  const handleSave = () => {
    console.log("Saving user data:", data)
    setIsEditing(false)
  }

  const addProject = () => {
    setData({
      ...data,
      projects: [...data.projects, { title: "New Project", description: "Project description", link: "" }]
    })
  }

  const removeProject = (index) => {
    const newProjects = data.projects.filter((_, i) => i !== index)
    setData({ ...data, projects: newProjects })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setData({ ...data, profilePicture: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select a resume to upload.");
      return;
    }

    setIsDialogOpen(true)
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await axios.post(`http://localhost:8000/api/v1/users/upload-resume/${localStorage.getItem('_id')}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data', // Ensure you set the correct content type
        },
      });

      // Handle the response from the server
      if (response.data.success) {
        console.log("Resume uploaded successfully", response.data.user);
        setUserData(response.data.user); // Update user data in the context or state
        localStorage.setItem('User', JSON.stringify(response.data.user));
        alert("Resume uploaded successfully.");
      } else {
        console.error("Failed to upload resume:", response.data.message);
        alert("Failed to upload resume.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Error uploading resume.");
    } finally {
      setIsDialogOpen(true)
      setResumeFile(null); // Clear the file input after upload
    }
  };


  const handleNewPostChange = (e) => {
    if (e.target.name === 'content') {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setNewPost({ ...newPost, content: reader.result })
        }
        reader.readAsDataURL(file)
      }
    } else {
      setNewPost({ ...newPost, [e.target.name]: e.target.value })
    }
  }

  const handlePostSubmit = () => {
    if (newPost.content && newPost.description) {
      setData({
        ...data,
        posts: [
          { id: data.posts.length + 1, ...newPost, likes: 0, isLiked: false, comments: [] },
          ...data.posts
        ]
      })
      setNewPost({ type: 'image', content: null, description: '' })
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
      } else {
        console.error('Failed to delete post:', response.status)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleLikePost = (postId) => {
    setData({
      ...data,
      posts: data.posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    })
  }

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      setData({
        ...data,
        posts: data.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { id: post.comments.length + 1, user: data.name, text: newComment.trim() }
                ]
              }
            : post
        )
      })
      setNewComment('')
    }
  }
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [accessToken, setAccessToken] = useState(null)

  // Fetch posts for the current user
  const getUserPosts = async () => {
    try {
      const userId = localStorage.getItem('_id')
      const token = localStorage.getItem('accessToken') // assuming token is stored
      setAccessToken(token)
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
    } finally {
      setLoadingPosts(false)
    }
  }

  const [resumeFile, setResumeFile] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]) // Set the selected file
  }

  const handleSaveProfile = async () => {
    try {
      // Update profile information
      console.log("Profile data: ",profileData);

      const profileResponse = await fetch(`http://localhost:8000/api/v1/users/update-profile/${localStorage.getItem('_id')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(profileData)
      });
  
      // Handle profile response
      if (profileResponse.ok) {
        const updatedProfile = await profileResponse.json(); // Parse the updated user data from the response
        console.log("Profile updated successfully", updatedProfile.user);
  
        // Update user data in the context or state
        setUserData(updatedProfile.user);  // Assuming you're using setUser from the context
        localStorage.setItem('User', JSON.stringify(updatedProfile.user));
  
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", profileResponse.status);
      }
  
      // If resume file is selected, upload resume
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
  
        const resumeResponse = await fetch('http://localhost:8000/api/v1/profile/uploadResume', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formData
        });
  
        if (resumeResponse.ok) {
          console.log("Resume uploaded successfully");
        } else {
          console.error("Failed to upload resume:", resumeResponse.status);
        }
      }
    } catch (error) {
      console.error("Error updating profile or uploading resume:", error);
    }
  };
  
  // Fetch posts on component mount
  useEffect(() => {
    getUserPosts()
  }, [])
  // const handleResumeUploadonBackend = async (e) => {
  //   e.preventDefault(); // Prevent default form submission if this is in a form
  
  //   const formData = new FormData();
  //   formData.append('resume', resumeFile); // Append the resume file
  
  //   const profileResponse = await fetch(`http://localhost:8000/api/v1/users/update-profile/${localStorage.getItem('_id')}`, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       // Note: Do NOT set Content-Type header here. It will be automatically set by the browser to include boundaries for FormData.
  //     },
  //     body: formData // Use FormData as the body
  //   });
  
  //   // Handle profile response
  //   if (profileResponse.ok) {
  //     const updatedProfile = await profileResponse.json(); // Parse the updated user data from the response
  //     console.log("Profile updated successfully", updatedProfile.user);
  
  //     // Update user data in the context or state
  //     setUserData(updatedProfile.user);  // Assuming you're using setUser from the context
  //     localStorage.setItem('User', JSON.stringify(updatedProfile.user));
  
  //     setIsEditing(false);
  //   } else {
  //     console.error("Failed to update profile:", profileResponse.status);
  //   }
  // };
  

  return (
    <div className="container mx-auto p-4 space-y-8 bg-gray-50 min-h-screen">
      
      {/* Profile Header
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={data.profilePicture} alt={data.name} />
                <AvatarFallback>{data.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profile-picture" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <Upload className="w-4 h-4" />
                    </div>
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              )}
            </div>
            <div className="flex-grow space-y-2 text-center md:text-left">
              {isEditing ? (
                <Input
                  value={data.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  className="text-2xl font-bold"
                />
              ) : (
                <h1 className="text-3xl font-bold">{data.name}</h1>
              )}
              {isEditing ? (
                <Input
                  value={data.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                  className="text-lg"
                />
              ) : (
                <p className="text-xl text-muted-foreground">{data.title}</p>
              )}
              {isEditing ? (
                <Input
                  value={data.location}
                  onChange={(e) => handleInputChange(e, 'location')}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{data.location}</p>
              )}
              <p className="text-sm text-muted-foreground">{data.username}</p>
            </div>
            <div className="md:ml-auto space-y-2">
              {isEditing ? (
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    {data.resume ? "Update Resume" : "Upload Resume"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Resume</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload from Computer
                      </label>
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                      />
                    </div>
                    <div>
                      <Button onClick={handleGoogleDriveUpload} className="w-full">
                        <img src="/google-drive-icon.png" alt="Google Drive" className="w-5 h-5 mr-2" />
                        Upload from Google Drive
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card> */}
        <div className="w-full">
      <div className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profileData.profilePicture} alt={profileData.name} />
            <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow space-y-2 text-center md:text-left">
          {isEditing ? (
            <>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="text-2xl font-bold"
                placeholder="Name"
              />
              <Input
                name="title"
                value={profileData.title}
                onChange={handleInputChange}
                className="text-lg"
                placeholder="Title"
              />
              <Input
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                className="text-sm"
                placeholder="Location"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="text-xl text-muted-foreground">{profileData.title}</p>
              <p className="text-sm text-muted-foreground">{profileData.location}</p>
              <p className="text-sm text-muted-foreground">{profileData.username}</p>
            </>
          )}
        </div>
        <div className="space-y-2">
          {isEditing ? (
            <Button onClick={handleSaveProfile}>
              Save
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
                   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          {userData.resume ? "Update Resume" : "Upload Resume"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload from Computer
            </label>
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
          </div>
          <div>
            <Button onClick={handleResumeUpload} className="w-full">
              <img src="/google-drive-icon.png" alt="Google Drive" className="w-5 h-5 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
        
    <Button 
  variant="outline" 
  className="w-full" 
  onClick={() => {
    if (userData.resume) {
      window.open(userData.resume, '_blank'); // Open the resume URL in a new tab
    } else {
      console.error('No resume available');
    }
  }}
>
  {userData?.resume ? "View Your Resume" : "No Resume Yet" }
</Button>

      
        </div>
      </div>
    </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} className="h-2" />
                </div>
              ))}
              {isEditing && (
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              )}
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
                <a href={data.portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="h-5 w-5" />
                <a href={data.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <a href={data.portfolioLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                  {data.email}
                </a>
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
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              {data.projects.map((project, index) => (
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
              {isEditing && (
                <Button onClick={addProject} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              )}
            </TabsContent>
            <TabsContent value="experience" className="space-y-4">
              {data.experience.map((exp, index) => (
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
            <TabsContent value="posts" className="space-y-4">
              {loadingPosts ? (
                <p>Loading...</p>
              ) : (
                posts.length === 0 ? (
                  <p>No posts to display.</p>
                ) : (
                  posts.map((post) => (
                    <Card key={post._id}>
                      <CardContent className="p-4 space-y-4">
                        { (
                          <img src={post.file} alt="Post" className="w-full max-h-screen rounded-lg" />
                        )  
                          // <video src={post.content} controls className="w-full h-auto rounded-lg" />
                        }
                        <p>{post.text}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              onClick={() => handleLikePost(post._id)}
                              className={post.isLiked ? "text-red-500" : ""}
                            >
                              <Heart className={`mr-1 h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                              {post.likes}
                            </Button>
                          </div>
                          <Button variant="outline" onClick={() => handleDeletePost(post._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}