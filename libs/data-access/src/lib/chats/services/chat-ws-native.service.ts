//будет реализация на js
import {ChatConnectionWsParams, ChatWsService} from "../interfaces/chat-ws-service.interface";

export class ChatWsNativeService implements ChatWsService {

    #socket: WebSocket | null = null; //отвечает за сокет, приватная пременная в ts

    connect(params: ChatConnectionWsParams) {
        //если конект дёрнут несколько раз из разных мест, то новый сокет не будет создаваться
        if (this.#socket) return

        this.#socket = new WebSocket(params.url, [params.token])
        //подключили к сокету, второй аргумент авторизационный массив

        //реагируем на приходящие сообщения
        this.#socket.onmessage = (event: MessageEvent) => {
            params.handleMessage(JSON.parse(event.data)); //event.data лежит сообщение которое нам андрей присылает
            //TODO обработка сообщений event.data
        }

        this.#socket.onclose = () => {
            //когда конект закрываетя что делать на конце
            console.log(`А чё вы это тут делаете, кино то давно уже кончилось`)
        }
    }

    sendMessage(text: string, chatId: number) {
        this.#socket?.send(
            //отправляем и принимаем строкиЮ нужно сделать jsonStringiFy
            JSON.stringify({
                text,
                chatId: chatId
            })
        )
    }

    disconnect() {
        this.#socket?.close()
    }
}