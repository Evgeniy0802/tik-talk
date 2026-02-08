import { Component, inject } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { AsyncPipe } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { map, startWith, switchMap } from 'rxjs'
import {SvgIconComponent} from "@tt/common-ui";
import {ChatsBtnComponent} from "../chats-btn/chats-btn.component";
import {ChatsService} from "@tt/data-access/chats";

@Component({
	selector: 'app-chats-list',
	imports: [
		ChatsBtnComponent,
		ReactiveFormsModule,
		AsyncPipe,
		RouterLink,
		RouterLinkActive,
		SvgIconComponent
	],
	templateUrl: './chats-list.component.html',
	styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent {
	chatsService = inject(ChatsService)

	filterChatsControl = new FormControl('') //делаем контрол вне формы

	chats$ = this.chatsService
		.getMyChats() //запросили все чаты
		//приобразуем к другому стриму
		.pipe(
			switchMap((chats) => {
				return (
					this.filterChatsControl.valueChanges //сменили стрим и подписались на изменения контрола в инпуте
						//когда контрол изменяется мы получается можем оперировать обоими значениями и чатами и значением того, что контрол дал
						.pipe(
							startWith(''), //изначально чато нет
							map((inputValue) => {
								//изменяем значение стрима, на отфильтрованные чаты
								return chats.filter((chat) => {
									return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
										.toLowerCase()
										.includes(inputValue!.toLowerCase() ?? '')
									//отфиртовали чаты, чтобы их можно было искать в инпуте по имени и фамилии
								})
							})
						)
				)
			})
		)
}
