import { Component, input } from '@angular/core'
import {AvatarCircleComponent, DateTimePipe} from "@tt/common-ui";
import {PostComment} from "@tt/data-access/posts";

@Component({
	selector: 'app-comment',
	imports: [AvatarCircleComponent, DateTimePipe],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.scss'
})
export class CommentComponent {
	comment = input<PostComment>()
}
