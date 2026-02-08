import { Component, Input } from '@angular/core'
import {ImgUrlPipe} from "@tt/common-ui";
import {Profile} from "@tt/data-access/profiles";

@Component({
	selector: 'app-subscriber-card',
	imports: [ImgUrlPipe],
	templateUrl: './subscriber-card.component.html',
	styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
	//принимает инпут параметром профиль
	@Input() profile!: Profile
}
