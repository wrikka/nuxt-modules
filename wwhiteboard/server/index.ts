import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Hono!'))

// Basic endpoint to store and retrieve whiteboard data
app.post('/api/whiteboard/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  // In a real app, you'd use Cloudflare KV or D1 to store this
  console.log(`Saving whiteboard ${id}`, body)
  return c.json({ success: true })
})

app.get('/api/whiteboard/:id', async (c) => {
  const { id } = c.req.param()
  // In a real app, you'd retrieve from KV or D1
  console.log(`Fetching whiteboard ${id}`)
  return c.json({ id, doc: { shapes: {}, comments: {}, order: [] } }) // Return mock data for now
})

export default app
