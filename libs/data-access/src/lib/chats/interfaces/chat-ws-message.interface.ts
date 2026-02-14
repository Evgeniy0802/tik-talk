export interface ChatWsMessageBase {
    status: 'success' | 'error'
}

export interface ChatWsUnreadMessage extends ChatWsMessageBase {
    //extends ChatWsMessageBase озночает что поле статус у нас тут есть можем не писать
    action: 'unread',
    data: {
        count: number
    }
}

export interface ChatWsNewMessage extends ChatWsMessageBase {
    action: 'message',
    data: {
        id: number,
        message: string,
        chat_id: number,
        created_at: string,
        author: number
    }
}

export interface ChatWsError extends ChatWsMessageBase {
    message: string
}

export interface ChatWsSendMessage {
    text: string,
    chat_id: number,
}

//создаём тип и он будет равен любому из этих сообщений
export type ChatWsMessage = ChatWsUnreadMessage | ChatWsNewMessage | ChatWsError | ChatWsSendMessage | ChatWsMessageBase