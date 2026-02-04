import { Component, input, signal } from '@angular/core'
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component'
import {
	Chat,
	LastMessageRes,
	Message
} from '../../../data/interfaces/chats.interface'
import { DatePipe } from '@angular/common'

@Component({
	selector: 'button[chats]', //будет такой компонент если chats будет там
	imports: [AvatarCircleComponent, DatePipe],
	templateUrl: './chats-btn.component.html',
	styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
	chat = input<LastMessageRes>()

	async ngOnInit() {
		this.chat()!.unreadMessages
	}
}
