import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { AvatarCircleComponent } from '@tt/common-ui'
import { Profile } from '@tt/data-access/profiles'

@Component({
	selector: 'app-profile-header',
	standalone: true,
	imports: [AvatarCircleComponent],
	templateUrl: './profile-header.component.html',
	styleUrl: './profile-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent {
	profile = input<Profile>()
	//делаем инпут сигналом
	//делаем в html проверку если profile значит будем рисовать
}
