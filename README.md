# Oshizushi
This is Oshizushi, a webhook kit linking [Mackerel](https://mackerel.io/) and [Pushover](https://pushover.net/).

## Environment
The author uses this application on [Cloudflare Workers](https://workers.cloudflare.com).

As the application is built with [Hono](https://hono.dev), other TypeScript runtime environments may be usable,
but not guaranteed.

(Note that this application now enforces IP address restriction. Since the method to check IP address is runtime-specific, you should rewrite related code to run on another environment.)

## How to Use
1. Register your Pushover application
2. Prepare these secrets and register them as environment variables (secrets on Workers):
    - `PO_USER_KEY`: Your User Key, found on Pushover user page
    - `PO_API_TOKEN`: API token for the application
3. Deploy this application on a runtime environment
4. Add a webhook to Mackerel notification channel with URL: `DEPLOYED_HOST/webhook`

## License
Available under the terms of Boost Software License Version 1.0.
