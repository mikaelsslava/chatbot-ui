import { getServerProfile } from "@/lib/server/server-chat-helpers"
import { createResponse } from "@/lib/server/server-utils"
import { ChatSettings } from "@/types"
import { ServerRuntime } from "next"
import OpenAI from "openai"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  try {
    const profile = await getServerProfile()

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const thread = await openai.beta.threads.create()

    console.log("thread", thread)

    return createResponse({ thread }, 200)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: "Something went wrong..." }),
      {
        status: 400
      }
    )
  }
}
