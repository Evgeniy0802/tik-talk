//прописываем сам interface который будет являться наш store
import { Profile } from '../../profiles'
import { createFeature, createReducer, on } from '@ngrx/store'
import { profileActions } from '../../profiles'

export interface ProfileState {
	profiles: Profile[]
	profileFilters: Record<string, any>
	page: number
	size: number
}

//нужно указать начальное состояние, с чего все начинается
//начинается до каких еще изменений до reducer, до всего, до загрузки приложения
export const initialState: ProfileState = {
	profiles: [],
	profileFilters: {},
	page: 1,
	size: 10
}

//делаем store для фичи profile, опишем эту ветку
export const profileFeature = createFeature({
	name: 'profileFeature',
	reducer: createReducer(
		initialState,
		//первым аргументом название события, а вторым что делать
		on(profileActions.profilesLoaded, (state, payload) => {
			return {
				//венуть новое значение state
				...state,
				//profiles пока что нет, их нужно запросить на сервере, нужен effect
				profiles: state.profiles.concat(payload.profiles) //новые данные с бэка должны добавляться в массив
			}
		}),
		on(profileActions.filterEvents, (state, payload) => {
			return {
				...state,
				profiles: [], //если филтры изменились то профайлы все сбрасываются
				profileFilters: payload.filters, //сохраним фильтры а профайл удалим
				page: 1 //при изменение поиска мы должны с 1 страницы смотреть
				//после этого сигнал пойдёт в эффекты, а эффекты уже вызовут profilesLoaded и запишут новые профайлы
			}
		}),
		on(profileActions.setPage, (state, payload) => {
			let page = payload.page
			if (!page) page = state.page + 1 //если нет page то просто возьмём след страницу

			return {
				...state,
				page
			}
		})
	)
})
