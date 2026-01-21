import {Component, Input} from '@angular/core';
import {Profile}          from "../../data/interfaces/profile.interface";
import {ImgUrlPipe}       from "../../helpers/pipes/img-url.pipe";
import {SvgIconComponent} from "../svg-icon/svg-icon.component";

@Component({
  selector: 'app-profile-card',
    imports: [
        ImgUrlPipe,
        SvgIconComponent
    ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
