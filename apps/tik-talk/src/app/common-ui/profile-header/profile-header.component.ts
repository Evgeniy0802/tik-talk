import { Component, input } from '@angular/core'
import {AvatarCircleComponent, ImgUrlPipe} from "@tt/common-ui";
import {Profile} from "@tt/profile";

@Component({
	selector: 'app-profile-header',
	imports: [ImgUrlPipe, AvatarCircleComponent],
	templateUrl: './profile-header.component.html',
	styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
	profile = input<Profile>()
	//делаем инпут сигналом
	//делаем в html проверку если profile значит будем рисовать
}
