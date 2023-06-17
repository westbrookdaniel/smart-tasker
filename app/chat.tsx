'use client'

import { useChat } from 'ai/react'
import { parse } from 'yaml'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
      initialInput: exampleInput,
    })

  const combinedAssistantMessages = messages.reduce((acc, m) => {
    if (m.role === 'assistant') {
      acc += `${m.content}\n`
    }
    return acc
  }, '')

  const lines = combinedAssistantMessages.split('\n')
  let partial = ''
  let validYaml = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('  quantity: ')) {
      validYaml += partial + '\n' + line
      partial = ''
    } else {
      partial = partial + '\n' + line
    }
  }
  validYaml = validYaml.replace(/^\n+|\n+$/g, '')

  const data: { name: string; quantity: number }[] = parse(validYaml)
  return (
    <div className="max-w-2xl w-full mx-auto px-6 pt-8 pb-6 space-y-8 min-h-screen flex flex-col">
      <div className="space-y-4 flex-1">
        {data?.map((item, i) => {
          return (
            <div key={i} className="items-top flex space-x-3 items-center">
              <Checkbox id={`item${i}`} />
              <label
                htmlFor={`item${i}`}
                className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {typeof item.quantity === 'number' && item.quantity > 1
                  ? `${item.quantity} ${item.name}`
                  : item.name}
              </label>
            </div>
          )
        })}

        {isLoading ? (
          <div className="text-sm pt-4 text-gray-500">Parsing...</div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2 items-end w-full"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          aria-label="Your list..."
          placeholder="Your list..."
          className="h-32"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}

const exampleInput = `Groceries:
3 Bannans
4 Apples
Soy sauce
a few milks`
