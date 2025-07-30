import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Strange Message App | Verification code',
        react: VerificationEmail({username, otp: verifyCode}),
        });
        return {success:false, message: 'Verification email send successfully!'}
        
    } catch (emailError) {
        console.log("Error sending Verification Email",emailError);
        return {success:false, message: 'Failed to send verification email'}
    }
}