# n8n-nodes-ovh

[![npm version](https://img.shields.io/npm/v/@ovhcloud/n8n-nodes-ovh.svg)](https://www.npmjs.com/package/@ovhcloud/n8n-nodes-ovh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The **official [OVHcloud](https://www.ovhcloud.com/) community nodes for [n8n](https://n8n.io/)**.
They let you automate OVHcloud services — email (Zimbra), SMS, and VoIP telephony — and start
workflows from real-time telephony call events, directly in n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/)
workflow automation platform.

- [Features](#features)
- [Supported resources & operations](#supported-resources--operations)
- [Trigger node](#trigger-node)
- [Multi-region support](#multi-region-support)
- [Installation](#installation)
- [Credentials](#credentials)
- [Usage](#usage)
- [Examples](#examples)
- [Compatibility](#compatibility)
- [Development](#development)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)
- [Version history](#version-history)

## Features

- **One node, multiple services** — a single consolidated `OVH` node exposes several OVHcloud
  resources, each with its own set of operations.
- **Event trigger** — an `OVH Trigger` node starts workflows in real time on telephony call
  events (ringing, answered, hung up, on hold).
- **Secure signature authentication** — requests are signed per-request with OVH's SHA1 signature
  scheme, handled entirely inside the credential. Your keys never leave n8n.
- **Dynamic dropdowns** — platforms, mailboxes, SMS services, phone lines, voicemails and more are
  loaded live from your OVH account, so you pick from real values instead of typing IDs.
- **Multi-region** — works across OVH Europe, Canada and US, plus So You Start and Kimsufi.

## Supported resources & operations

The action **`OVH`** node ships four resources (a separate **OVH Trigger** node is documented
[below](#trigger-node)).

### 📧 Mailbox — OVHcloud Email (Zimbra)

Mailbox accounts plus their email aliases and redirections.

| Operation | Description |
| --- | --- |
| List Mailboxes | Retrieve all mailboxes for a platform |
| Get Mailbox Info | Fetch metadata for a specific mailbox |
| Create Mailbox | Create a new mailbox (offer, slot and password required) |
| Rename Mailbox | Update a mailbox display name and/or email |
| Change Mailbox Password | Set a new password for a mailbox |
| Delete Mailbox | Delete a mailbox and its content |
| List Aliases | List email aliases on the platform |
| Create Alias | Create an alias pointing to a mailbox |
| Delete Alias | Delete an email alias |
| List Redirections | List email redirections on the platform |
| Create Redirection | Create a redirection (source → destination) |
| Delete Redirection | Delete an email redirection |

### 💬 SMS

| Operation | Description |
| --- | --- |
| Send SMS | Send an SMS to one or more recipients (optional scheduling, tag, two-way) |
| Send Batch | Send a batch of SMS, optionally scheduled |
| List Incoming | List received SMS messages |
| List Outgoing | List sent SMS messages |
| Get Incoming | Get the detail of a received SMS |
| Get Outgoing | Get the detail of a sent SMS |
| Delete Incoming | Delete a received SMS |
| Delete Outgoing | Delete a sent SMS |
| Get Account | Get SMS account details such as remaining credits |

### ☎️ VoIP — Telephony

| Operation | Description |
| --- | --- |
| Click to Call | Place a call from a line (optional calling number and intercom mode) |
| Block Line | Block incoming and/or outgoing calls on a line |
| Unblock Line | Remove call blocking from a line |
| List Lines | List the phone lines on a billing account |
| Get Line | Get the details of a phone line |
| List Calls | List the ongoing calls on a line |
| Hang Up Call | Hang up an ongoing call |
| Hold Call | Toggle hold on an ongoing call |
| Transfer Call | Transfer an ongoing call to another number |
| List Voicemails | List voicemail services on a billing account |
| Get Voicemail | Get the detail of a voicemail service |
| List Voicemail Messages | List the messages in a voicemail |
| Get Voicemail Message | Get a single voicemail message |
| Delete Voicemail | Delete a voicemail message |
| Get Voicemail Transcript | Get a download URL for a voicemail message transcript |
| Configure VXML | Configure a VXML service's script/recording URL |
| Get Consumption History | Get the billed consumption history for a period |

### 🌐 Domain — Email domains (Zimbra)

| Operation | Description |
| --- | --- |
| List Domains | List the email domains on a platform |
| Get Domain | Get the details of a domain |

## Trigger node

The **OVH Trigger** node starts your workflow in real time when a telephony (VoIP) call event
occurs. Under the hood it generates an event token (`POST /telephony/{billingAccount}/eventToken`)
and long-polls OVH's event server (`https://events.voip.ovh.net`), emitting one item per event.

**Parameters**

- **Billing Account** — the telephony billing account to listen on (loaded live from your account).
  The trigger receives events for all lines on that account.
- **Events** — the event types to trigger on. Leave empty to receive them all:

| Event | Fires when |
| --- | --- |
| Start Ringing | A call starts ringing |
| End Ringing | A call stops ringing |
| Start Calling | A call is established/answered |
| End Calling | A call ends |
| Start Hold | A call is put on hold |
| End Hold | A call is resumed from hold |

Each emitted item is the raw event payload (`Event`, `Ressource`, `Data`, `Details`, …). Use the
node's **Listen for test event** button to capture a live event while building the workflow.

> **Note:** the event stream is served from `events.voip.ovh.net` (authenticated by the generated
> token), a different host from the signed OVH API. Your n8n instance must be able to reach it.

## Multi-region support

Pick your region when creating the credential. Each region has its own API endpoint:

| Region | Endpoint |
| --- | --- |
| OVH Europe | `https://eu.api.ovh.com/1.0` |
| OVH Canada | `https://ca.api.ovh.com/1.0` |
| OVH US | `https://api.us.ovhcloud.com/1.0` |
| So You Start Europe | `https://eu.api.soyoustart.com/1.0` |
| So You Start Canada | `https://ca.api.soyoustart.com/1.0` |
| Kimsufi Europe | `https://eu.api.kimsufi.com/1.0` |
| Kimsufi Canada | `https://ca.api.kimsufi.com/1.0` |

## Installation

### Community Nodes (recommended)

For [self-hosted n8n](https://docs.n8n.io/hosting/), install directly from the editor UI:

1. Go to **Settings → Community Nodes**.
2. Select **Install**.
3. Enter `@ovhcloud/n8n-nodes-ovh` as the npm package name.
4. Agree to the risks and select **Install**.

See the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
for details.

### Manual (npm)

```bash
npm install @ovhcloud/n8n-nodes-ovh
```

### Docker

Add the package to your n8n container, for example via the
[`N8N_COMMUNITY_PACKAGES`](https://docs.n8n.io/integrations/community-nodes/installation/) mechanism
or by extending your image:

```dockerfile
FROM n8nio/n8n
RUN npm install -g @ovhcloud/n8n-nodes-ovh
```

## Credentials

This node authenticates against the OVH API using an **Application Key**, **Application Secret**,
and **Consumer Key**.

### 1. Generate your API keys

1. Open the OVH token-creation page for your region:
   - Europe: <https://eu.api.ovh.com/createToken/>
   - Canada: <https://ca.api.ovh.com/createToken/>
   - US: <https://api.us.ovhcloud.com/createToken/>
2. Sign in with your OVHcloud account.
3. Set the validity and the **access rights** the node needs (see below).
4. Submit to receive your **Application Key**, **Application Secret**, and **Consumer Key**.

### 2. Required access rights

Grant the rights matching the resources you intend to use. To enable everything:

```text
GET, POST, PUT, DELETE   /zimbra/*
GET, POST                /sms/*
GET, POST, PUT, DELETE   /telephony/*
GET                      /auth/time
```

Scope these down to only the paths you need for a least-privilege setup.

### 3. Configure the credential in n8n

1. Create a new **OVH API** credential.
2. Choose your **Endpoint** (region).
3. Paste the **Application Key**, **Application Secret**, and **Consumer Key**.
4. Save — n8n verifies connectivity against `GET /auth/time`.

## Usage

1. Add the **OVH** node to a workflow.
2. Select your **OVH API** credential.
3. Choose a **Resource** (Mailbox, SMS, or VoIP) and an **Operation**.
4. Fill in the parameters — dynamic dropdowns load available platforms, mailboxes, phone lines,
   voicemails, and so on from your account.

**Example — send an SMS:** select resource **SMS**, operation **Send SMS**, pick your SMS service
from the dropdown, then set **To** and **Message**.

**Example — react to calls:** add the **OVH Trigger** node as your workflow's starting point,
select your **OVH API** credential and a **Billing Account**, and optionally narrow the **Events**
(e.g. only *Start Ringing*). The workflow then runs for each matching call event.

If you are new to n8n, the [Try it out](https://docs.n8n.io/try-it-out/) guide is a good starting
point.

## Examples

Ready-to-import workflow examples live in [`examples/`](examples/README.md), each combining the
OVH nodes with native n8n nodes:

- [Incoming call → SMS alert](examples/01-incoming-call-sms-alert.md) — OVH Trigger + Filter + SMS Send
- [Mailbox onboarding](examples/02-mailbox-onboarding.md) — Create Mailbox → Alias → Redirection
- [Scheduled voicemail cleanup](examples/03-scheduled-voicemail-cleanup.md) — Schedule + Loop + IF
- [SMS delivery check](examples/04-sms-delivery-check.md) — Send → Wait → Get Outgoing + IF

Copy an example's JSON and use **Import from Clipboard** in n8n, then select your OVH credential.

## Compatibility

- Requires a self-hosted n8n instance with community nodes enabled.
- Built against n8n node API version 1.
- Uses Node.js 20+ (as required by current n8n releases).

## Development

```bash
npm run build      # compile TypeScript to dist/ and copy icons
npm run dev        # watch mode against a local n8n
npm run lint       # n8n community-node lint rules
npm run lint:fix   # auto-fix lint issues
```

Only the compiled `dist/` directory is published to npm.

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) before
opening a pull request. All commits must be signed off under the
[Developer Certificate of Origin](CONTRIBUTING.md#developer-certificate-of-origin-dco)
(`git commit -s`).

- [Maintainers](MAINTAINERS)
- [Contributors](CONTRIBUTORS)
- [Authors](AUTHORS)

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [OVHcloud API console](https://api.ovh.com/console/)
- [Create OVH API keys](https://api.ovh.com/createToken/)

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
Copyright 2026 OVH SAS. See the [LICENSE](LICENSE) file for details.

## Version history

### 0.1.0

- Initial release.
