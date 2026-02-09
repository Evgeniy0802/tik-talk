import {Post, postActions} from '../../posts';
import {createFeature, createReducer, on} from "@ngrx/store";

//интерфейс стора
export interface PostsState {
    posts: Post[]
}
//начальное значение
export const initialState: PostsState = {
    posts: []
}
//создаём редьюсер
export const postsFeature = createFeature({
    name: 'postsFeature',
    reducer: createReducer(
        initialState,
        //в метод on передаём экшн, который слушает редьюсер, начальное значение state и то что будем класть в state
        on(postActions.postsLoaded, (state, payload) => {
            //state паспаковываем и обновляем, кладём туда значение и посты
           return {
               ...state,
               posts: payload.posts
           }
        })
    )
})

//все лежит нужно достать данные пишем селектор
//action задиспатчили, effect вызвал сервис, сервис дал ответ, задиспатчил новый action
//рельюсер кладет данный в стор