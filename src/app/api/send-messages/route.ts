import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { NextResponse } from "next/server"; // Use NextResponse for App Router

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    // Find user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user is accepting messages
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    // Create new message
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    // Add message to user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}