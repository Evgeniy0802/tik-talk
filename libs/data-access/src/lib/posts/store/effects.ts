import {inject, Injectable}  from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {postActions, PostService} from "../../posts";
import {map, switchMap} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PostEffects {
    postService = inject(PostService)
    actions$ = inject(Actions)

    //загружаем посты
    fetchPosts = createEffect(() => {
        return this.actions$.pipe(
            //создали эффект который слушает экшен postsGet
            ofType(postActions.postsFetch),
            //меняем стрим и возвращаем загрузку постов
            switchMap(() => {
                return this.postService.fetchPosts()
            }),
            //массив постов перелаём в новый экшен, диспатчем новый экшен который загружает посты в стор
            //получили через сервис массив постов и передали его в новый экшен
            map(posts => postActions.postsLoaded({posts: posts}))

        )
    })

    //создаём посты
    loadPosts = createEffect(() => {
        return this.actions$.pipe(
            ofType(postActions.postsCreate),
            switchMap(({ payload }) =>
                this.postService.createPost({
                    title: 'Клёвый пост',
                    content: payload.content,
                    authorId: payload.authorId
                })
                    .pipe(
                        map(() => postActions.postsFetch())
                    )
            )
        )
    })
}