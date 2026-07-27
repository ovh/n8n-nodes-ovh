# Example workflows

Ready-to-import n8n workflows that show the `@ovhcloud/n8n-nodes-ovh` nodes working alongside
native n8n nodes (Filter, IF, Loop, Wait, Schedule…).

| Example | What it demonstrates |
| --- | --- |
| [Incoming call → SMS alert](01-incoming-call-sms-alert.md) | OVH Trigger + Filter + SMS Send |
| [Mailbox onboarding](02-mailbox-onboarding.md) | Create Mailbox → Alias → Redirection (chained) |
| [Scheduled voicemail cleanup](03-scheduled-voicemail-cleanup.md) | Schedule + Loop + IF + voicemail ops |
| [SMS delivery check](04-sms-delivery-check.md) | Send → Wait → Get Outgoing + IF branch |

## How to import

1. Open an example file and copy the JSON block.
2. In n8n, go to **Workflows**, then the **⋯** menu → **Import from Clipboard**, and paste.
3. Open each **OVH** / **OVH Trigger** node and select your **OVH API** credential
   (the JSON ships a placeholder credential reference).
4. Replace the `REPLACE_...` placeholders (billing account, SMS service, platform id, phone
   numbers, etc.) with your real values.
