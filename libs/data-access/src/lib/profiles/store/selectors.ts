import { createSelector } from '@ngrx/store'
import { profileFeature } from '../../profiles'

export const selectFilteredProfiles = createSelector(
	//будет брать все профили в selectProfiles
	profileFeature.selectProfiles,
	//вторым аргументом что мы будем делать
	(profiles) => profiles //а здесь как он их будет отдавать
)

export const selectProfilePageable = createSelector(
	profileFeature.selectProfileFeatureState,
	(state) => {
		return {
			//вернём за 1 селектор получаем всю инфу по пэйджеблу
			page: state.page,
			size: state.size
		}
	}
)

//если не понятно мы просто смотрим из стора какое значение брать

export const selectFilters = createSelector(
	profileFeature.selectProfileFilters,
	(filters) => filters
)
