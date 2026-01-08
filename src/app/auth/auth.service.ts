import {inject, Injectable} from '@angular/core';
import {HttpClient}                  from "@angular/common/http";
import {catchError, tap, throwError} from "rxjs";
import {TokenResponse}               from "./auth.interface";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/'
  cookieService = inject(CookieService)
  router = inject(Router)

  token: string | null = null
  refreshToken: string | null = null
  //при запросе у нас в сервисе будет сохранён toke и refreshToken

  get isAuth() { //будем проверять авторизован пользователь или нет
    if (!this.token) {
        this.token = this.cookieService.get('token')//если токена нет пробуем его взять из куки сервиса
        this.refreshToken = this.cookieService.get('refreshToken')
    }
    return !!this.token //двойное отрицание что-бы привести строку к boolean
  }


  login(payload: {username: string, password: string}) {
    const fd = new FormData()

    fd.append('username', payload.username)
    fd.append('password', payload.password)
    return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, fd)//когда мы делаем post запрос body запрос передаётся как второй аргуменят (payload) или fd
        .pipe(
            tap(val => this.saveTokens(val)) //получем ответ будет access token и refresh token
        )
  }

  refreshAuthToken() {
      return this.http.post<TokenResponse>(`${this.baseApiUrl}refresh`, {
          refresh_token: this.refreshToken
      }).pipe(
          tap(val => this.saveTokens(val)), //получем ответ будет access token и refresh token
          catchError(err => {
              this.logout()
              return throwError(err)
          })
      )
  }

  logout() {
      this.cookieService.deleteAll()//сотрёт куки
      this.refreshToken = null
      this.token = null
      this.router.navigate(['login']) //отправляем человека на страницу логина
  }

  saveTokens(res: TokenResponse) {
      this.token = res.access_token
      this.refreshToken = res.refresh_token

      this.cookieService.set('token', this.token)
      this.cookieService.set('refreshToken', this.refreshToken)
  }
  
}
