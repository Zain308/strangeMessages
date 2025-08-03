"use client"

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import type { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { type AxiosError } from "axios"
import { RefreshCcw, Copy, Share2, MessageSquare, Settings, User, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessages", response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to fetch message settings",
        variant: "destructive",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true)
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages")
        setMessages(response.data.messages || [])
        if (refresh) {
          toast({
            title: "Messages Refreshed",
            description: "Your messages have been updated",
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [setIsLoading, setMessages, toast],
  )

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      })

      setValue("acceptMessages", !acceptMessages)
      toast({
        title: response.data.message,
        variant: "default",
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to update message settings",
        variant: "destructive",
      })
    }
  }

  // Safe destructuring with fallback
  const username = session?.user?.username || ""
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Link Copied!",
      description: "Your profile link has been copied to clipboard",
    })
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Send me anonymous feedback",
          text: "Send me honest, anonymous feedback through this link:",
          url: profileUrl,
        })
      } catch (error) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your dashboard</p>
          <Button
            onClick={() => (window.location.href = "/sign-in")}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  True Feedback
                </h1>
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-500">Dashboard</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">{username}</span>
              </div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Welcome back, {username}!
          </h2>
          <p className="text-gray-600 text-lg">Manage your anonymous feedback and profile settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    acceptMessages
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                >
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-3xl font-bold ${acceptMessages ? "text-green-600" : "text-red-600"}`}>
                  {acceptMessages ? "Active" : "Paused"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Shares</p>
                <p className="text-3xl font-bold text-gray-900">∞</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Link Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Profile</h3>
            <p className="text-gray-600">Share this link to receive anonymous messages from anyone</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-6 bg-transparent"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  onClick={shareProfile}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Message Settings</h3>
                <p className="text-gray-600 mt-1">Control whether you want to receive new messages</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className={`text-sm font-semibold ${acceptMessages ? "text-green-600" : "text-red-600"}`}>
                  {acceptMessages ? "✓ Accepting Messages" : "✗ Not Accepting Messages"}
                </p>
                <p className="text-xs text-gray-500">
                  {acceptMessages ? "People can send you messages" : "Messages are disabled"}
                </p>
              </div>
              <div className="relative">
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                />
                {isSwitchLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your Messages</h3>
                  <p className="text-sm text-gray-600">{messages.length} total messages</p>
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  fetchMessages(true)
                }}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              >
                <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="p-8">
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message, index) => (
                  <MessageCard key={message._id || index} message={message} onMessageDelete={handleDeleteMessage} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">No messages yet</h4>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Share your profile link to start receiving anonymous feedback from friends, colleagues, or anyone!
                </p>
                <Button
                  onClick={shareProfile}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Your Link
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
