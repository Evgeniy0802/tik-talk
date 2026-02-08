import { Component, Input } from '@angular/core'
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {Profile} from "@tt/data-access/profiles";

@Component({
	selector: 'app-profile-card',
	imports: [ImgUrlPipe, SvgIconComponent],
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
	@Input() profile!: Profile
}
