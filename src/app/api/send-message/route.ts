import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import type { Message } from "@/model/User"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, content } = await request.json()

    if (!username || !content) {
      return Response.json({ success: false, message: "Username and content are required" }, { status: 400 })
    }

    // Find the user by username
    const user = await UserModel.findOne({ username }).exec()

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Check if user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 })
    }

    const newMessage = { content, createdAt: new Date() }

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message)
    await user.save()

    return Response.json({ message: "Message sent successfully", success: true }, { status: 201 })
  } catch (error) {
    console.error("Error adding message:", error)
    return Response.json({ message: "Internal server error", success: false }, { status: 500 })
  }
}
