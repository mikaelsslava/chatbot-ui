import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { resources } from "../../resources"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens:
        chatSettings.model === "gpt-4-vision-preview" ||
        chatSettings.model === "gpt-4o"
          ? 4096
          : null, // TODO: Fix
      stream: true
    })

    const stream = OpenAIStream(response)

    const transformStream = new TransformStream({
      start() {
        // Called when the stream starts
      },
      transform(chunk, controller) {
        // Convert Uint8Array chunk to string
        const textDecoder = new TextDecoder()
        const decodedChunk = textDecoder.decode(chunk)

        console.log("Decoded chunk:", decodedChunk) // Log the decoded string

        // Modify the string if needed (e.g., append or manipulate)
        let modifiedString = decodedChunk // Modify the string if required

        // Convert the modified string back to Uint8Array
        const textEncoder = new TextEncoder()
        const encodedChunk = textEncoder.encode(modifiedString)

        // Send the modified chunk to the next stage of the stream
        controller.enqueue(encodedChunk)
      },
      flush(controller) {
        // Called when the stream ends

        const textEncoder = new TextEncoder()
        const encodedChunk = textEncoder.encode("End of stream")

        controller.enqueue(encodedChunk)
        controller.terminate()
      }
    })

    // Pipe the original stream through the middleware (transform stream)
    const transformedStream = stream.pipeThrough(transformStream)

    return new StreamingTextResponse(transformedStream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
