import {Component, inject} from '@angular/core';
import {ProfileHeaderComponent} from "../../common-ui/profile-header/profile-header.component";
import {ProfileService}             from "../../data/services/profile.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {switchMap}                  from "rxjs";
import {toObservable} from "@angular/core/rxjs-interop";
import {AsyncPipe} from "@angular/common";
import {SvgIconComponent} from "../../common-ui/svg-icon/svg-icon.component";
import {SubscriberCardComponent} from "../../common-ui/sidebar/subscriber-card/subscriber-card.component";
import {ImgUrlPipe} from "../../helpers/pipes/img-url.pipe";
import {PostFeedComponent} from "./post-feed/post-feed.component";

@Component({
  selector: 'app-profile-page',
    imports: [
        ProfileHeaderComponent,
        AsyncPipe,
        SvgIconComponent,
        RouterLink,
        SubscriberCardComponent,
        ImgUrlPipe,
        PostFeedComponent
    ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);

  me$ = toObservable(this.profileService.me)
  subscribers$ = this.profileService.getSubscribersShortList(5)

  profile$ = this.route.params
     //пошёл поток параметров, если мы будем не перезагружать страницу, а внутри находясь на этой страницы, постоянно кликать.
     //С другим id, то сюда в этот стрим будет сыпиться эти id
      //это у нас стрим и он каждый раз изменяется когда изменяется параметр роута
     .pipe(
         //деконструрируем значение и сразу забираем id
         switchMap(({id}) => {
           //toObservable конвертация сигнала в observable
           if (id === 'me') return this.me$

           return this.profileService.getAccount(id)
         })
     )
}
