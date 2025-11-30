const path = require('path')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "Will's Wills API is alive" })
})

// Stubbed preview endpoint (used by frontend)
app.post('/api/will/preview', (req, res) => {
  const answers = req.body || {}
  res.json({
    preview: {
      title: 'Sample Will Preview',
      summary:
        'This is a stubbed preview. In production, this would call OpenAI to generate tailored will wording.',
      answers
    }
  })
})

// OpenAI-backed generation endpoint (not wired yet, for future)
app.post('/api/will/generate', async (req, res) => {
  const { answers } = req.body || {}
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not set on the server. Add it in Render environment variables.'
    })
  }
  try {
    const OpenAI = require('openai')
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a will-generation assistant. You help draft Australian wills in clear, plain language. You are not a law firm and must not provide legal advice.'
        },
        {
          role: 'user',
          content: `Draft a will outline based on this structured input: ${JSON.stringify(
            answers
          )}`
        }
      ]
    })

    res.json({
      preview: {
        title: 'AI-generated Will Outline',
        summary: completion.choices?.[0]?.message?.content || 'No content returned',
        answers
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate will via OpenAI', details: String(err) })
  }
})

// Stripe checkout session (for future real paywall)
app.post('/api/checkout/create-session', async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: 'STRIPE_SECRET_KEY is not set on the server. Add it in Render environment variables.'
    })
  }
  try {
    const Stripe = require('stripe')
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: 14900,
            product_data: {
              name: "Will's Wills — Full Will Package"
            }
          },
          quantity: 1
        }
      ],
      success_url: process.env.CHECKOUT_SUCCESS_URL || 'https://example.com/success',
      cancel_url: process.env.CHECKOUT_CANCEL_URL || 'https://example.com/cancel'
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Stripe checkout session failed', details: String(err) })
  }
})

// Serve React frontend
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
