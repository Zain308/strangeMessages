'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { verifySchema } from "@/schemas/verifySchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// CSS styles
const styles = `
  .verify-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: 'Inter', sans-serif;
  }

  .verify-card {
    width: 100%;
    max-width: 400px;
    padding: 32px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .verify-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .verify-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }

  .verify-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .code-input {
    width: 100%;
    padding: 16px;
    font-size: 18px;
    text-align: center;
    letter-spacing: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
  }

  .code-input:focus {
    border-color: #2563eb;
  }

  .verify-button {
    width: 100%;
    padding: 12px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .verify-button:hover {
    background-color: #1d4ed8;
  }

  .verify-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  .resend-text {
    font-size: 14px;
    color: #666;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }

  .resend-button {
    color: #2563eb;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .resend-button:hover {
    text-decoration: underline;
  }

  .resend-button:disabled {
    color: #93c5fd;
    cursor: not-allowed;
    text-decoration: none;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

export default function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error during verification:", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(
                axiosError.response?.data.message ?? "Verification failed. Please try again."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendCode = async () => {
        if (countdown > 0) return
        
        setIsResending(true)
        try {
            await axios.post('/api/resend-verification', {
                username: params.username
            })
            toast.success("Verification code resent successfully!")
            setCountdown(30)
        } catch (error) {
            console.error("Error resending code:", error)
            toast.error("Failed to resend verification code. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    return (
        <>
            <style>{styles}</style>
            <div className="verify-container">
                <div className="verify-card">
                    <h1 className="verify-title">Verify Your Account</h1>
                    <p className="verify-subtitle">Enter the 6-digit code sent to your email</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="verify-form">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="form-item">
                                        <FormLabel className="form-label">Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="code-input"
                                                placeholder="••••••"
                                                maxLength={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="verify-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="spinner" style={{ marginRight: '8px', height: '16px', width: '16px' }} />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Account'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="resend-text">
                        {countdown > 0 ? (
                            <span>Resend code in {countdown}s</span>
                        ) : (
                            <button
                                className="resend-button"
                                onClick={handleResendCode}
                                disabled={isResending}
                            >
                                {isResending ? 'Sending...' : "Didn't receive a code? Resend code"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}