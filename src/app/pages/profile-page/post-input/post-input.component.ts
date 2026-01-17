import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent}                                                  from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ProfileService} from "../../../data/services/profile.service";
import {SvgIconComponent}             from "../../../common-ui/svg-icon/svg-icon.component";
import {PostService}                  from "../../../data/services/post.service";
import {FormsModule}                  from "@angular/forms";
import {firstValueFrom}               from "rxjs";

@Component({
  selector: 'app-post-input',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  postService = inject(PostService)
  r2 = inject(Renderer2)

  isCommentInput = input(false);
  postId = input<number>(0)
  profile = inject(ProfileService).me

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
    const textarea = event.target as HTMLTextAreaElement;

    //нам нужно чтобы он на каждом вводе он менял высоту блока на высоту доступной прокрутке
    //мы вводимм и постепенно блок растёт
    this.r2.setStyle(textarea, 'height', 'auto');
    //сначала делает height auto, подгоняет под нужный размер контента, а потом мы опять своей логикой занимаемся
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  //создание поста
  onCreatePost() {
    if (!this.postText) return

    if (this.isCommentInput()) {
      firstValueFrom(this.postService.createComment({
        text: this.postText,
        authorId: this.profile()!.id,
        postId: this.postId()
      })).then(() => {
        this.postText = ''
        //когда коммент создался вызываем
        this.created.emit()
      })
      return
    }

    firstValueFrom(this.postService.createPost({
      title: 'Клёвый пост',
      content: this.postText,
      authorId: this.profile()!.id
    }))
        //это простой промис так что можем сделать что то с результатом
        .then(() => {
          //после того как все произошло будем делать что пост равен пустой строке
          this.postText = ''
    })
  }
}
