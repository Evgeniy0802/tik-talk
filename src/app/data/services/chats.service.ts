import {inject, Injectable, signal} from "@angular/core";
import {HttpClient}                 from "@angular/common/http";
import {Chat, LastMessageRes, Message} from "../interfaces/chats.interface";
import {ProfileService} from "./profile.service";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ChatsService {
    http = inject(HttpClient)
    me = inject(ProfileService).me

    activeChatMessages = signal<Message[]>([])

    baseApiUrl = 'https://icherniakov.ru/yt-course/'
    chatUrl = `${this.baseApiUrl}chat/`
    messageUrl = `${this.baseApiUrl}message/`

    createChat(userId: number) {
        return this.http.post<Chat>(`${this.chatUrl}${userId}`, {}) //посту всегда нужен body поэтому мы делаем пустой body
    }

    getMyChats() {
        return this.http.get<LastMessageRes[]>(`${this.chatUrl}get_my_chats/`)
    }

    getChatById(chatId: number) {
        return this.http.get<Chat>(`${this.chatUrl}${chatId}`)
        //узнаём кто есть мы
            .pipe(
                map(chat => {
                    const patchMessages = chat.messages.map(message => {
                        return {
                            ...message,
                            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                            isMine: message.userFromId === this.me()!.id
                        }
                    })

                    this.activeChatMessages.set(patchMessages)

                    return { //вернём чат в котором будет новое поле companion, которое мы выберем сами
                        ...chat,
                        companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
                        //если первый user мы тогда companion userSecond, если первый user не мы, тогда первый use и есть companion
                        messages: patchMessages
                    }
                })
            )
    }

    sendMessage(chatId: number, message: string) {
        return this.http.post<Message>(`${this.messageUrl}send/${chatId}`, {}, {
            params: {
                message
            }
        })
    }
}