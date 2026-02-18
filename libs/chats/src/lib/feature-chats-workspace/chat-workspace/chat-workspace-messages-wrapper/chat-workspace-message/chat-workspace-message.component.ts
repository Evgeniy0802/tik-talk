import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	input
} from '@angular/core'
import { AvatarCircleComponent } from '@tt/common-ui'
import { Message } from '@tt/data-access/chats'
import { DateTime } from 'luxon'

@Component({
	selector: 'app-chat-workspace-message',
	standalone: true,
	imports: [AvatarCircleComponent],
	templateUrl: './chat-workspace-message.component.html',
	styleUrl: './chat-workspace-message.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent {
	message = input.required<Message>()

	@HostBinding('class.is-mine')
	get isMine() {
		return this.message().isMine
	}

	formatTime(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }) //предпологаем что исходная дата в utc
			//превращаем в объект со времнем, сразу в utc указываем
			.setZone(DateTime.local().zone) //устанавливаем зону поумолчанию для браузера
			//пересчитываем время, в то которое установленно на компьютере у нас
			.setLocale(locale)
		//правила вывода для нашего региона
		return date.toFormat('HH:mm')
		//подсмотрел у антона, а то у меня были проблемы со временем в сообщениях
	}
}
