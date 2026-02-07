import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Profile } from '../interfaces/profile.interface'
import { map, tap } from 'rxjs'
import {Pageable} from "@tt/shared";

@Injectable({
	providedIn: 'root'
})
export class ProfileService {
	http = inject(HttpClient)
	baseApiUrl = 'https://icherniakov.ru/yt-course/'

	me = signal<Profile | null>(null)
	filteredProfiles = signal<Profile[]>([])

	getTestAccounts() {
		return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`)
		// в метод get передаём интерфейс <> и если он тут прописан, значит такой метод и будем возвращать.
		// <>: Дженерик в который передаём тип данных.
	}

	getMe() {
		return this.http
			.get<Profile>(`${this.baseApiUrl}account/me`) //возвращаем свой аккаунт, получаем информацию о себе
			.pipe(tap((res) => this.me.set(res)))
	}

	getAccount(id: string) {
		return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
	}

	getSubscribersShortList(subsAmount = 3) {
		//принимаем параметр subsAmount = 3 по умолчанию
		//get запрос, на подписчиков, он возвращает информацию о погинации
		return (
			this.http
				.get<Pageable<Profile>>(`${this.baseApiUrl}account/subscribers/`)
				//получаем res.item, вернули только items, но нам не нужно 5 штук, нам нужно 3
				//это же массив, можем сделать slice(0, 3)
				.pipe(map((res) => res.items.slice(0, subsAmount)))
		)
	}

	patchProfile(profile: Partial<Profile>) {
		//Partial обозночает что необязательно могу придти все поля этого объекта
		return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile)
		//как payload примит profile
	}

	uploadAvatar(file: File) {
		const fd = new FormData()
		fd.append('image', file)

		return this.http.post<Profile>(`${this.baseApiUrl}account/upload_image`, fd)
	}

	filterProfiles(params: Record<string, any>) {
		//Record<string, any> означает объекты типа ключ-значение
		return this.http
			.get<Pageable<Profile>>(`${this.baseApiUrl}account/accounts`, { params })
			.pipe(tap((res) => this.filteredProfiles.set(res.items)))
	}
}
