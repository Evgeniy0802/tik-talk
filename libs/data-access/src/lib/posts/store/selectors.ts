import {createSelector} from "@ngrx/store";
import {postsFeature}   from "@tt/data-access/posts";

export const selectPosts = createSelector(
    postsFeature.selectPosts,
    (posts) => posts
)