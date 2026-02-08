import { Component, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import {ClickDirective, ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/data-access/profiles";

@Component({
	selector: 'app-sidebar',
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
	styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
	profileService = inject(ProfileService)

	me = this.profileService.me

	// Переменная для управления видимостью кнопки "Выход"
	fileLogout: boolean = false
	photoSide: boolean = false

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

	//получаем себя
	ngOnInit() {
		firstValueFrom(this.profileService.getMe())
	}

	// Метод, который будет вызываться директивой для обновления состояния
	onSowStatus(value: boolean) {
		this.fileLogout = value
	}

	onShowLogoTik(value: boolean) {
		this.photoSide = value
	}
}
