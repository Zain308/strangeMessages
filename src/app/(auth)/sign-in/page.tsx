'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { signIn } from "next-auth/react"

// CSS Styles
const styles = `
  .signin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f3f4f6;
    font-family: 'Inter', sans-serif;
  }

  .signin-card {
    width: 100%;
    max-width: 28rem;
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    text-align: center;
  }

  .signin-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .signin-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .signin-form {
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

  .forgot-password {
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
  }

  .forgot-password:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  .signin-button {
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

  .signin-button:hover {
    background-color: #2563eb;
  }

  .signin-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  .signin-footer {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .signup-link {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
  }

  .signup-link:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error("Incorrect username or password")
        } else {
          toast.error(result.error)
        }
        return
      }

      if (result?.url) {
        toast.success("Login successful")
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error("Sign-in error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="signin-container">
        <div className="signin-card">
          <h1 className="signin-title">Welcome Back</h1>
          <p className="signin-subtitle">Sign in to continue your anonymous adventure</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="signin-form">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        className="form-input"
                        placeholder="email or username"
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
              <div style={{ textAlign: 'right' }}>
                <Link href="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="signin-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner" style={{ height: '1rem', width: '1rem' }} />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>

          <div className="signin-footer">
            <p>
              Don't have an account?{' '}
              <Link href="/sign-up" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}