"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { type AxiosError } from "axios"
import type { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, User, Mail, Lock, CheckCircle, XCircle } from "lucide-react"
import type * as z from "zod"

export default function SignUpForm() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const checkUsernameUnique = async (username: string) => {
    if (username.length > 2) {
      setIsCheckingUsername(true)
      setUsernameMessage("")
      try {
        const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
      } finally {
        setIsCheckingUsername(false)
      }
    }
  }

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)

      toast({
        title: "Success",
        description: response.data.message,
      })

      router.replace(`/verify/${username}`)

      setIsSubmitting(false)
    } catch (error) {
      console.error("Error during sign-up:", error)

      const axiosError = error as AxiosError<ApiResponse>

      const errorMessage =
        axiosError.response?.data.message ?? "There was a problem with your sign-up. Please try again."

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Join True Feedback</h1>
          <p className="text-blue-100 text-lg">Start your anonymous adventure</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                          checkUsernameUnique(e.target.value)
                        }}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
                        placeholder="Choose a unique username"
                      />
                      {isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="animate-spin h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    {!isCheckingUsername && usernameMessage && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          usernameMessage === "Username is available" ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {usernameMessage === "Username is available" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {usernameMessage}
                      </div>
                    )}
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </FormLabel>
                    <Input
                      {...field}
                      type="email"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
                      placeholder="your@email.com"
                    />
                    <p className="text-blue-200 text-sm">We'll send you a verification code</p>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </FormLabel>
                    <Input
                      {...field}
                      type="password"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
                      placeholder="Create a strong password"
                    />
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-white/80">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-white font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
