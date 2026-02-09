import {createSelector} from "@ngrx/store";
import {profileFeature} from "../../profiles";

export const selectFilteredProfiles = createSelector(
    //будет брать все профили в selectProfiles
    profileFeature.selectProfiles,
    //вторым аргументом что мы будем делать
    (profiles) => profiles //а здесь как он их будет отдавать
)