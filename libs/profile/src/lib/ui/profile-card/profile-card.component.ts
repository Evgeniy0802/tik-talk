import { Component, Input } from '@angular/core'
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {Profile} from "@tt/interfaces/profile";

@Component({
	selector: 'app-profile-card',
	imports: [ImgUrlPipe, SvgIconComponent],
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
	@Input() profile!: Profile
}
