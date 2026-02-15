import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Renderer2
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AsyncPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/data-access/profiles";

@Component({
	selector: 'app-communities-page',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		SvgIconComponent,
		AsyncPipe,
		ImgUrlPipe,
		RouterLink
	],
	templateUrl: './communities-page.component.html',
	styleUrl: './communities-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesPageComponent {
	profileService = inject(ProfileService)
	r2 = inject(Renderer2)


	subscribersIvan$ = this.profileService.getSubscribersShortList(5)
	subscribersApl$ = this.profileService.getSubscribersShortList(4)
	subscribersFormula$ = this.profileService.getSubscribersShortList(3)
	subscribersAng$ = this.profileService.getSubscribersShortList(4)
	subscriberSaint$ = this.profileService.getSubscribersShortList(1)
	subscriberLyceum$ = this.profileService.getSubscribersShortList(4)
}
