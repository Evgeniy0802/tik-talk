import { Component, inject } from '@angular/core'
import { ProfileCardComponent } from '../../ui'
import { ProfileFiltersComponent } from '../../feature-profile-list'
import { AsyncPipe } from '@angular/common'
import {ProfileService} from "@tt/data-access/profiles";

@Component({
	selector: 'app-search-page',
	imports: [ProfileCardComponent, ProfileFiltersComponent, AsyncPipe],
	templateUrl: './search-page.component.html',
	styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
	profileService = inject(ProfileService)
	profiles = this.profileService.filteredProfiles
	//profiles: Profile[] = [] //массив наших профилей, делаем тип данных Profile[], которые создали в интерфейсах и передали в сервисе(getTestAccounts) тип данных

	//constructor() {
	//this.profileService.getTestAccounts()
	//  .subscribe(val => { //подписался на объект
	//  this.profiles = val //вовзвращает некоторое значение, которому мы присваиваем переменной profiles это значение
	//})
	//}
}
