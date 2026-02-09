import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Post, PostCreateDto} from "../../posts";

export const postActions = createActionGroup({
    source: 'post',
    events: {
        'posts create': props<{payload: PostCreateDto}>(),//создание посты
        'posts loaded': props<{posts: Post[]}>(), //загрузить посты
        'posts fetch': emptyProps(), //забрать посты
    }
})