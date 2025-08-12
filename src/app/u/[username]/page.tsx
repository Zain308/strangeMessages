"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { motion } from "framer-motion";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const messageContent = form.watch("content");

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's your biggest dream right now?",
    "What's something you're proud of but rarely talk about?",
    "If you could change one thing about yourself, what would it be?",
  ]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message, { shouldValidate: true });
    toast({
      title: "Suggestion Selected",
      description: "Your message is ready to edit or send!",
      variant: "default",
    });
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post("/api/suggest-messages");
      const suggestions = response.data.message.split("||");
      setSuggestedMessages(suggestions);
      toast({
        title: "New Suggestions Generated!",
        description: "Explore these fresh conversation starters.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({
        title: "Failed to Fetch Suggestions",
        description: "Showing default suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      toast({
        title: "Message Sent!",
        description: response.data.message,
        variant: "default",
      });
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900 tracking-tight">
          Send Anonymous Feedback to <span className="text-primary">{username}</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Send Message Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Send a Message</h2>
                </div>
                <p className="text-blue-100 text-sm mt-2 text-center">Your message is 100% anonymous</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="relative">
                    <Textarea
                      placeholder="Share your thoughts, ask a question, or give feedback... ✨"
                      className="bg-white/60 border border-gray-200/50 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg min-h-[120px] resize-none transition-all duration-200"
                      maxLength={300}
                      aria-label="Anonymous message input"
                      {...form.register("content")}
                    />
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <span>{messageContent?.length || 0}/300 characters</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Anonymous</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    aria-label="Send anonymous message"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggestions Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Need Inspiration?</h2>
                </div>
                <p className="text-purple-100 text-sm mt-2 text-center">AI-powered conversation starters</p>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg mb-6 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-primary animate-pulse hover:animate-none"
                  aria-label="Generate new AI suggestions"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get New Suggestions
                    </>
                  )}
                </Button>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <p className="text-gray-600 text-center text-sm mb-4">Click a suggestion to use it:</p>
                  {suggestedMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full max-w-full p-3 text-left justify-start bg-white/70 hover:bg-white/90 border border-gray-200/50 hover:border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group whitespace-normal break-words text-ellipsis overflow-hidden"
                        onClick={() => handleMessageClick(message)}
                        aria-label={`Use suggestion: ${message}`}
                      >
                        <MessageSquare className="w-5 h-5 mr-3 text-primary group-hover:text-primary/80 flex-shrink-0 mt-1" />
                        <span className="text-gray-800 group-hover:text-gray-900 leading-relaxed text-sm break-words flex-1 line-clamp-2">
                          {message}
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}