import {Component, inject, input, OnInit, signal} from '@angular/core'
import {firstValueFrom} from 'rxjs'
import {CommentComponent, PostInputComponent} from "../../ui";
import {Post, PostComment, PostService} from "../../data";
import {AvatarCircleComponent, DateTimePipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/profile";

@Component({
    selector: 'app-post',
    imports: [
        AvatarCircleComponent,
        SvgIconComponent,
        PostInputComponent,
        CommentComponent,
        DateTimePipe
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss'
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
        firstValueFrom(
            this.postService.createComment({
                //сходили на бэк создали коммент
                text: commentText,
                authorId: this.profile()!.id,
                postId: this.post()!.id
            })
        )
            .then(async () => {
                //когда коммент создался вызываем
                const comments = await firstValueFrom(
                    this.postService.getCommentByPostId(this.post()!.id)
                )
                this.comments.set(comments) //запрашиваем комментарии
            })
            .catch((error) => console.log('Error loading comment', error))
        return
    }
}
