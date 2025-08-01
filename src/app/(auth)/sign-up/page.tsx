'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner" 
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// CSS Styles
const styles = `
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f3f4f6;
    font-family: 'Inter', sans-serif;
  }

  .signup-card {
    width: 100%;
    max-width: 28rem;
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    text-align: center;
  }

  .signup-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .signup-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-message {
    font-size: 0.75rem;
    color: #ef4444;
  }

  .username-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .username-available {
    color: #10b981;
  }

  .username-taken {
    color: #ef4444;
  }

  .spinner {
    animation: spin 1s linear infinite;
    width: 1rem;
    height: 1rem;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .signup-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .signup-button:hover {
    background-color: #2563eb;
  }

  .signup-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  .signup-footer {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .signin-link {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
  }

  .signin-link:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">Join Strange Message</h1>
          <p className="signup-subtitle">Sign up to start your anonymous adventure</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="signup-form">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="form-input"
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    <div className="username-status">
                      {isCheckingUsername && <Loader2 className="spinner" />}
                      {!isCheckingUsername && usernameMessage && (
                        <span className={usernameMessage === 'Username is available' ? 'username-available' : 'username-taken'}>
                          {usernameMessage}
                        </span>
                      )}
                    </div>
                    <FormMessage className="form-message" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="form-input"
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="form-input"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="signup-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>

          <div className="signup-footer">
            <p>
              Already a member?{' '}
              <Link href="/sign-in" className="signin-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}