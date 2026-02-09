import {createSelector} from "@ngrx/store";
import {postsFeature}   from "@tt/data-access/posts";

export const selectPosts = createSelector(
    postsFeature.selectPosts,
    (posts) => posts
)

export const selectComments = (postId: number) =>
    createSelector(
        postsFeature.selectComments,
        (comments) => comments[postId] //определяем пост id в комментариях
    )

