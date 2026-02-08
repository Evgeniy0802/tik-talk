import {
	Component,
	ElementRef,
	inject,
	Renderer2
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AsyncPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs'
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
	styleUrl: './communities-page.component.scss'
})
export class CommunitiesPageComponent {
	profileService = inject(ProfileService)
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)
	private destroy$ = new Subject<void>()

	subscribersIvan$ = this.profileService.getSubscribersShortList(5)
	subscribersApl$ = this.profileService.getSubscribersShortList(4)
	subscribersFormula$ = this.profileService.getSubscribersShortList(3)
	subscribersAng$ = this.profileService.getSubscribersShortList(4)
	subscriberSaint$ = this.profileService.getSubscribersShortList(1)
	subscriberLyceum$ = this.profileService.getSubscribersShortList(4)

	ngAfterViewInit() {
		this.resizeFeedComm()

		fromEvent(window, 'resize')
			.pipe(debounceTime(300), takeUntil(this.destroy$))
			.subscribe(() => {
				console.log(123)
			})
	}

	resizeFeedComm() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}
