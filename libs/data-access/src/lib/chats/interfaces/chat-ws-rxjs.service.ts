import {ChatConnectionWsParams, ChatWsService} from "../interfaces/chat-ws-service.interface";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {ChatWsMessage} from "../interfaces/chat-ws-message.interface";
import {webSocket}                 from "rxjs/webSocket";
import {finalize, Observable, tap} from "rxjs";

export class ChatWsRxjsService implements ChatWsService{
    #socket : WebSocketSubject<ChatWsMessage> | null = null;

    connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
        if (!this.#socket) {
            this.#socket = webSocket({ //на сокет надо подписываться, это просто observable в который мы видим что прилетает
                url: params.url,
                protocol: [params.token]
            })
        }

        return this.#socket.asObservable()
            .pipe(
                tap(message => params.handleMessage(message)),
                finalize(() => console.log('Кино закончилось')) //что делать на конце
            )
    }

    disconnect():void {
        this.#socket?.complete() //закрытие complet
    }

    sendMessage(text: string, chatId: number):void {
        this.#socket?.next({
            text,
            chat_id: chatId
        })
    }
}