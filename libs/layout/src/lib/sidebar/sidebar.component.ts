import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit
} from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { firstValueFrom, Subscription, timer } from 'rxjs'
import { ClickDirective, ImgUrlPipe, SvgIconComponent } from '@tt/common-ui'
import { ProfileService } from '@tt/data-access/profiles'
import { ChatsService } from '@tt/data-access/chats'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { isErrMessage } from '@tt/data-access/chats/interfaces/type-guards'
import { AuthService } from '@tt/data-access/auth'

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [
		SvgIconComponent,
		SubscriberCardComponent,
		RouterLink,
		AsyncPipe,
		ImgUrlPipe,
		RouterLinkActive,
		ClickDirective
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
	profileService = inject(ProfileService)
	authService = inject(AuthService)
	me = this.profileService.me
	#chatService = inject(ChatsService)
	unreadMessageAmount = this.#chatService.unreadMessageAmount
	destroyRef = inject(DestroyRef)

	wsSubscribe!: Subscription //мы можем положить любую подписку внутрь переменной и в этой переменной можно отписаться

	// Переменная для управления видимостью кнопки "Выход"
	fileLogout: boolean = false
	photoSide: boolean = false

	async reconnect() {
		console.log('Reconnecting...')
		await firstValueFrom(this.authService.refreshAuthToken()) //жду рефреша
		await new Promise((resolve) => setTimeout(resolve, 5000))
		//await firstValueFrom(timer(2000))//ждём когда обновится
		this.connectWsSide() //конекчу ws
	}

	connectWsSide(): void {
		this.wsSubscribe?.unsubscribe()
		this.wsSubscribe = this.#chatService
			.connectWs()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => {
				if (isErrMessage(message)) {
					console.log('Неверный токен')
					this.reconnect()
				}
			})
	}

	ngOnInit() {
		firstValueFrom(this.profileService.getMe())
		this.connectWsSide()
	}

	// constructor() {
	// 	this.#chatService.connectWs()
	// 		.pipe(takeUntilDestroyed())
	// 		.subscribe()
	// }

	subscribers$ = this.profileService.getSubscribersShortList()
	//если стрим значит нужен знак $

	menuItems = [
		{
			label: 'Моя страница',
			icon: 'home',
			link: 'profile/me'
		},
		{
			label: 'Сообщества',
			icon: 'communities',
			link: 'communities'
		},
		{
			label: 'Чаты',
			icon: 'chats',
			link: 'chats'
		},
		{
			label: 'Поиск',
			icon: 'search',
			link: 'search'
		}
	]

	// //получаем себя
	// ngOnInit() {
	// 	firstValueFrom(this.profileService.getMe())
	// }

	// Метод, который будет вызываться директивой для обновления состояния
	onSowStatus(value: boolean) {
		this.fileLogout = value
	}

	onShowLogoTik(value: boolean) {
		this.photoSide = value
	}
}
