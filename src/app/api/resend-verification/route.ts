import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username } = await request.json()

    const user = await UserModel.findOne({ username })

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 })
    }

    if (user.isVerified) {
      return Response.json({ success: false, message: "User is already verified" }, { status: 400 })
    }

    // Generate new verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    user.verifyCode = verifyCode
    user.verifyCodeExpiry = expiryDate
    await user.save()

    // Send verification email
    const emailResponse = await sendVerificationEmail(user.email, username, verifyCode)

    if (!emailResponse.success) {
      return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
    }

    return Response.json({ success: true, message: "Verification email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error resending verification email:", error)
    return Response.json({ success: false, message: "Error resending verification email" }, { status: 500 })
  }
}
