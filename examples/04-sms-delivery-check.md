# SMS delivery check

Send an SMS, wait, then look up its delivery status and branch on the result.

**Nodes used:** `Manual Trigger` (native) · `Wait` (native) · `IF` (native) · `No Operation` (native) ·
`OVH` (SMS → Send, Get Outgoing)

## How it works

1. **Manual Trigger** starts the run.
2. **Send SMS** sends the message. The response contains an `ids` array — the outgoing
   message IDs.
3. **Wait 30s** gives the network time to deliver and report back.
4. **Get Outgoing** fetches the sent message using the first id from the send step
   (`{{ $('Send SMS').item.json.ids[0] }}`); its `deliveryReceipt` field carries the status.
5. **IF delivered** branches on `deliveryReceipt == 1` (delivered) into two No-Op endpoints —
   replace those with your own follow-up (log, alert, retry…).

## Prerequisites

- An **OVH API** credential in n8n and an **SMS service**.
- Replace `REPLACE_sms_service`, the `to` number, and the credential id. Adjust the
  `deliveryReceipt` code if your account uses different status values.

## Import

Copy the JSON → **Workflows → Import from Clipboard** → set the **OVH account** credential on
the OVH nodes.

> Targets current n8n (Wait v1.1, IF v2).

```json
{
  "name": "OVH — SMS delivery check",
  "nodes": [
    {
      "parameters": {},
      "id": "manual04",
      "name": "When clicking Test",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "resource": "sms",
        "operation": "send",
        "serviceName": "REPLACE_sms_service",
        "sender": "OVH",
        "to": "+33600000000",
        "message": "Delivery test from n8n"
      },
      "id": "send04",
      "name": "Send SMS",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [440, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    },
    {
      "parameters": { "amount": 30, "unit": "seconds" },
      "id": "wait04",
      "name": "Wait 30s",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [660, 300],
      "webhookId": "ovh-sms-delivery-wait"
    },
    {
      "parameters": {
        "resource": "sms",
        "operation": "getOutgoing",
        "serviceName": "REPLACE_sms_service",
        "outgoingId": "={{ $('Send SMS').item.json.ids[0] }}"
      },
      "id": "getout04",
      "name": "Get Outgoing",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [880, 300],
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
              "id": "cond-delivered",
              "leftValue": "={{ $json.deliveryReceipt }}",
              "rightValue": 1,
              "operator": { "type": "number", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "if04",
      "name": "IF delivered",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1100, 300]
    },
    {
      "parameters": {},
      "id": "ok04",
      "name": "Delivered",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [1320, 220]
    },
    {
      "parameters": {},
      "id": "ko04",
      "name": "Not Delivered",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [1320, 380]
    }
  ],
  "connections": {
    "When clicking Test": { "main": [[{ "node": "Send SMS", "type": "main", "index": 0 }]] },
    "Send SMS": { "main": [[{ "node": "Wait 30s", "type": "main", "index": 0 }]] },
    "Wait 30s": { "main": [[{ "node": "Get Outgoing", "type": "main", "index": 0 }]] },
    "Get Outgoing": { "main": [[{ "node": "IF delivered", "type": "main", "index": 0 }]] },
    "IF delivered": {
      "main": [
        [{ "node": "Delivered", "type": "main", "index": 0 }],
        [{ "node": "Not Delivered", "type": "main", "index": 0 }]
      ]
    }
  },
  "settings": { "executionOrder": "v1" },
  "active": false,
  "pinData": {}
}
```
