import { inject, Injectable } from '@angular/core'
import {
	profileActions,
	ProfileService,
	selectFilteredProfiles,
	selectProfilePageable
} from '../../profiles'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, switchMap, withLatestFrom } from 'rxjs'
import { Store } from '@ngrx/store'

@Injectable({
	providedIn: 'root'
})
export class ProfileEffects {
	profileService = inject(ProfileService)
	actions$ = inject(Actions)
	store = inject(Store)

	filterProfiles = createEffect(() => {
		return this.actions$.pipe(
			//ofType озночает что ему ловить
			//когда произойдёт filterEvents этот эффект сработает
			ofType(
				profileActions.filterEvents,
				profileActions.setPage //запрашиваем профайлы не только на filterEvents но и на setPage
			),
			withLatestFrom(
				//берёт последние значение селекторов, превращает в массив и в нём по порядку идут значения
				this.store.select(selectFilteredProfiles),
				this.store.select(selectProfilePageable)
			),
			//withLatestFrom сделал так что передал массив, 1 арг был до него, так что мы его пропускаем и след эл [] это то что мы передаём в withLatestFrom
			switchMap(([_, filters, pageable]) => {
				//первое значение то что пришло из экшона _ значит мы будем его игнорировать
				return this.profileService.filterProfiles({
					...pageable, //скрестили их
					...filters
				})
			}),
			//после того как всё это закончится мы преврати в action надо map
			map((res) => profileActions.profilesLoaded({ profiles: res.items }))
		)
	})
}
