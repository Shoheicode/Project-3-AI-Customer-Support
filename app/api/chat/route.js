import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = ""

export async function POST(req){
    //console.log(process.env.OPEN_AI_API_KEY)
    const openai = new OpenAI({apiKey: process.env.OPEN_AI_API_KEY})
    const data = await req.json()
    console.log(systemPrompt)

    // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [
        {
            role: 'system', 
            content: systemPrompt}, 
            ...data
    ], // Include the system prompt and user messages
    model: 'gpt-3.5-turbo', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}