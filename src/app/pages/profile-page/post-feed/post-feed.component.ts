import {
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	inject,
	Input,
	Output,
	Renderer2
} from '@angular/core'
import { PostInputComponent } from '../post-input/post-input.component'
import { PostComponent } from '../post/post.component'
import { PostService } from '../../../data/services/post.service'
import {
	debounceTime,
	firstValueFrom,
	fromEvent,
	Subject,
	takeUntil,
	throttleTime
} from 'rxjs'
import { ProfileService } from '../../../data/services/profile.service'

@Component({
	selector: 'app-post-feed',
	imports: [PostInputComponent, PostComponent],
	templateUrl: './post-feed.component.html',
	styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
	postService = inject(PostService)
	hostElement = inject(ElementRef) //нужна для того чтобы мы рендерелись на абсолютно разных платформах
	r2 = inject(Renderer2)
	private destroy$ = new Subject<void>()
	profile = inject(ProfileService).me

	feed: any[] = []

	@Input() isCommentInput = false
	@Input() postId: number = 0

	@Output() created = new EventEmitter<void>()

	@HostBinding('class.comment')
	get isComment() {
		return this.isCommentInput
	}

	@HostListener('window:resize')
	onWindowResize() {
		//потом будем вызывать тут
		console.log(123)
		this.resizeFeed()
	}
	//узнать динамическую велечину до конца страницы, делаем overflow-y: scroll
	//чтобы получить хост элемент на котором находится этот компонент, сам селектор компонента app-post-feed

	//метод для загрузки постов
	private loadPost() {
		firstValueFrom(this.postService.fetchPosts())
			.then((posts) => {
				this.feed = posts //сохраняем и загружаем посты в feed
			})
			.catch((err) => {
				console.error('Failed to load post', err)
			})
	}

	onCreatePost(postText: string) {
		//принимаем текс поста передал то что вбито в textarea
		//есть компонент post-input чтобы он был для комментариев и постов, он должен брать эмитить пост текст
		if (!postText) return //ориентируемся на пост текст который пришел из инпута
		//post text это текст поста, работаем с ним в пост инпут, принимаю его функции

		firstValueFrom(
			this.postService.createPost({
				title: 'Клёвый пост',
				content: postText,
				authorId: this.profile()!.id
			})
		)
			//это простой промис так что можем сделать что то с результатом
			.then(() => {
				//после того как все произошло будем делать что пост равен пустой строке
				postText = ''
			})
	}

	trackByPostId(index: number, post: any): number {
		return post.id
	}

	//нужно прогреть наше состояние
	constructor() {
		this.loadPost()
	}

	ngAfterViewInit() {
		//вызовем её тут первый раз
		this.resizeFeed()

		fromEvent(window, 'resize')
			.pipe(debounceTime(300), takeUntil(this.destroy$))
			.subscribe(() => {
				console.log(123)
			})
	}

	//узнать динамическую велечину до конца страницы, делаем overflow-y: scroll
	//чтобы получить хост элемент на котором находится этот компонент, сам селектор компонента app-post-feed
	resizeFeed() {
		//посмотреть как далеко от вера экрана расположен  этот элемент
		const { top } = this.hostElement.nativeElement.getBoundingClientRect() //пришлёт координаты где расположен элемент

		const height = window.innerHeight - top - 24 - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}
