import {ChatWsMessage} from "./chat-ws-message.interface";
import {Observable}    from "rxjs";

export interface ChatConnectionWsParams {
    url: string,
    token: string,
    handleMessage: (message: ChatWsMessage) => void, //функци что делать с сообщениями
}

export interface ChatWsService {
    connect: (params: ChatConnectionWsParams) => void | Observable<ChatWsMessage> //создали канал функйия которая ничего не принимает и ничего не возвращает
    sendMessage: (text: string, chatId: number) => void //метод для отправки сообщений
    disconnect: () => void //дисконект
}

//наследование в JS