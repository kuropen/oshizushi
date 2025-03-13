// Copyright (C) 2025 Kuropen.
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE.txt or copy at
// https://www.boost.org/LICENSE_1_0.txt)

import { Hono } from 'hono'

// NOTE: Specific to Cloudflare Workers
import { getConnInfo } from 'hono/cloudflare-workers'

import { ipRestriction } from 'hono/ip-restriction'
import { Bindings, PushoverPayload, PushoverResponse, WebhookPayload } from './types'

const app = new Hono<{Bindings: Bindings}>()

app.use(
  '/webhook',
  ipRestriction(getConnInfo, {
    // should allow only Mackerel's IP addresses which is mentioned in the document:
    // https://support.mackerel.io/hc/en-us/articles/360039701332-What-is-the-source-IP-address-for-Webhook-and-other-services-alert-notifications-from-Mackerel
    allowList: [
      '52.193.111.118',
      '52.196.125.133',
      '13.113.213.40',
      '52.197.186.229',
      '52.198.79.40',
      '13.114.12.29',
      '13.113.240.89',
      '52.68.245.9',
      '13.112.142.176'
    ],
  })
)

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
