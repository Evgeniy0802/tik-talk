import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	input,
	Renderer2,
	ViewChild
} from '@angular/core'
import { MessageInputComponent } from '../../../ui'
import {
	debounceTime,
	firstValueFrom,
	fromEvent,
	Subject,
	takeUntil,
	timer
} from 'rxjs'
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component'
import { Chat, ChatsService } from '@tt/data-access/chats'

@Component({
	selector: 'app-chat-workspace-messages-wrapper',
	standalone: true,
	imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
	templateUrl: './chat-workspace-messages-wrapper.component.html',
	styleUrl: './chat-workspace-messages-wrapper.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent {
	chatsService = inject(ChatsService)
	hostElement = inject(ElementRef) //нужна для того чтобы мы рендерелись на абсолютно разных платформах
	r2 = inject(Renderer2)
	private destroy$ = new Subject<void>()

	chat = input.required<Chat>() //здесь накапливаем

	messages = this.chatsService.groupedActiveChatMessages

	async onSendMessage(messageText: string) {
		this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id)
		// await firstValueFrom(
		// 	this.chatsService.sendMessage(this.chat().id, messageText)
		// )
		//отправил сообщение
		//await firstValueFrom(this.chatsService.getChatById(this.chat().id))
		//полуил все сообщения чтобы все новое отрендерилось
	}

	ngAfterViewInit() {
		this.resizeFeedChat()

		fromEvent(window, 'resize')
			.pipe(debounceTime(300), takeUntil(this.destroy$))
			.subscribe(() => {
				console.log(123)
			})
	}

	resizeFeedChat() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}

	private newMessagesTimer() {
		timer(0, 400000) // Этот таймер является "триггером" для запуска запроса к серверу через равные интервалы
			.pipe(takeUntil(this.destroy$)) //завершиение подписки
			.subscribe(async () => {
				await firstValueFrom(this.chatsService.getChatById(this.chat().id)) //промис ждёт пока не придёт ответ от сервера
				//Подписывает компонент на поток таймера. Каждый раз, когда таймер тикает раз в 10 секунд, выполняется код внутри этой функции.
			})
	}

	constructor() {
		this.newMessagesTimer() //запускаем тайимер для загрузки новых сообщений
	}

	@ViewChild('messageContainer')
	//// Эта строка значит надо найти в моем шаблоне элемент с именем messageContainer и дай мне доступ к нему через переменную this.messageContainer.
	messageContainer!: ElementRef //Предоставляет прямой доступ к нативному элементу DOM

	private scrollToBottom(): void {
		try {
			this.messageContainer!.nativeElement.scrollTop = //возвращает количество пикселей, на которое контент элемента был прокручен сверху
				this.messageContainer!.nativeElement.scrollHeight //возвращает полную высоту элемента
			//присваем значение scrollTop к scrollHeight перемещает полусу прокрутки в самую нижнюю позицию
			//выполняет прокрутку
		} catch (err) {
			console.error('Ошибка при скролле:', err)
		}
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom()
		// срабатывает каждый раз, когда Angular завершает проверку представлений компонента. Это гарантирует, что прокрутка произойдет после того как все новые данные (соощения) будут добавлены в DOM и изменят высоту контейнера.
	}

	// getGroupMessages() {
	// 	const messagesArray = this.messages()
	// 	const saveGroupMessages = new Map<string, Message[]>() // Инициализация Map для хранения сгруппированных сообщений.
	// 	//Map можно представить как словарь или книгу контактов вы ищете что-то по ключу имени и получаете значение номер телефона.
	//
	// 	//Определение дат сегодня и Вчера с помощью luxon
	// 	//startOf('day') обнуляет время  для корректного сравнения
	// 	const today = DateTime.now().startOf('day') //исходим от 00
	// 	const yesterday = today.minus({ days: 1 })
	//
	// 	// Перебор всех сообщений в исходном массиве
	// 	messagesArray.forEach((message: Message) => {
	// 		// Преобразование строки даты сообщения в объект DateTime
	// 		const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' }) //нулевая зона, обнуляем время
	// 			.setZone(DateTime.local().zone) //берет время сообщения которое пришло с сервера в UTC и пересчитывает его под часовой пояс твоего компьютера
	// 			.startOf('day') //округлить дату, до начала определенного периода
	//
	// 		// Определение метки для текущей даты сообщения
	// 		let dateLabel: string
	// 		if (messageDate.equals(today)) {
	// 			//messageDate обнулил до начала дня, today тоже так же.
	// 			dateLabel = 'Сегодня' //equals() если месяц и день и год у них совпали, значит отправленно сегодня
	// 		} else if (messageDate.equals(yesterday)) {
	// 			dateLabel = 'Вчера'
	// 		} else {
	// 			// Для остальных дней форматируем дату в формат 'dd.MM.yyyy' с помощью toFormat
	// 			dateLabel = messageDate.toFormat('DD')
	// 		}
	//
	// 		// Добавление сообщения в соответствующую группу
	// 		if (saveGroupMessages.has(dateLabel)) {
	// 			//has  просто проверяет, существует ли уже запись (ключ) с таким именем
	// 			// Если группа уже существует, добавляем сообщение в неё
	// 			saveGroupMessages.get(dateLabel)!.push(message) //get используется для того, чтобы достать само значение, связанное с ключом, который вы указали.
	// 		} else {
	// 			// Если группа не существует, создаём её с текущим сообщением
	// 			saveGroupMessages.set(dateLabel, [message])
	// 		}
	// 	})
	//
	// 	return Array.from(saveGroupMessages.entries()) //возвращаем массив пар дата сообщения
	// }
}
