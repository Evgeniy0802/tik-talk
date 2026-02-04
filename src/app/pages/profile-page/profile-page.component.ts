import { Component, inject, signal } from '@angular/core'
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component'
import { ProfileService } from '../../data/services/profile.service'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { firstValueFrom, switchMap } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'
import { AsyncPipe } from '@angular/common'
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component'
import { SubscriberCardComponent } from '../../common-ui/sidebar/subscriber-card/subscriber-card.component'
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe'
import { PostFeedComponent } from './post-feed/post-feed.component'
import { ChatsService } from '../../data/services/chats.service'

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
	styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
	profileService = inject(ProfileService)
	chatsService = inject(ChatsService)
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
		firstValueFrom(this.chatsService.createChat(userId))
			//после того как чат создаться, запрос ответит перенаправляем на чат с этим человеком айдишника
			.then((res) => {
				this.router.navigate(['/chats', res.id])
			})
	}
}
