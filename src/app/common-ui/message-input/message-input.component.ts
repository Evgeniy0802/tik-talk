import {Component, EventEmitter, inject, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent}            from "../avatar-circle/avatar-circle.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SvgIconComponent}                 from "../svg-icon/svg-icon.component";
import {PostService}                  from "../../data/services/post.service";
import {ProfileService}                                     from "../../data/services/profile.service";

@Component({
  selector: 'app-message-input',
  imports: [
    AvatarCircleComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2)
  me = inject(ProfileService).me

  @Output() created = new EventEmitter<string>()

  postText: string = ''

  //привяжемся к инпуту
  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    //нам нужно чтобы он на каждом вводе он менял высоту блока на высоту доступной прокрутке
    //мы вводимм и постепенно блок растёт
    this.r2.setStyle(textarea, 'height', 'auto');
    //сначала делает height auto, подгоняет под нужный размер контента, а потом мы опять своей логикой занимаемся
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onSend() {
    if (!this.postText) return

    this.created.emit(this.postText)
    this.postText = ''
  }
}
