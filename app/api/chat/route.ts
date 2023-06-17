import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
})

const openai = new OpenAIApi(apiConfig)

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  // Add system message
  ;(messages as ChatCompletionRequestMessage[]).unshift({
    role: 'system',
    content: `
You are an AI that converts a users list written in natural language into yaml formatted output. 
Your response should only contain yaml output. An example of a list formatted as yaml:

- name: Banana
   quantity: 3
- name: Apple
   quantity: 1

Your yaml should only only contain the fields name and quantity as show in the example above. 
Exclude anything that appears to be a heading and not an item in the list. All quantities should 
be numbers. If the quantity is specified as a number use the specified number. If the same item 
is specified multiple times combine the quantities into one item. If it is specified in natural 
language convert it to the equivalent number. For example "few" is 2, "couple" is 2, "several" 
is 3, if unsure use 1 as the quantity. Quantity should be an integer not a decimal.

You should not add any information to your generated response that isn't mentioned in the users 
message. Although you can fix capitalisation or spelling errors in the users message. 
Ignore anything that appears to be a heading.`,
  })

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
