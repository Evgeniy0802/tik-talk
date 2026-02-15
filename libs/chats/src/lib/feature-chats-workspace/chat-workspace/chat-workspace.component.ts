import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {filter, of, switchMap} from 'rxjs'
import { AsyncPipe } from '@angular/common'
import {ChatWorkspaceMessagesWrapperComponent} from "./chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component";
import {ChatWorkspaceHeaderComponent} from "./chat-workspace-header/chat-workspace-header.component";
import {ChatsService} from "@tt/data-access/chats";

@Component({
	selector: 'app-chat-workspace',
	imports: [
		ChatWorkspaceHeaderComponent,
		ChatWorkspaceMessagesWrapperComponent,
		AsyncPipe
	],
	templateUrl: './chat-workspace.component.html',
	styleUrl: './chat-workspace.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceComponent {
	route = inject(ActivatedRoute)
	chatsService = inject(ChatsService)
	router = inject(Router)

	activeChat$ = this.route.params.pipe(
		switchMap(({ id }) => { //деструктуризируем, распаковываем id
			if (id === 'new') { //если id тогда мы берем querryParametrs создаём новый чат
				return this.route.queryParams.pipe(
					filter(({userId}) => userId),
					switchMap(({userId}) => {
						return this.chatsService.createChat(userId).pipe(
							switchMap(chat => {
								this.router.navigate(['chats', chat.id]) //перенаправляемся с id этого чата на чат
								return of(null)
							})
						)
					})
				)
			}
			return this.chatsService.getChatById(id)
		})
	)
}
