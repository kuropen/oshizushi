// Copyright (C) 2025 Kuropen.
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE.txt or copy at
// https://www.boost.org/LICENSE_1_0.txt)

import { Hono } from 'hono'
import { Bindings, PushoverPayload, PushoverResponse, WebhookPayload } from './types'

const app = new Hono<{Bindings: Bindings}>()

app.get('/', (c) => {
  return c.text('This is Oshizushi, an API linking Mackerel and Pushover.')
})

app.post('/webhook', async (c) => {
  const payload = await c.req.json<WebhookPayload>()

  console.log(payload)

  // Send a message to Pushover
  let message

  if (payload.message) {
    const hostname = payload.host?.name
    message = (hostname ? `${hostname}\n` : '') + payload.message
  } else if (payload.event === 'hostStatus') {
    message = `${payload.host?.name} is ${payload.host?.status} now.`
  } else {
    message = 'Received a webhook from Mackerel.'
  }

  const pushoverPayload: PushoverPayload = {
    token: c.env.PO_API_TOKEN,
    user: c.env.PO_USER_KEY,
    message,
  }

  if (payload.alert?.url) {
    pushoverPayload.url = payload.alert.url
  }

  const response = await fetch('https://api.pushover.net/1/messages.json', {
    method: 'POST',
    // parameter should be application/x-www-form-urlencoded
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(pushoverPayload).toString(),
  })

  const responseJson = await response.json<PushoverResponse>()
  if (!response.ok && responseJson.errors) {
    // If there are any errors, log them
    console.error(responseJson.errors)
  }

  // Return the response from Pushover
  return c.json(responseJson)
})

export default app
