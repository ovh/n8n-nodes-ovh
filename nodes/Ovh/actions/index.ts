import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
	list,
	get,
	create,
	rename,
	changePassword,
	deleteMailbox,
	listAliases,
	createAlias,
	deleteAlias,
	listRedirections,
	createRedirection,
	deleteRedirection,
} from './mailbox';
import {
	send,
	listIncoming,
	listOutgoing,
	getIncoming,
	getOutgoing,
	deleteIncoming,
	deleteOutgoing,
	getAccount,
	sendBatch,
} from './sms';
import {
	click2call,
	blockLine,
	unblockLine,
	listVoicemails,
	deleteVoicemail,
	getVoicemailTranscript,
	getConsumption,
	configureVxml,
	getVoicemail,
	listLines,
	getLine,
	listVoicemailMessages,
	getVoicemailMessage,
	listCalls,
	hangupCall,
	holdCall,
	transferCall,
} from './voip';
import { listDomains, getDomain } from './domain';

export async function router(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const resource = this.getNodeParameter('resource', i) as string;
	const operation = this.getNodeParameter('operation', i) as string;

	if (resource === 'mailbox') {
		switch (operation) {
			case 'list':
				return await list.call(this, i);
			case 'get':
				return await get.call(this, i);
			case 'create':
				return await create.call(this, i);
			case 'rename':
				return await rename.call(this, i);
			case 'changePassword':
				return await changePassword.call(this, i);
			case 'delete':
				return await deleteMailbox.call(this, i);
			case 'listAliases':
				return await listAliases.call(this, i);
			case 'createAlias':
				return await createAlias.call(this, i);
			case 'deleteAlias':
				return await deleteAlias.call(this, i);
			case 'listRedirections':
				return await listRedirections.call(this, i);
			case 'createRedirection':
				return await createRedirection.call(this, i);
			case 'deleteRedirection':
				return await deleteRedirection.call(this, i);
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"`,
					{ itemIndex: i },
				);
		}
	}

	if (resource === 'sms') {
		switch (operation) {
			case 'send':
				return await send.call(this, i);
			case 'listIncoming':
				return await listIncoming.call(this, i);
			case 'listOutgoing':
				return await listOutgoing.call(this, i);
			case 'getIncoming':
				return await getIncoming.call(this, i);
			case 'getOutgoing':
				return await getOutgoing.call(this, i);
			case 'deleteIncoming':
				return await deleteIncoming.call(this, i);
			case 'deleteOutgoing':
				return await deleteOutgoing.call(this, i);
			case 'getAccount':
				return await getAccount.call(this, i);
			case 'sendBatch':
				return await sendBatch.call(this, i);
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"`,
					{ itemIndex: i },
				);
		}
	}

	if (resource === 'voip') {
		switch (operation) {
			case 'click2call':
				return await click2call.call(this, i);
			case 'blockLine':
				return await blockLine.call(this, i);
			case 'unblockLine':
				return await unblockLine.call(this, i);
			case 'listVoicemails':
				return await listVoicemails.call(this, i);
			case 'getVoicemail':
				return await getVoicemail.call(this, i);
			case 'deleteVoicemail':
				return await deleteVoicemail.call(this, i);
			case 'getVoicemailTranscript':
				return await getVoicemailTranscript.call(this, i);
			case 'getConsumption':
				return await getConsumption.call(this, i);
			case 'configureVxml':
				return await configureVxml.call(this, i);
			case 'listLines':
				return await listLines.call(this, i);
			case 'getLine':
				return await getLine.call(this, i);
			case 'listVoicemailMessages':
				return await listVoicemailMessages.call(this, i);
			case 'getVoicemailMessage':
				return await getVoicemailMessage.call(this, i);
			case 'listCalls':
				return await listCalls.call(this, i);
			case 'hangupCall':
				return await hangupCall.call(this, i);
			case 'holdCall':
				return await holdCall.call(this, i);
			case 'transferCall':
				return await transferCall.call(this, i);
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"`,
					{ itemIndex: i },
				);
		}
	}

	if (resource === 'domain') {
		switch (operation) {
			case 'list':
				return await listDomains.call(this, i);
			case 'get':
				return await getDomain.call(this, i);
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"`,
					{ itemIndex: i },
				);
		}
	}

	throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`, {
		itemIndex: i,
	});
}
