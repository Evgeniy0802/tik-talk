import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	OnInit,
	Signal
} from '@angular/core'
import { CommentComponent, PostInputComponent } from '../../ui'
import {
	AvatarCircleComponent,
	DateTimePipe,
	SvgIconComponent
} from '@tt/common-ui'
import {
	Post,
	postActions,
	PostComment,
	PostService,
	selectComments
} from '@tt/data-access/posts'
import { GlobalStoreService } from '@tt/data-access/shared'
import { Store } from '@ngrx/store'

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [
		AvatarCircleComponent,
		SvgIconComponent,
		PostInputComponent,
		CommentComponent,
		DateTimePipe
	],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
	// providers: [
	// 	{
	// 		provide: Color,
	// 		//useClass: PostService, //это должно быть вместо Post Service, провайд какого то класса
	// 		//useExisting: ChatsService,//провайдим по алиасу, теперь когда провайдим пост серивис, на место него встаёт чат серивс
	// 		//useValue: 'red'
	// 		//useExisting: PostService
	// 		useFactory: () => { //функция которая должна вернуть что то, можем внутри использовать инджекшион контекст
	// 			const postService = inject(PostService)
	// 			console.log(postService)
	// 			return postService.id > 400 ? 'white' : 'red' //в пост инпуте лучше
	// 		}
	// 	}
	// ]
})
export class PostComponent implements OnInit {
	//directive = inject(TestDirective, {
	//skipSelf: true, //пропустить себя, не ищем на своём инжексторе д, но ищем выше
	//self: true //искать только на себе и всеЮ больше негде
	//optional: true // где записано значение д (в констуркторе например) возможный null, везде будет undefined, если ниггде не нашли будет null, но не будет ошибки
	//host: true //он идёт до шаблона hostElementa, хост элемент в который встроен наш компонент
	//})

	post = input<Post>()
	//инпут параметр не появляется в конструкторе или в полях класса, доступ к ним только на ngOnInit и позже
	//comments = signal<PostComment[]>([])\
	store = inject(Store)
	postService = inject(PostService)
	profile = inject(GlobalStoreService).me
	comments!: Signal<PostComment[]>
	//comments = this.store.selectSignal(selectComments)

	comments2 = computed(() => {
		//computed это вычисленная значение, он реагирует на те сигналы которые написаны внутри и когда будут изменяться
		//сигналы которые написаны внутри будет эта функция пересчитываться
		if (this.comments()?.length > 0) {
			//если комменты есть бери из поле комменты, если их не будет бери из постов комменты
			return this.comments()
		}

		return this.post()?.comments
		//мы передаём функцию, что эта функция вернула такое значение у переменной computed и будет
		//каждый раз она пересчитывается когда изменяется какой либо сигнал внутри этой функции
	})

	//нам не нужно делать запрос на каждую сущность
	ngOnInit() {
		this.comments = this.store.selectSignal(selectComments(this.post()!.id))
		//this.comments.set(this.post()!.comments)
		// this.store.dispatch(postActions.commentsFetch({postId: this.post()!.id}))
	}

	//тут мы запрашиваем
	onCreated(commentText: string) {
		this.store.dispatch(
			postActions.commentsCreate({
				payload: {
					text: commentText,
					authorId: this.profile()!.id,
					postId: this.post()!.id
				}
			})
		)
		// firstValueFrom(
		//     this.postService.createComment({
		//         //сходили на бэк создали коммент
		//         text: commentText,
		//         authorId: this.profile()!.id,
		//         postId: this.post()!.id
		//     })
		// )
		//     .then(async () => {
		//         //когда коммент создался вызываем
		//         const comments = await firstValueFrom(
		//             this.postService.getCommentByPostId(this.post()!.id)
		//         )
		//         this.comments.set(comments) //запрашиваем комментарии
		//     })
		//     .catch((error) => console.log('Error loading comment', error))
		// return
	}
}
