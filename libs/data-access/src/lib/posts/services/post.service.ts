import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
	CommentCreateDto,
	Post,
	PostComment,
	PostCreateDto
} from '../../posts'
import { map, switchMap, tap } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class PostService {
	//приватная переменная на уровне js
	#http = inject(HttpClient)

	baseApiUrl = 'https://icherniakov.ru/yt-course/'

	//здесь хранятся список постов
	posts = signal<Post[]>([])

	//создание поста
	createPost(payload: PostCreateDto) {
		return (
			this.#http
				.post<Post>(`${this.baseApiUrl}post/`, payload)
				//связываем запросы create и fetch
				.pipe(
					switchMap(() => {
						return this.fetchPosts()
					})
				)
		)
	}

	//вывод поста
	fetchPosts() {
		return (
			this.#http
				.get<Post[]>(`${this.baseApiUrl}post/`)
				//будем перезаменять значение
				.pipe(tap((res) => this.posts.set(res)))
		)
	}

	//создвние комментария
	createComment(payload: CommentCreateDto) {
		return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload)
	}

	//делаем метод рукотворно чтобы запросить все комменты
	getCommentByPostId(postId: number) {
		return this.#http.get<Post>(`${this.baseApiUrl}post/${postId}`).pipe(
			//сделали рукотворно поста которого не было на бэке
			map((res) => res.comments)
		)
	}
}
