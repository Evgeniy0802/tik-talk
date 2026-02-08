import { Component, HostBinding, input } from '@angular/core'
import { Message } from '../../../../data'
import { DatePipe } from '@angular/common'
import {AvatarCircleComponent} from "@tt/common-ui";

@Component({
	selector: 'app-chat-workspace-message',
	imports: [AvatarCircleComponent, DatePipe],
	templateUrl: './chat-workspace-message.component.html',
	styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
	message = input.required<Message>()

	@HostBinding('class.is-mine')
	get isMine() {
		return this.message().isMine
	}
}
