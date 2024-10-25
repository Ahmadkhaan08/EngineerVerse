import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Feed from "../components/Feed"; // Assuming Feed is a separate component for posts
import { useUserContext } from '../userContext';
import Loader from './Loader'
import UserProfile from './UserProfile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, BookOpen, Briefcase, Code, Home, LogOut, MessageSquare, Search, Settings, User, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EnhancedEngineerSocialPlatform() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { userData } = useUserContext();

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken) {
          navigate('/login');
          return;
        }

        const userId = localStorage.getItem('_id');
        const userResponse = await axios.get(`http://localhost:8000/api/v1/users/dashboard/${userId}`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        setUser(userResponse.data);
        const postsResponse = await axios.get('/api/posts', {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/all-users');
        const result = await response.json();
        setUsers(result.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  const handleLike = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
  };

  const handleUserClick = (user) => {
    console.log('Selected User:', user);
    // Implement additional logic as needed
  };
  function getInitials(fullName) {
    // Split the full name into an array of words
    const nameParts = fullName.split(' ');
  
    // Get the first letter of the first name and convert it to uppercase
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    
    // Get the first letter of the last name and convert it to uppercase
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
    // Combine the initials
    return firstInitial + lastInitial;
  }

  const handleLogout = async () => {
    try {
      console.log("logout")
      // Send request to backend to log out (clearing refreshToken)
      const response = await fetch('http://localhost:8000/api/v1/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}` // Optional: in case needed
        },
      });
  
      if (response.ok) {
        // Remove user data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('_id');
        
        // Optionally, redirect the user to the login page or home page
        window.location.href = '/login';
      } else {
        // Handle any errors from the server
        const errorData = await response.json();
        console.error('Logout failed:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  


  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="#">
              <BookOpen className="h-6 w-6 ml-5" />
              <span className="hidden  sm:inline-block px-2 font-extrabold ">EngineerVerse</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link className="transition-colors hover:text-foreground/80 text-foreground" to="#">Feed</Link>
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" to="/projects">Projects</Link>
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" to="/communities">Communities</Link>
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" to="/jobs">Jobs</Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search engineers, projects..." className="pl-8" type="search" />
              </div>
            </div>
            <nav className="flex items-center">
              <Link to='/chat'>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Messages</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
                      <AvatarFallback>{getInitials(userData.fullName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {handleLogout() }}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr_220px] md:gap-6 lg:grid-cols-[240px_1fr_300px] lg:gap-10 hide-scrollbar">
        {/* Sidebar */}
        <aside className="fixed top-14 z-30 ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block hide-scrollbar">
          <ScrollArea className="py-6 pr-6 lg:py-8 hide-scrollbar">
            <div className="flex flex-col space-y-4 hide-scrollbar">
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Feed
                </Button>
                <Link to='/projects'>
                  <Button variant="ghost" className="justify-start">
                    <Code className="mr-2 h-4 w-4" />
                    Projects
                  </Button>
                </Link>
                <Link to='/chat'>
                  <Button variant="ghost" className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </Link>
                <Link to='/communities'>
                  <Button variant="ghost" className="justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Communities
                  </Button>
                </Link>
                <Link to='/jobs'>
                  <Button variant="ghost" className="justify-start">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Jobs
                  </Button>
                </Link>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2">
                <h4 className="font-medium px-3">Personal Dashboard</h4>
                <div className="text-sm px-3">
                  <p>Connections: {userData?.followers.length || 0}</p>
                  <p>Projects: {userData?.projects.length || 0}</p>
                  <p>Engagement: {user?.engagement || '0%'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2">
                <h4 className="font-medium px-3">Skill Progress</h4>
                <div className="space-y-2">
                  {user?.skills?.map(skill => (
                    <div key={skill.name} className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span>{skill.progress}%</span>
                      <div className="h-2 w-full bg-secondary">
                        <div className="h-full" style={{ width: `${skill.progress}%`, backgroundColor: 'var(--primary)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <Feed posts={posts} handleLike={handleLike} />

        {/* Right Sidebar */}
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-l lg:sticky lg:block hide-scrollbar">
          <ScrollArea className="py-6 pl-6 lg:py-8">
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium">Trending Topics</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">#AI</Badge>
                  <Badge variant="secondary">#MachineLearning</Badge>
                  <Badge variant="secondary">#CloudComputing</Badge>
                  <Badge variant="secondary">#IoT</Badge>
                </div>
              </div>
              <div>
              <div className="container mr-28 my-5 p-2 space-y-8 bg-white max-h-80 min-h-60 overflow-scroll border-r-0 rounded hide-scrollbar">
      {/* Popular Engineers Section */}
      <h4 className="mb-2 text-sm font-medium">Popular Engineers</h4>
      <div className="space-y-2 ">
        {users.map((user) => (
          <div key={user._id} className="flex items-center cursor-pointer" onClick={() =>  {
            
            console.log(user._id)
            navigate(`/profile/${user._id}`)}}>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user.profilePicture || `/placeholder.svg?height=32&width=32&text=${user.fullName[0]}`} />
              <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
                <h4 className="mb-2 text-sm font-medium">Open Projects</h4>
                <div className="space-y-2">
                  {[1, 2].map((project) => (
                    <Card key={project}>
                      <CardHeader>
                        <CardTitle className="text-sm">Project {project}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Looking for contributors</p>
                        <Button variant="link" className="p-0 h-auto text-xs">Learn More</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Job Postings</h4>
                <div className="space-y-2">
                  {[1, 2].map((job) => (
                    <Card key={job}>
                      <CardHeader>
                        <CardTitle className="text-sm">Software Engineer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Company {job}</p>
                        <Button variant="link" className="p-0 h-auto text-xs">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left ml-2">
              Built by <b> T&A Creaters</b>. The source code is available on{" "}
              <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">GitHub</a>.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleLogout()}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
