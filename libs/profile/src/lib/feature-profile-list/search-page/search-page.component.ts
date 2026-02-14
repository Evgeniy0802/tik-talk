import {Component, ElementRef, inject} from '@angular/core'
import { ProfileCardComponent }          from '../../ui'
import { ProfileFiltersComponent } from '../../feature-profile-list'
import {Store} from "@ngrx/store";
import {selectFilteredProfiles} from "@tt/data-access/profiles";

@Component({
	selector: 'app-search-page',
	imports: [ProfileCardComponent, ProfileFiltersComponent],
	templateUrl: './search-page.component.html',
	styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
	store = inject(Store)
	profiles = this.store.selectSignal(selectFilteredProfiles) //это для сигнала
	hostElement = inject (ElementRef);
    //profiles = this.store.select(selectFilteredProfiles) старый способ с Obseravble
	//profiles: Profile[] = [] //массив наших профилей, делаем тип данных Profile[], которые создали в интерфейсах и передали в сервисе(getTestAccounts) тип данных

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
