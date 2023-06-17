'use client'

import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      <ul>
        {messages.map((m, index) => (
          <li key={index}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="flex space-x-2 items-stretch w-full"
      >
        <input
          className="border-gray-400 border-2 rounded-md px-2 py-1 flex-1"
          value={input}
          onChange={handleInputChange}
          aria-label="Say something..."
          placeholder="Say something..."
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
