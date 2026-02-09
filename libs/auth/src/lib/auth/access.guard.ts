import { inject } from '@angular/core'
import { Router } from '@angular/router'
import {AuthService} from "@tt/data-access/auth";

export const canActivateAuth = () => {
	const isLoggedIn = inject(AuthService).isAuth //запрашиваем сервис прямо в методе

	if (isLoggedIn) {
		return true
	}

	return inject(Router).createUrlTree(['/login']) //если не подходит возвращаем на страницу логина
}
