import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {AuthService}                                   from "./auth.service";
import {inject}                            from "@angular/core";
import {catchError, switchMap, throwError} from "rxjs";

let isRefreshing = false //щёлочка

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    //next функция что-бы отпустить его, а req это перехваченный реквест
    const authService = inject(AuthService)
    const token = authService.token

    if (!token) return next(req)

    if (isRefreshing) {
        return refreshAndProceed(authService, req, next) //если происходит рефрешинг, тогда мы сразу отпраялем запрос на рефреш
    }


    return next(addToken(req, token)) //передаём новый реквест
        .pipe(
            catchError(error => {
                if (error.status === 403) {
                    return refreshAndProceed(authService, req, next)
                }

                return throwError(error)//возвращаем дальще ошибку
            })
        )
}

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing) {
        isRefreshing = true

        return authService.refreshAuthToken()
            .pipe( //рефреш токен это стрим, нам нужно перейти в другой стрим, тот запрос с которого мы начали, с полученными данными мы должны отправить запрос еще туда
                switchMap((res) => { //берёт стрим который ты ему дал и меняет на другой стрим
                    isRefreshing = false
                    return next(addToken(req, res.access_token))//меняет его на этот стрим
                })
            )
    }

    return next(addToken(req, authService.token!)) //другая ветка развитий событий если кто-то залётный оказался

    //рефреш токен прошел, ответ на запрос в res
    //switchMap используя старый ответ на запрос, может поменять себя в другой стрим
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({ //клонируем наш реквест и видоимзеняем его
        setHeaders: {
            Authorization: `Bearer ${token}`//токены передаются следующим образом, заголовок авторизации, ключевое
            //слово Bearer и сам токен.
        }
    })
}

//в AuthToken получили какой-то запрос, поняли, что запрос протух (403) и хотим отправить его заново
//сначала отправляем запрос на refresh_token, потом надо перейти из стрима refresh_token перейти в другой стрим который будет являтся новым запросом
//с новым токеном
