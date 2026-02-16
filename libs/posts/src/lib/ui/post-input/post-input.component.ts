import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	inject,
	input,
	Output,
	Renderer2
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui"
import {PostService} from "@tt/data-access/posts";
import {GlobalStoreService} from "@tt/data-access/shared";

@Component({
	selector: 'app-post-input',
	imports: [AvatarCircleComponent, SvgIconComponent, FormsModule],
	templateUrl: './post-input.component.html',
	styleUrl: './post-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
	postService = inject(PostService)
	r2 = inject(Renderer2)

	isCommentInput = input(false)
	postId = input<number>(0)
	profile = inject(GlobalStoreService).me

	//когда создаётся post сделаем output событие
	@Output() created = new EventEmitter()

	//делаем обводку post-input
	@HostBinding('class.comment')
	get isComment() {
		return this.isCommentInput()
	}

	postText = ''

	//привяжемся к инпуту
	onTextAreaInput(event: Event) {
		const textarea = event.target as HTMLTextAreaElement

		//нам нужно чтобы он на каждом вводе он менял высоту блока на высоту доступной прокрутке
		//мы вводимм и постепенно блок растёт
		this.r2.setStyle(textarea, 'height', 'auto')
		//сначала делает height auto, подгоняет под нужный размер контента, а потом мы опять своей логикой занимаемся
		this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
	}

	onSend() {
		//слушает что создал пост и реализует его
		if (this.postText.trim()) {
			//проверяет, есть ли в поле ввода хоть какой-то полезный контент, помимо одних только пробелов.
			this.created.emit(this.postText) //эмитит пост текст
			this.postText = ''
		}
	}

	onKeyUp() {
		this.onSend()
	}
}
