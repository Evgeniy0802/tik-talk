import { Component, effect, inject, ViewChild } from '@angular/core'
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component'
import {
	FormBuilder,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { firstValueFrom } from 'rxjs'
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { AsyncPipe } from '@angular/common'
import { toObservable } from '@angular/core/rxjs-interop'
import {SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/profile";

@Component({
	selector: 'app-settings-page',
	imports: [
		ProfileHeaderComponent,
		ReactiveFormsModule,
		AvatarUploadComponent,
		SvgIconComponent,
		RouterLink,
		AsyncPipe
	],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
	fb = inject(FormBuilder)
	//дай нам formBuilder
	profileService = inject(ProfileService)
	route = inject(ActivatedRoute)

	@ViewChild(AvatarUploadComponent) avatarUploader!: any
	//можем в аргументы поместить либо текст "pew" и в html можем сделать шаблонную ссылку и он собственно, на какую переменную мы его повесим, та переменная и запишет #pew, если children,то он запишет все pew которые будут
	//можем передать не только строку, но и название класса
	//тогда он возьмёт его никак html элемент, а как angular компонент
	//потомок вьюхи

	profile$ = toObservable(this.profileService.me)

	form = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		username: [{ value: '', disabled: true }, Validators.required],
		description: [''],
		stack: [''],
		city: ['']
	})

	constructor() {
		effect(() => {
			//@ts-ignore
			this.form.patchValue({
				...this.profileService.me(),
				//@ts-ignore
				stack: this.mergeStack(this.profileService.me()?.stack)
				//нам придёт массив обязательно или нуль мы его обязательно смержим
			})
		})
	}

	//ngAfterViewInit() {
	//this.avatarUploader.avatar
	//}
	//после того как вьюха активирована можно брать её потомков

	clearForm() {
		this.form.reset()
	}

	onSave() {
		this.form.markAllAsTouched()
		//сделай так как будто мы с формой интерактивили
		this.form.updateValueAndValidity()

		if (this.form.invalid) return

		if (this.avatarUploader.avatar) {
			firstValueFrom(
				this.profileService.uploadAvatar(this.avatarUploader.avatar)
			)
			//если аватар есть загрузим его
		}

		firstValueFrom(
			//@ts-ignore
			this.profileService.patchProfile({
				...this.form.value,
				stack: this.splitStack(this.form.value.stack)
			})
		)
	}

	splitStack(stack: string | null | string[] | undefined): string[] {
		if (!stack) return []
		if (Array.isArray(stack)) return stack
		//если это массив тогда возвращаем stack

		return stack.split(',')
		//split — это «ножницы», которые делают из одной строки удобный список элементов.
	}

	mergeStack(stack: string | null | string[] | undefined) {
		if (!stack) return ''
		if (Array.isArray(stack)) return stack.join(',')
		// если перед нами список (массив), склеить все его элементы в одну строку через запятую.

		return stack
	}
}
