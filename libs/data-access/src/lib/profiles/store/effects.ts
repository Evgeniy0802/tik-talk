import {inject, Injectable} from "@angular/core";
import {profileActions, ProfileService} from '../../profiles';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map, switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProfileEffects {
    profileService = inject(ProfileService)
    actions$ = inject(Actions)

    filterProfiles = createEffect(() => {
        return this.actions$.pipe(
            //ofType озночает что ему ловить
            //когда произойдёт filterEvents этот эффект сработает
            ofType(profileActions.filterEvents),
            switchMap(({filters}) => {
                return this.profileService.filterProfiles(filters)
            }),
            //после того как всё это закончится мы преврати в action надо map
            map(res => profileActions.profilesLoaded({profiles: res.items}))
        )
    })
}