import {Component, HostBinding, inject} from '@angular/core';
import {SvgIconComponent}               from "../svg-icon/svg-icon.component";
import {AsyncPipe, JsonPipe, NgForOf} from "@angular/common";
import {SubscriberCardComponent}      from "./subscriber-card/subscriber-card.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ProfileService}               from "../../data/services/profile.service";
import {firstValueFrom, Observable}   from "rxjs";
import {Pageable}                     from "../../data/interfaces/pageable.interface";
import {Profile}                      from "../../data/interfaces/profile.interface";
import {ImgUrlPipe}                   from "../../helpers/pipes/img-url.pipe";

@Component({
    selector: 'app-sidebar',
    imports: [
        SvgIconComponent,
        SubscriberCardComponent,
        RouterLink,
        AsyncPipe,
        JsonPipe,
        ImgUrlPipe,
        RouterLinkActive
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
    profileService = inject(ProfileService)

    me = this.profileService.me

    subscribers$ = this.profileService.getSubscribersShortList()
    //если стрим значит нужен знак $

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: 'profile/me'
        },
        {
            label: 'Сообщества',
            icon: 'communities',
            link: 'communities'
        },
        {
            label: 'Чаты',
            icon: 'chats',
            link: 'chats'
        },
        {
            label: 'Поиск',
            icon: 'search',
            link: 'search'
        }
    ]

    //получаем себя
    ngOnInit() {
        firstValueFrom(this.profileService.getMe())
    }

    @HostBinding('class.filelogout')
    filelogout = false

    showLogout() {
        this.filelogout = true;
    }
}
