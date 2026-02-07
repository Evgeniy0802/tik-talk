import { Component, inject } from '@angular/core'
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component'
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component'
import { AsyncPipe } from '@angular/common'
import {ProfileService} from "@tt/profile";

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
