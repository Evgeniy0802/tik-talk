import {Post, postActions, PostComment} from '../../posts';
import {createFeature, createReducer, on} from "@ngrx/store";

//интерфейс стора
export interface PostsState {
    posts: Post[],
    comments: Record<number, PostComment[]>,
}
//начальное значение
export const initialStatePost: PostsState = {
    posts: [],
    comments: {}
}
//создаём редьюсер
export const postsFeature = createFeature({
    name: 'postsFeature',
    reducer: createReducer(
        initialStatePost,
        //в метод on передаём экшн, который слушает редьюсер, начальное значение state и то что будем класть в state
        on(postActions.postsLoaded, (state, payload) => {
            //state паспаковываем и обновляем, кладём туда значение и посты
           return {
               ...state,
               posts: payload.posts
           }
        }),

        //грузим комменты
        on(postActions.commentsLoaded, (state, {comments}) => {
            const stateComments = {...state.comments} //делаем дубль клонируем его
            //конкретно в этом объекте нельзя менять, но можно склонировать
            //state сделан безопасным
            //мутация данных это когда мы не весь объект изменяем, а например добавляем одно поле, можно баги поймать

            if (comments.length) {
                stateComments[comments[0].postId] = comments
                //если комментарий есть, тогда в stateComments мы добавляем по postId все эти комменты
            }

            return {
                ...state,
                comments: stateComments
                //обновили у id комменты
            }
        })
    )
})

//все лежит нужно достать данные пишем селектор
//action задиспатчили, effect вызвал сервис, сервис дал ответ, задиспатчил новый action
//рельюсер кладет данный в стор