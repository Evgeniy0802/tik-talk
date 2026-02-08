import { Component, inject, signal } from '@angular/core'
import { ProfileHeaderComponent } from '../../ui'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { switchMap } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'
import { AsyncPipe } from '@angular/common'
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {PostFeedComponent} from "@tt/posts";
import {ProfileService} from "@tt/data-access/profiles";

@Component({
	selector: 'app-profile-page',
	imports: [
		ProfileHeaderComponent,
		AsyncPipe,
		SvgIconComponent,
		RouterLink,
		ImgUrlPipe,
		PostFeedComponent
	],
	templateUrl: './profile-page.component.html',
	styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
	profileService = inject(ProfileService)
	route = inject(ActivatedRoute)
	router = inject(Router)

	me$ = toObservable(this.profileService.me)
	subscribers$ = this.profileService.getSubscribersShortList(5)

	isMyPage = signal(false)

	profile$ = this.route.params
		//пошёл поток параметров, если мы будем не перезагружать страницу, а внутри находясь на этой страницы, постоянно кликать.
		//С другим id, то сюда в этот стрим будет сыпиться эти id
		//это у нас стрим и он каждый раз изменяется когда изменяется параметр роута
		.pipe(
			//деконструрируем значение и сразу забираем id
			switchMap(({ id }) => {
				this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id)
				//если me или мой айди тогда моя страница и не надо показывать возможность написать сообщение самому себе
				if (id === 'me') return this.me$
				//toObservable конвертация сигнала в observable

				return this.profileService.getAccount(id)
			})
		)

	async sendMessage(userId: number) {
			//после того как чат создаться, запрос ответит перенаправляем на чат с этим человеком айдишника
		this.router.navigate(['/chats', 'new'], {queryParams: {userId}})
	}
}
