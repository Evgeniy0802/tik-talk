import { Component, inject, OnDestroy } from '@angular/core'
import {
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms'
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs'
import {SvgIconComponent} from "@tt/common-ui";
import {profileActions, ProfileService} from "@tt/data-access/profiles";
import {Store} from "@ngrx/store";

@Component({
	selector: 'app-profile-filters',
	imports: [FormsModule, ReactiveFormsModule, SvgIconComponent],
	templateUrl: './profile-filters.component.html',
	styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent implements OnDestroy {
	// implements OnDestroy озночает что мы обязуемся основываться на интерфейсе onDestroy, а это значит что должен быть такой метод
	fb = inject(FormBuilder)
	profileService = inject(ProfileService)
	store = inject(Store)

	searchForm = this.fb.group({
		firstName: [''],
		lastName: [''],
		stack: ['']
	})

	searchFormSub!: Subscription

	constructor() {
		//valueChanges даёт возможность подписаться на то что будет в изменение формы
		this.searchFormSub = this.searchForm.valueChanges
			.pipe(
				startWith({}),
				debounceTime(300),
				//takeUntilDestroyed()
				//takeUntil(this.destroy$)
				//takeUntil() значит что мы будем исполнять и применять эту подписку до тех пор пока не закончится стрим который мы укажем в takeUntil
			)
			.subscribe(formValue => {
				this.store.dispatch(profileActions.filterEvents({filters: formValue}))
			})
	}

	ngOnDestroy() {
		//хук который вызовется тогда, когда компонент будет уничтожаться
		this.searchFormSub.unsubscribe()
	}

	//это плохо потмоу что есть какой то searchForm и мы повесили какой то обработчик, мы ждём слушаем значение
	//потом уходим на другую страницу нам он уже не нужен, а обработчик там еще висит, он еще слушает, надо за собой прибраться
}
