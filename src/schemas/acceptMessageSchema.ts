import { z } from "zod"

export const AcceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
})

// Backward compatibility
export const acceptMessageSchema = AcceptMessageSchema
