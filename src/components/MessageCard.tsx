"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, MessageCircle } from "lucide-react"
import { useState } from "react"
import type { Message } from "@/model/User"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import type { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast()
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast({
        title: "Message Deleted",
        description: "The message has been successfully deleted.",
      })
      onMessageDelete(message._id as string)
      setShowDeleteAlert(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Message Card */}
      <Card className="group relative bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300/50 overflow-hidden">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteAlert(true)}
          className="absolute top-4 right-4 w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
          title="Delete message"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <CardContent className="p-6">
          {/* Message Icon */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-base leading-relaxed font-medium break-words">{message.content}</p>
            </div>
          </div>

          {/* Date */}
          {message.createdAt && (
            <div className="flex items-center text-gray-500 text-sm mt-4 pt-4 border-t border-gray-200">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(message.createdAt)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Message</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 italic line-clamp-3">"{message.content}"</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteAlert(false)}
                disabled={isDeleting}
                variant="outline"
                className="flex-1 border-2 border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
