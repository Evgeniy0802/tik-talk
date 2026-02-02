import {Component, input} from '@angular/core';
import {Profile}          from "../../../../data/interfaces/profile.interface";
import {AvatarCircleComponent} from "../../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from "../../../../common-ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-chat-workspace-header',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent
  ],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input.required<Profile>()
}
