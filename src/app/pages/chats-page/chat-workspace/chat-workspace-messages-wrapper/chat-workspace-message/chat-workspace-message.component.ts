import {Component, HostBinding, input} from '@angular/core';
import {Message}                       from "../../../../../data/interfaces/chats.interface";
import {AvatarCircleComponent} from "../../../../../common-ui/avatar-circle/avatar-circle.component";
import {DateTimePipe} from "../../../../../helpers/pipes/data-time.pipe";

@Component({
  selector: 'app-chat-workspace-message',
  imports: [
    AvatarCircleComponent,
    DateTimePipe
  ],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine
  }
}
