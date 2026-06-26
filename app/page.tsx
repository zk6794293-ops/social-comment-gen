'use client'

import { useState } from 'react'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [comments, setComments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const generateComments = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setComments([])

    try {
      const prompt = `Generate 3 short social media comments in Urdu.
Tone: casual, friendly, like Facebook/Instagram comments.
Topic: ${topic}
Return only the 3 comments, one per line.`

      const response = await (window as any).puter.ai.chat(prompt)
      const generated = response.split('\n').filter((c: string) => c.trim())
      setComments(generated)
    } catch (err) {
      setComments(['Error: Puter.js not loaded. Refresh page.'])
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>3 Comment Generator</h1>
      <input 
        value={topic} 
        onChange={(e) => setTopic(e.target.value)} 
        placeholder="اپنا ٹاپک لکھو..."
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button onClick={generateComments} disabled={loading}>
        {loading ? 'Generating...' : 'Generate 3 Comments'}
      </button>
      <div style={{ marginTop: '20px' }}>
        {comments.map((c, i) => <p key={i}>• {c}</p>)}
      </div>
    </div>
  )
}
