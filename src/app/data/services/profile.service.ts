import {inject, Injectable} from '@angular/core';
import {HttpClient}          from "@angular/common/http";
import {Profile} from "../interfaces/profile.interface";

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient)

  baseApiUrl = 'https://icherniakov.ru/yt-course/'

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`)
    // в метод get передаём интерфейс <> и если он тут прописан, значит такой метод и будем возвращать.
    // <>: Дженерик в который передаём тип данных.
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)//возвращаем свой аккаунт, получаем информацию о себе
  }
}
