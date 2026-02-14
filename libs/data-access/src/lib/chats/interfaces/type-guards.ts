import {ChatWsMessage, ChatWsNewMessage, ChatWsUnreadMessage} from "../interfaces/chat-ws-message.interface";

export function isUnreadMessage(message: ChatWsMessage): message is ChatWsUnreadMessage {
    //пишем условие которое сузит тип, пишем то условие по которому можно определить что это будет ChatWsUnreadMessage
    return 'action' in message && message.action === 'unread'
}

export function isNewMessage(message: ChatWsMessage): message is ChatWsNewMessage {
    return 'action' in message && message.action === 'message'
}

export function  isErrMessage(message: ChatWsMessage): message is ChatWsNewMessage {
    return 'action' in message && message.status === 'error'
}
