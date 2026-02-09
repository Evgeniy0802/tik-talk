import {createActionGroup, props} from "@ngrx/store";
import { Profile } from '../../profiles';

export const profileActions = createActionGroup({
    source: 'profile', //source должна быть уникальной строкой
    events: {
        //произвольная строка
        'filter events': props<{filters: Record<string, any>}>(),
        'profiles loaded': props<{profiles: Profile[]}>()
    }
})