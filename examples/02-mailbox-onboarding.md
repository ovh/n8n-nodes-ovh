# Mailbox onboarding

Provision a new email account in one run: create the **mailbox**, add an **alias**, and set
up a **redirection** — all on the same Zimbra platform.

**Nodes used:** `Manual Trigger` (native) · `OVH` (Mailbox → Create Mailbox, Create Alias, Create Redirection)

## How it works

1. **Manual Trigger** starts the run (swap for a Form or Webhook trigger to onboard from a form).
2. **Create Mailbox** creates the account. Offer, slot and password are required by the API.
3. **Create Alias** adds an alias that points at the freshly created account — its `targetId`
   references the create step's returned account id (`{{ $json.id }}`).
4. **Create Redirection** forwards mail from the new address to a manager.

## Prerequisites

- An **OVH API** credential in n8n.
- A Zimbra **platform** and an available **slot** on it.
- After importing, replace `REPLACE_platform_id`, `REPLACE_slot_id`, `REPLACE_password`, the
  email addresses, and the credential id. Confirm the Create Mailbox response exposes `id`
  (adjust the alias `targetId` expression if your platform returns a task instead).

## Import

Copy the JSON → **Workflows → Import from Clipboard** → set your **OVH account** credential on
each OVH node.

```json
{
  "name": "OVH — Mailbox onboarding",
  "nodes": [
    {
      "parameters": {},
      "id": "manual02",
      "name": "When clicking Test",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "resource": "mailbox",
        "operation": "create",
        "platformId": "REPLACE_platform_id",
        "newEmail": "newuser@example.com",
        "offer": "STARTER",
        "slotId": "REPLACE_slot_id",
        "password": "REPLACE_password",
        "additionalFields": {
          "firstName": "New",
          "lastName": "User",
          "displayName": "New User"
        }
      },
      "id": "createmb02",
      "name": "Create Mailbox",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [460, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    },
    {
      "parameters": {
        "resource": "mailbox",
        "operation": "createAlias",
        "platformId": "REPLACE_platform_id",
        "alias": "sales@example.com",
        "targetId": "={{ $json.id }}"
      },
      "id": "createalias02",
      "name": "Create Alias",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [680, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    },
    {
      "parameters": {
        "resource": "mailbox",
        "operation": "createRedirection",
        "platformId": "REPLACE_platform_id",
        "source": "newuser@example.com",
        "destination": "manager@example.com"
      },
      "id": "createredir02",
      "name": "Create Redirection",
      "type": "@ovhcloud/n8n-nodes-ovh.ovh",
      "typeVersion": 1,
      "position": [900, 300],
      "credentials": {
        "ovhApi": { "id": "REPLACE_ME", "name": "OVH account" }
      }
    }
  ],
  "connections": {
    "When clicking Test": { "main": [[{ "node": "Create Mailbox", "type": "main", "index": 0 }]] },
    "Create Mailbox": { "main": [[{ "node": "Create Alias", "type": "main", "index": 0 }]] },
    "Create Alias": { "main": [[{ "node": "Create Redirection", "type": "main", "index": 0 }]] }
  },
  "settings": { "executionOrder": "v1" },
  "active": false,
  "pinData": {}
}
```
