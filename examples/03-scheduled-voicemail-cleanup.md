# Scheduled voicemail cleanup

Every night, loop over the messages in a voicemail and delete the short/empty ones
(duration under 3 seconds). A good template for age- or content-based cleanup.

**Nodes used:** `Schedule Trigger` (native) · `Split In Batches` / loop (native) · `IF` (native) ·
`OVH` (VoIP → List/Get Voicemail Message, Delete Voicemail)

## How it works

1. **Schedule Trigger** fires daily at 03:00.
2. **List Voicemail Messages** returns the message IDs of a voicemail (each item is `{ value: <id> }`).
3. **Loop Over Messages** (Split In Batches) walks them one by one.
4. **Get Voicemail Message** fetches a message's details, including `duration` and `creationDatetime`.
5. **IF short message** keeps messages with `duration < 3`. Swap this for a `creationDatetime`
   comparison (e.g. older than 30 days) for age-based cleanup.
6. **Delete Voicemail** removes matching messages; both branches loop back to the batch node.

## Prerequisites

- An **OVH API** credential in n8n.
- A telephony **billing account** and a **voicemail** service number.
- Replace `REPLACE_billing_account`, `REPLACE_voicemail_number`, and the credential id.

## Import

Copy the JSON → **Workflows → Import from Clipboard** → set the **OVH account** credential on
the OVH nodes.

> Targets current n8n (Schedule Trigger v1.2, Split In Batches v3, IF v2). On older instances
> re-pick the IF condition and the loop wiring if needed.

```json
{
  "name": "OVH — Scheduled voicemail cleanup",
  "nodes": [
    {
      "parameters": {
        "rule": { "interval": [{ "field": "days", "triggerAtHour": 3 }] }
      },
      "id": "schedule03",
      "name": "Every night",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [220, 300]
    },
    {
      "parameters": {
        "resource": "voip",
        "operation": "listVoicemailMessages",
        "billingAccount": "REPLACE_billing_account",
        "voicemailNumber": "REPLACE_voicemail_number",
        "returnAll": true
      },
      "id": "listmsgs03",
      "name": "List Voicemail Messages",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [440, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    },
    {
      "parameters": { "batchSize": 1, "options": {} },
      "id": "loop03",
      "name": "Loop Over Messages",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [660, 300]
    },
    {
      "parameters": {
        "resource": "voip",
        "operation": "getVoicemailMessage",
        "billingAccount": "REPLACE_billing_account",
        "voicemailNumber": "REPLACE_voicemail_number",
        "messageId": "={{ $json.value }}"
      },
      "id": "getmsg03",
      "name": "Get Voicemail Message",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [880, 400],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "loose", "version": 2 },
          "conditions": [
            {
              "id": "cond-short",
              "leftValue": "={{ $json.duration }}",
              "rightValue": 3,
              "operator": { "type": "number", "operation": "lt" }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "if03",
      "name": "IF short message",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1100, 400]
    },
    {
      "parameters": {
        "resource": "voip",
        "operation": "deleteVoicemail",
        "billingAccount": "REPLACE_billing_account",
        "voicemailNumber": "REPLACE_voicemail_number",
        "messageId": "={{ $json.id }}"
      },
      "id": "delmsg03",
      "name": "Delete Voicemail",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [1320, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    }
  ],
  "connections": {
    "Every night": { "main": [[{ "node": "List Voicemail Messages", "type": "main", "index": 0 }]] },
    "List Voicemail Messages": { "main": [[{ "node": "Loop Over Messages", "type": "main", "index": 0 }]] },
    "Loop Over Messages": {
      "main": [
        [],
        [{ "node": "Get Voicemail Message", "type": "main", "index": 0 }]
      ]
    },
    "Get Voicemail Message": { "main": [[{ "node": "IF short message", "type": "main", "index": 0 }]] },
    "IF short message": {
      "main": [
        [{ "node": "Delete Voicemail", "type": "main", "index": 0 }],
        [{ "node": "Loop Over Messages", "type": "main", "index": 0 }]
      ]
    },
    "Delete Voicemail": { "main": [[{ "node": "Loop Over Messages", "type": "main", "index": 0 }]] }
  },
  "settings": { "executionOrder": "v1" },
  "active": false,
  "pinData": {}
}
```
