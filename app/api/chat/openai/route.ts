import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_AssistantResponse
} from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { resources } from "../../resources"
import { retrieveReference } from "../../retrieveReferences"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, threadId } = json as {
    chatSettings: ChatSettings
    messages: any[]
    threadId: string
  }

  console.log("threadId", threadId)

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const assistant = (await openai.beta.assistants.list()).data[0]

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messages.reverse()[0].content
    })

    const run = openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: assistant.id
      })
      .toReadableStream()

    const referencesArtifacts: string[] = []
    const references: string[] = []

    const transformStream = new TransformStream({
      start() {},
      transform(chunk, controller) {
        const textDecoder = new TextDecoder()
        const decodedChunk = JSON.parse(textDecoder.decode(chunk))

        if (decodedChunk.event !== "thread.message.delta") {
          return
        }

        const textEncoder = new TextEncoder()

        const content = decodedChunk.data?.delta?.content[0]
        let deltaValue = content.text.value || ""

        if (content.text.annotations) {
          content.text.annotations?.forEach((annotation: any) => {
            console.log("annotation", annotation)
            if (annotation.text) {
              console.log("annotation.text", annotation.text)
              deltaValue = deltaValue.replace(
                annotation.text as string,
                ` **(${referencesArtifacts.length + 1})** `
              )
              referencesArtifacts.push(annotation.file_citation.file_id)
            }
          })
        }

        const encodedChunk = textEncoder.encode(deltaValue)

        controller.enqueue(encodedChunk)
      },
      async flush(controller) {
        let footer = "\n\n"
        for (const reference in referencesArtifacts) {
          const link = await retrieveReference(
            openai,
            referencesArtifacts[reference]
          )
          footer += `${reference + 1}. ${link}\n`
        }

        const textEncoder = new TextEncoder()
        const encodedChunk = textEncoder.encode(footer)

        controller.enqueue(encodedChunk)
        controller.terminate()
      }
    })

    const transformedStream = run.pipeThrough(transformStream)

    return new StreamingTextResponse(transformedStream)

    //   return AssistantResponse(
    //   { threadId, messageId: createdMessage.id },
    //   async ({ forwardStream, sendDataMessage }) => {
    //     // Run the assistant on the thread
    //     const runStream = openai.beta.threads.runs.stream(threadId, {
    //       assistant_id:
    //         process.env.ASSISTANT_ID ??
    //         (() => {
    //           throw new Error('ASSISTANT_ID is not set');
    //         })(),
    //     });

    //     // forward run status would stream message deltas
    //     let runResult = await forwardStream(runStream);

    //     // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
    //     while (
    //       runResult?.status === 'requires_action' &&
    //       runResult.required_action?.type === 'submit_tool_outputs'
    //     ) {
    //       const tool_outputs =
    //         runResult.required_action.submit_tool_outputs.tool_calls.map(
    //           (toolCall: any) => {
    //             const parameters = JSON.parse(toolCall.function.arguments);

    //             switch (toolCall.function.name) {
    //               // configure your tool calls here

    //               default:
    //                 throw new Error(
    //                   `Unknown tool call function: ${toolCall.function.name}`,
    //                 );
    //             }
    //           },
    //         );

    //       runResult = await forwardStream(
    //         openai.beta.threads.runs.submitToolOutputsStream(
    //           threadId,
    //           runResult.id,
    //           { tool_outputs },
    //         ),
    //       );
    //     }
    //   },
    // );
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
