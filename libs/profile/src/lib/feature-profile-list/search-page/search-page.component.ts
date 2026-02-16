import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject
} from '@angular/core'
import { ProfileCardComponent } from '../../ui'
import { ProfileFiltersComponent } from '../../feature-profile-list'
import { Store } from '@ngrx/store'
import {
	Profile,
	profileActions,
	ProfileService,
	selectFilteredProfiles
} from '@tt/data-access/profiles'
import {
	WaIntersectionObservee,
	WaIntersectionObserverDirective
} from '@ng-web-apis/intersection-observer'
import { firstValueFrom, scan, Subject } from 'rxjs'

@Component({
	selector: 'app-search-page',
	imports: [
		ProfileCardComponent,
		ProfileFiltersComponent,
		WaIntersectionObserverDirective,
		WaIntersectionObservee
	],
	templateUrl: './search-page.component.html',
	styleUrl: './search-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
	store = inject(Store)
	profiles = this.store.selectSignal(selectFilteredProfiles) //это для сигнала
	profileService = inject(ProfileService)
	//profiles = this.store.select(selectFilteredProfiles) старый способ с Obseravble
	//profiles: Profile[] = [] //массив наших профилей, делаем тип данных Profile[], которые создали в интерфейсах и передали в сервисе(getTestAccounts) тип данных

	profileSubject$ = new Subject<Profile[]>()

	infiniteProfiles$ = this.profileSubject$.pipe(
		scan((acc, curr) => {
			return acc.concat(curr) as Profile[]
		}, [] as Profile[])
	)

	page = 0

	ngOnInit() {
		this.getNextPage()
	}

	async getNextPage() {
		this.page += 1 //вувеличиваем на едеиничку
		const res = await firstValueFrom(
			this.profileService.filterProfiles({ page: this.page })
		) //получили профайлы

		this.profileSubject$.next(res.items)
	}

	timeToFetch() {
		this.store.dispatch(profileActions.setPage({}))
	}

	onIntersection(entries: IntersectionObserverEntry[]) {
		if (!entries.length) return

		if (entries[0].intersectionRatio > 0) {
			this.timeToFetch()
		}
	}

	onScroll() {
		this.timeToFetch()
		this.getNextPage()
	}

	//constructor() {
	//this.profileService.getTestAccounts()
	//  .subscribe(val => { //подписался на объект
	//  this.profiles = val //вовзвращает некоторое значение, которому мы присваиваем переменной profiles это значение
	//})
	//}

	// ngAfterViewInit() {
	// 	const {top} = this.hostElement.nativeElement.getBoundingClientRect();
	// 	const height = window.innerHeight - top - 248
	// 	console.log(height)
	// } посчитали сколько делать высоту у profile-card-wrapper
}
