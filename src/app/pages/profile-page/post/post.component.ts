import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent}                    from "../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostInputComponent} from "../post-input/post-input.component";
import {CommentComponent} from "./comment/comment.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom}                           from "rxjs";
import {DateTimePipe}                             from "../../../helpers/pipes/data-time.pipe";
import {ProfileService}                           from "../../../data/services/profile.service";

@Component({
  selector: 'app-post',
    imports: [
        AvatarCircleComponent,
        DatePipe,
        SvgIconComponent,
        PostInputComponent,
        CommentComponent,
        DateTimePipe
    ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>()
  comments = signal<PostComment[]>([])

    postService = inject(PostService)
    profile = inject(ProfileService).me

  //нам не нужно делать запрос на каждую сущность
  async ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  //тут мы запрашиваем
  async onCreated(commentText: string) {
          firstValueFrom(this.postService.createComment({ //сходили на бэк создали коммент
              text: commentText,
              authorId: this.profile()!.id,
              postId: this.post()!.id
          })).then(async () => {
              //когда коммент создался вызываем
              const comments = await firstValueFrom(this.postService.getCommentByPostId(this.post()!.id))
              this.comments.set(comments) //запрашиваем комментарии
          })
              .catch((error) => console.log('Error loading comment', error))
          return
  }
}
