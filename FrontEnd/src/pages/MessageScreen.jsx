import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreVertical, Search, Paperclip, Code, Edit3, Mic, Send, CheckCircle2, File, X, Phone, VideoIcon, Bell, VolumeX, Trash2 } from 'lucide-react'

export default function MessagingScreen() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Doe', content: 'Hey, can you take a look at this code snippet?', timestamp: '10:30 AM', isSent: true },
    { id: 2, sender: 'You', content: 'Sure, send it over.', timestamp: '10:31 AM', isSent: true },
    { id: 3, sender: 'John Doe', content: 'Here it is:', timestamp: '10:32 AM', isSent: true },
    { id: 4, sender: 'John Doe', content: '```python\ndef calculate_factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    else:\n        return n * calculate_factorial(n-1)\n```', timestamp: '10:32 AM', isSent: true },
    { id: 5, sender: 'You', content: 'Looks good! Just make sure to add some error handling for negative numbers.', timestamp: '10:35 AM', isSent: true },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const fileInputRef = useRef(null)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true
      }])
      setNewMessage('')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        content: `File: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        isFile: true
      }])
    }
  }

  const handleVoiceMessage = () => {
    setIsRecording(!isRecording)
    if (isRecording) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        content: 'Voice message',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        isVoice: true
      }])
    }
  }

  const filteredMessages = searchQuery
    ? messages.filter(message => message.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white shadow-md rounded-lg">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                  <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
              </PopoverContent>
            </Popover>
            <div>
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5 text-purple-600" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-purple-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-md rounded-lg">
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Audio Call</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <VideoIcon className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Video Call</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Mute Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <VolumeX className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Block</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Clear Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {showSearch && (
          <div className="bg-white p-2">
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-purple-300"
            />
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-grow p-4 space-y-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'You' ? 'bg-purple-500 text-white' : 'bg-indigo-100'}`}>
                {message.isFile ? (
                  <div className="flex items-center space-x-2">
                    <File className="h-5 w-5 text-white" />
                    <span>{message.content}</span>
                  </div>
                ) : message.isVoice ? (
                  <div className="flex items-center space-x-2">
                    <Mic className="h-5 w-5 text-white" />
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-75">{message.timestamp}</span>
                  {message.sender === 'You' && message.isSent && (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Collaboration Tools */}
        <div className="bg-white border-t p-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current.click()} className="text-purple-600 border-purple-300">
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="icon" className="text-purple-600 border-purple-300">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-purple-600 border-purple-300">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4 flex items-center space-x-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow border border-purple-300"
          />
          <Button variant="ghost" size="icon" onClick={handleVoiceMessage}>
            <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : 'text-purple-600'}`} />
          </Button>
          <Button onClick={handleSendMessage} className="bg-purple-500 text-white">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-white border-l border-purple-300">
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participants" className="text-purple-600">Users</TabsTrigger>
            <TabsTrigger value="pinned" className="text-purple-600">Pinned</TabsTrigger>
            <TabsTrigger value="files" className="text-purple-600">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="participants" className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Software Engineer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar-2.jpg" alt="Jane Smith" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Jane Smith</p>
                <p className="text-xs text-gray-500">Data Scientist</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="pinned" className="p-4">
            <p className="text-sm text-gray-500">No pinned messages</p>
          </TabsContent>
          <TabsContent value="files" className="p-4">
            <p className="text-sm text-gray-500">No shared files</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
