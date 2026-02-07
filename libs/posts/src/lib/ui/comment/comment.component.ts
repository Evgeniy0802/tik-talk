import { Component, input } from '@angular/core'
import {PostComment} from "../../data";
import {AvatarCircleComponent, DateTimePipe} from "@tt/common-ui";

@Component({
	selector: 'app-comment',
	imports: [AvatarCircleComponent, DateTimePipe],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.scss'
})
export class CommentComponent {
	comment = input<PostComment>()
}
