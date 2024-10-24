import { resources } from "./resources"

export const retrieveReference = async (
  openai: any,
  fileId: string
): Promise<string> => {
  const file = await openai.files.retrieve(fileId)

  //@ts-ignore
  if (!resources[file.filename]) {
    console.warn(`No resource found for ${file.filename}`)
  }

  //@ts-ignore
  return resources[file.filename] || ""
}
