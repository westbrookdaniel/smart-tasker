'use client'

import { useChat } from 'ai/react'
import { parse, stringify } from 'yaml'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
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
    <div>
      <ul>
        {data?.map((item, i) => {
          return (
            <li key={i}>
              {typeof item.quantity === 'number'
                ? `${item.quantity} ${item.name}`
                : item.name}
            </li>
          )
        })}
      </ul>

      <form onSubmit={handleSubmit} className="flex space-x-2 items-end w-full">
        <textarea
          className="border-gray-400 border-2 rounded-md px-2 py-1 flex-1"
          value={input}
          onChange={handleInputChange}
          aria-label="Your list..."
          placeholder="Your list..."
        />
        <button
          type="submit"
          className="border-gray-400 border-2 rounded-md px-3 "
        >
          Send
        </button>
      </form>
    </div>
  )
}

const example = `
Groceries:
3 Bannans
4 Apples
Soy sauce
a few milks
`
