import {Component, inject} from '@angular/core';
import {ProfileCardComponent} from "../../common-ui/profile-card/profile-card.component";
import {ProfileService} from "../../data/services/profile.service";
import {Profile} from "../../data/interfaces/profile.interface";

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCardComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService = inject(ProfileService);
  profiles: Profile[] = [] //массив наших профилей, делаем тип данных Profile[], которые создали в интерфейсах и передали в сервисе(getTestAccounts) тип данных

  constructor() {
    this.profileService.getTestAccounts()
        .subscribe(val => { //подписался на объект
          this.profiles = val //вовзвращает некоторое значение, которому мы присваиваем переменной profiles это значение
        })
  }
}
