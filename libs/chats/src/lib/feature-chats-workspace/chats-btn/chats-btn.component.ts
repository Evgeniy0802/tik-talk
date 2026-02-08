import {Component, input} from '@angular/core'
import {DatePipe} from '@angular/common'
import {AvatarCircleComponent} from "@tt/common-ui";
import {LastMessageRes} from "@tt/data-access/chats";

@Component({
    selector: 'button[chats]', //будет такой компонент если chats будет там
    imports: [AvatarCircleComponent, DatePipe],
    templateUrl: './chats-btn.component.html',
    styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
    chat = input<LastMessageRes>()

    async ngOnInit() {
        this.chat()!.unreadMessages
    }
}
