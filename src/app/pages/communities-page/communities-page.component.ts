import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {FormsModule, ReactiveFormsModule}                       from "@angular/forms";
import {SvgIconComponent}                 from "../../common-ui/svg-icon/svg-icon.component";
import {AsyncPipe}                        from "@angular/common";
import {ImgUrlPipe}                       from "../../helpers/pipes/img-url.pipe";
import {ProfileService}                   from "../../data/services/profile.service";
import {RouterLink} from "@angular/router";
import {fromEvent}                                              from "rxjs";

@Component({
  selector: 'app-communities-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SvgIconComponent,
        AsyncPipe,
        ImgUrlPipe,
        RouterLink
    ],
  templateUrl: './communities-page.component.html',
  styleUrl: './communities-page.component.scss',
})
export class CommunitiesPageComponent {
    profileService = inject(ProfileService);




    subscribersIvan$ = this.profileService.getSubscribersShortList(5);
    subscribersApl$ = this.profileService.getSubscribersShortList(4);
    subscribersFormula$ = this.profileService.getSubscribersShortList(3);
    subscribersAng$ = this.profileService.getSubscribersShortList(4);
    subscriberSaint$ = this.profileService.getSubscribersShortList(1);
    subscriberLyceum$ = this.profileService.getSubscribersShortList(4);


}
