import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core'
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {Profile} from "@tt/data-access/profiles";
import {Router} from "@angular/router";

@Component({
	selector: 'app-profile-card',
	imports: [ImgUrlPipe, SvgIconComponent],
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
	route = inject (Router)

	@Input() profile!: Profile

	async inSendMessage(userId: number) {
		this.route.navigate(['/chats', 'new'], {queryParams: {userId}})
	}

	async routePage(userId: number) {
		this.route.navigate(['/profile/', userId])
	}
}
