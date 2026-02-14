import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {map, Observable} from 'rxjs'
import {ProfileService} from '../../profiles';
import { Message, Chat, LastMessageRes } from "../../chats";
import { ChatWsService } from "../interfaces/chat-ws-service.interface";
import {AuthService} from "../../auth";
import {ChatWsMessage} from "../interfaces/chat-ws-message.interface";
import {isNewMessage, isUnreadMessage} from "../interfaces/type-guards";
import {ChatWsRxjsService} from "../interfaces/chat-ws-rxjs.service";
import {DateTime} from "luxon";



@Injectable({
	providedIn: 'root'
})
export class ChatsService {
	#authService = inject(AuthService);
	http = inject(HttpClient)
	me = inject(ProfileService).me
	unreadMessageAmount = signal(0)

	//сделали поле wsAdapter в котором будет класс который будет отвечать за всю логику связанную с chat.ws.service
	wsAdapter: ChatWsService = new ChatWsRxjsService()

	//activeChatMessages = signal<Message[]>([])
	groupedActiveChatMessages = signal<[string, Message[]][]>([])

	baseApiUrl = 'https://icherniakov.ru/yt-course/'
	chatUrl = `${this.baseApiUrl}chat/`
	messageUrl = `${this.baseApiUrl}message/`

	connectWs() {
		//чтобы произошел конект придуаем параметры
		return this.wsAdapter.connect({
			url: `${this.baseApiUrl}chat/ws`,
			token: this.#authService.token ?? '',
			handleMessage: this.handleWsMessage
		}) as Observable<ChatWsMessage>
	}

	//TODO ЗАМЫКАНИЕ
	handleWsMessage = (message: ChatWsMessage) => { //новое сообщеие упало сюда, стрелочная функция контекст там где её создали
		if (!('action' in message)) return

		if (isUnreadMessage(message)) {
			this.unreadMessageAmount.set(message.data.count)
		}

		// if (isErrMessage(message)) {
		// 	console.log('Токен протух')
		// }


		//if (message.action === 'message') {
			//добавялем это сообщение в activeChatMessages
		if (isNewMessage(message)) {
			// this.activeChatMessages.set([
			// 	...this.activeChatMessages(), //расскалдываем на настоящие сообщения, сообщения имеют другие поля, мапим
			const isMine = message.data.author === this.me()?.id;
			const newMessages = {
				author: message.data.author,
				id: message.data.id,
				userFromId: message.data.author,
				personalChatId: message.data.chat_id,
				text: message.data.message,
				createdAt: message.data.created_at.replace('_', 'T') + 'Z',
				isRead: false,
				isMine: isMine,
				user: isMine ? this.me()! : ({} as any)
			}

		//])
			//получаем текущие сообщения
			const curMessage = this.groupedActiveChatMessages()

			//ищем сегоднюшню дату
			const todayDate = curMessage.find(([time]) => time === 'Сегодня')

			if (todayDate) {
				todayDate[1].push(newMessages) //добавляем сообщение в Сегодня
			} else {
				curMessage.push(['Сегодня', [newMessages]]) //создаём группу для Сегодня с новыми сообщениями
			}

			//обновляем сигнал с новыми данными
			this.groupedActiveChatMessages.set([...curMessage])
		}
	}

	createChat(userId: number) {
		return this.http.post<Chat>(`${this.chatUrl}${userId}`, {}) //посту всегда нужен body поэтому мы делаем пустой body
	}

	getMyChats() {
		return this.http.get<LastMessageRes[]>(`${this.chatUrl}get_my_chats/`)
	}

	getChatById(chatId: number) {
		return (
			this.http
				.get<Chat>(`${this.chatUrl}${chatId}`)
				//узнаём кто есть мы
				.pipe(
					map((chat) => {
						const patchMessages = chat.messages.map((message) => {
							return {
								//записываем измененный массив massage
								...message, //докидываем два поля
								user:
									chat.userFirst.id === message.userFromId
										? chat.userFirst
										: chat.userSecond,
								isMine: message.userFromId === this.me()?.id
							}
						})

						//группируем запатченные сообщения
						const groupedMessages = this.getGroupMessages(patchMessages)
						this.groupedActiveChatMessages.set(groupedMessages)
						//хотим получить чать по id, но мы на лету его mapим и превращаем в объект который нам интересен
						//добавляем в ответ два новых поля и в него закинули patchMessages

						return {
							//вернём чат в котором будет новое поле companion, которое мы выберем сами
							...chat,
							companion:
								chat.userFirst.id === this.me()!.id
									? chat.userSecond
									: chat.userFirst,
							//если первый user мы тогда companion userSecond, если первый user не мы, тогда первый use и есть companion
							messages: patchMessages
						}
					})
				)
		)
	}

	getGroupMessages(message: Message[]) {
		const groupTimeMessages = new Map<string, Message[]>()

		const today = DateTime.now().startOf('day')
		const yesterday = today.minus({ days: 1 })

		message.forEach((message) => {
			const messageDate = DateTime.fromISO(message.createdAt, {zone: 'utc'})
				.setZone(DateTime.local().zone)
				.startOf('day')

			let dateLabel: string
			if (messageDate.equals(today)) {
				dateLabel = 'Сегодня'
			} else if (messageDate.equals(yesterday)) {
				dateLabel = 'Вчера'
			} else {
				dateLabel = messageDate.toFormat('MM.dd.yyyy')
			}

			if (!groupTimeMessages.has(dateLabel)) {
				groupTimeMessages.set(dateLabel, [])
			}
			groupTimeMessages.get(dateLabel)?.push(message)
		})

		return Array.from(groupTimeMessages.entries())
	}

	sendMessage(chatId: number, message: string) {
		return this.http.post<Message>(
			`${this.messageUrl}send/${chatId}`,
			{},
			{
				params: {
					message
				}
			}
		)
	}
}
