import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {CommentCreateDto, Post, PostComment, PostCreateDto} from "../../posts";

export const postActions = createActionGroup({
    source: 'post',
    events: {
        'posts create': props<{payload: PostCreateDto}>(),//создание посты
        'posts loaded': props<{posts: Post[]}>(), //загрузить посты
        'posts fetch': emptyProps(), //забрать посты

        'comments create': props<{payload: CommentCreateDto}>(),//создание коммента
        'comments fetch': props<{postId: number}>(),//забрать комменты
        'comments loaded': props<{comments: PostComment[]}>()
    }
})