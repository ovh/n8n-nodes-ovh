# Incoming call → SMS alert

Send yourself an SMS whenever one of your OVH telephony lines starts ringing.

**Nodes used:** `OVH Trigger` · `Filter` (native) · `OVH` (SMS → Send)

## How it works

1. **OVH Trigger** long-polls the OVH VoIP events server and emits one item per call
   event on the billing account.
2. **Filter** keeps only `start_ringing` events (the trigger delivers every event type;
   the event kind is in the capitalized `Event` field).
3. **Send SMS Alert** sends an SMS with the caller number (`Data.Calling`) and the line
   (`Ressource`) taken from the event payload.

## Prerequisites

- An **OVH API** credential in n8n.
- A telephony **billing account** and an **SMS service** on your account.
- Replace `REPLACE_billing_account`, `REPLACE_sms_service`, the `to` number, and the
  credential id after importing.

## Import

Copy the JSON below → in n8n open **Workflows → Import from Clipboard** (or the ⋯ menu →
*Import from Clipboard*) → paste → select your **OVH account** credential on the two OVH nodes.

> Targets current n8n (native node versions: Filter v2). If your instance is older, re-pick
> the Filter condition in the UI.

```json
{
  "name": "OVH — Incoming call SMS alert",
  "nodes": [
    {
      "parameters": {
        "billingAccount": "REPLACE_billing_account",
        "events": []
      },
      "id": "ovhtrigger01",
      "name": "OVH Trigger",
      "type": "@ovhcloud/n8n-nodes-ovh.ovhTrigger",
      "typeVersion": 1,
      "position": [260, 300],
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
              "id": "cond-ringing",
              "leftValue": "={{ $json.Event }}",
              "rightValue": "start_ringing",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "filter01",
      "name": "Only Start Ringing",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2,
      "position": [480, 300]
    },
    {
      "parameters": {
        "resource": "sms",
        "operation": "send",
        "serviceName": "REPLACE_sms_service",
        "sender": "OVH",
        "to": "+33600000000",
        "message": "=Incoming call from {{ $json.Data.Calling }} on {{ $json.Ressource }}"
      },
      "id": "sms01",
      "name": "Send SMS Alert",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [700, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    }
  ],
  "connections": {
    "OVH Trigger": { "main": [[{ "node": "Only Start Ringing", "type": "main", "index": 0 }]] },
    "Only Start Ringing": { "main": [[{ "node": "Send SMS Alert", "type": "main", "index": 0 }]] }
  },
  "settings": { "executionOrder": "v1" },
  "active": false,
  "pinData": {}
}
```
