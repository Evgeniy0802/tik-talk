import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ProfileCardComponent} from "./common-ui/profile-card/profile-card.component";
import {ProfileService} from "./data/services/profile.service";
import {JsonPipe} from "@angular/common";
import {Profile} from "./data/interfaces/profile.interface";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ProfileCardComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    profileService = inject(ProfileService);
    profiles: Profile[] = [] //массив наших профилей, делаем тип данных Profile[], которые создали в интерфейсах и передали в сервисе(getTestAccounts) тип данных

    constructor() {
        this.profileService.getTestAccounts()
            .subscribe(val => { //подписался на объект
                this.profiles = val //вовзвращает некоторое значение, которому мы присваиваем переменной profiles это значение
            })
    }
}
