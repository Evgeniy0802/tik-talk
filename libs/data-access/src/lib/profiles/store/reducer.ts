//прописываем сам interface который будет являться наш store
import {Profile} from '../../profiles';
import {createFeature, createReducer, on} from "@ngrx/store";
import {profileActions} from '../../profiles';

export interface ProfileState {
    profiles: Profile[],
    profileFilters: Record<string, any>
}

//нужно указать начальное состояние, с чего все начинается
//начинается до каких еще изменений до reducer, до всего, до загрузки приложения
export const initialState: ProfileState = {
    profiles: [],
    profileFilters: {}
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
                profiles: payload.profiles
            }
        })
    )
})