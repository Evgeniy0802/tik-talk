import {Component, input} from '@angular/core'
import {DatePipe} from '@angular/common'
import {LastMessageRes} from "../../data";
import {AvatarCircleComponent} from "@tt/common-ui";

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
