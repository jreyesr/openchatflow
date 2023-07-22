# OpenChatflow

An application to visually design, test, run and monitor Telegram chatbots.

Explore the demo here:

[![vercel badge](https://img.shields.io/badge/vercel-prod-brightgreen)](https://openchatflow.vercel.app/)

## Features

- Visual designer for Telegram conversations, inspired by [UML 2.x Activity Diagrams](https://en.wikipedia.org/wiki/Activity_diagram)
  ![a screenshot of the editor](./images/eff5909a5847caa0976bfe0644bdfe53.png)

- Nodes that drive the conversation forward:
  - A simple text node that just sends a message to the user
  - A prompt node that asks the user for a response and then continues
  - An option node that prompts the user to make a choice
  - A confirmation node that requires the user to confirm a choice
- Nodes that take actions without disturbing the conversation state
  - HTTP requests
  - (TODO) Logging arbitrary events in the conversation's history
  - (TODO) Setting values in the conversation's memory, to be retrieved later
- (TODO) A conversation context (per conversation) where nodes can store information for later decisions
- (TODO) Branching conversational paths, depending on the user's responses or external systems
  - Could be used to implement arbitrary authorization policies, so that only certain users can use the bot's tools
- Configurable exit statuses for conversations
- (TODO) Testing utilities to test and debug conversations
  - Context viewer and editor
  - Starting conversations from arbitrary points with an arbitrary past history
- (TODO) Conversation monitor for ongoing user conversations

## Development

Run the development server:

```bash
yarn dev
```

Then, open <http://localhost:3000> in your browser.

### Locally developing Telegram webhooks

If you need to test with real Telegram bots, I recommend using [Localtunnel](https://theboroer.github.io/localtunnel-www/) instead of [Ngrok](https://ngrok.com/). This is because Ngrok assigns you random subdomains on the free plan. Localtunnel, on the other hand, lets you request a subdomain.

Follow the instructions to install the CLI (it's a Node package). Then, run `lt --subdomain openchatflow --port 3000 --print-requests` to start the tunnel on <https://openchatflow.loca.lt>. Note that if someone else is using that same domain, you won't be able to use it, and Localtunnel will assign you a random subdomain anyways. In that case, change the subdomain and try again, since you need a stable subdomain for registering with Telegram.

Otherwise, you can test locally (without involving the actual Telegram servers), using [these examples](https://core.telegram.org/bots/webhooks#testing-your-bot-with-updates) to send
HTTP requests that look similar to those sent by Telegram itself. If developing locally, omit the `--tlsv1.2` flag, since it only works for HTTPS, and also change the `https://openchatflow.loca.lt` base URL for `http://localhost:3000`.

```bash
curl --tlsv1.2 -k -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
"update_id":10000,
"message":{
  "date":1441645532,
  "chat":{
     "last_name":"Test Lastname",
     "id":1111111,
     "first_name":"Test",
     "username":"Test"
  },
  "message_id":1365,
  "from":{
     "last_name":"Test Lastname",
     "id":1111111,
     "first_name":"Test",
     "username":"Test"
  },
  "text":"/start"
}
}' https://openchatflow.loca.lt/api/webhook/telegram
```

For example:

- Sending a text message

```bash
curl -k -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
"update_id":10000,
"message":{
  "date":1441645532,
  "chat":{
     "last_name":"Test Lastname",
     "id":1111111,
     "first_name":"Test",
     "username":"Test"
  },
  "message_id":1365,
  "from":{
     "last_name":"Test Lastname",
     "id":1111111,
     "first_name":"Test",
     "username":"Test"
  },
  "text":"/start"
}
}' http://localhost:3000/api/webhook/telegram
```

## Contributing

All contributions are welcome! Code, documentation, UI styling overhauls, bug reports and everything else.

All activity currently takes place in this repository.
