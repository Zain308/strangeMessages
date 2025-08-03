"use client"

import { useState } from "react"
import axios, { type AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Send, Sparkles, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type * as z from "zod"
import type { ApiResponse } from "@/types/ApiResponse"
import { MessageSchema } from "@/schemas/messageSchema"
import { useParams } from "next/navigation"
import Link from "next/link"

const specialChar = "||"

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).filter((msg) => msg.trim().length > 0)
}

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's your favorite movie and why?",
    "What's something you're really proud of?",
    "If you could have dinner with anyone, who would it be?",
    "What's the best advice you've ever received?",
    "What's something that always makes you smile?",
  ])

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  })

  const messageContent = form.watch("content")

  const handleMessageClick = (message: string) => {
    form.setValue("content", message)
  }

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      })

      toast({
        title: "Message Sent! 🎉",
        description: "Your anonymous message has been delivered successfully.",
      })
      form.reset({ ...form.getValues(), content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Failed to Send",
        description: axiosError.response?.data.message ?? "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true)
    try {
      const response = await axios.post("/api/suggest-messages")
      const data = response.data
      if (data.message) {
        const messages = parseStringMessages(data.message)
        setSuggestedMessages(messages)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to generate message suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSuggestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Send Anonymous Message
            </h1>
            <p className="text-xl text-gray-600">
              to <span className="font-semibold text-blue-600">@{username}</span>
            </p>
          </div>

          {/* Message Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Your Anonymous Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your honest, anonymous message here... Be kind and constructive!"
                          className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-right">
                        <span className={`text-sm ${messageContent?.length > 500 ? "text-red-500" : "text-gray-500"}`}>
                          {messageContent?.length || 0}/500
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !messageContent?.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Suggested Messages */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Inspiration?</h3>
              <p className="text-gray-600 mb-4">Click on any suggestion below or generate new ones</p>
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                variant="outline"
                className="border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate New Suggestions
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200"
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{message}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Want Your Own Message Board?</h3>
            <p className="text-gray-600 mb-6">
              Create your account and start receiving anonymous feedback from friends, colleagues, and more!
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-3 text-lg font-semibold"
              >
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
