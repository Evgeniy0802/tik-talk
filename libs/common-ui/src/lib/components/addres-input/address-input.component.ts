import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	inject,
	signal
} from '@angular/core'
import {
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'
import { SvgIconComponent, TtInputComponent } from '@tt/common-ui'
import { DadataService } from '@tt/data-access/shared'
import { debounceTime, switchMap, tap } from 'rxjs'
import { AsyncPipe, JsonPipe } from '@angular/common'
import { DadataSuggestions } from '@tt/data-access/shared/interfaces/dadata.interfaces'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
	selector: 'tt-address-input',
	standalone: true,
	imports: [TtInputComponent, ReactiveFormsModule, AsyncPipe, SvgIconComponent],
	templateUrl: './address-input.component.html',
	styleUrl: './address-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => AddressInputComponent)
		}
	]
})
export class AddressInputComponent implements ControlValueAccessor {
	#dadataService = inject(DadataService)
	cdr = inject(ChangeDetectorRef)

	innerSearchControl = new FormControl()

	isDropdownOpened = signal<boolean>(true)

	addressForm = new FormGroup({
		city: new FormControl(''),
		street: new FormControl(''),
		building: new FormControl('')
	})

	suggestions$ = this.innerSearchControl.valueChanges.pipe(
		debounceTime(500),
		switchMap((value) => {
			return (
				this.#dadataService
					.getSuggestions(value)
					//заставляем дропдаун появляться только когда у нас что то появилось
					.pipe(
						tap((res) => {
							this.isDropdownOpened.set(!!res.length)
						})
					)
			)
		})
	)

	writeValue(city: string | null) {
		this.innerSearchControl.patchValue(city, {
			emitEvent: false
		})

		if (city) {
			const addressLine = city.split(', ') //разрезаем по пробелу  подсмотрел у антона сам не додумался даже

			this.addressForm.patchValue({
				city: addressLine[0] || '',
				street: addressLine[1] || '',
				building: addressLine[2] || ''
			})
		}
	}

	registerOnChange(fn: any) {
		this.onChange = fn
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn
	}

	setDisabledState(isDisabled: boolean) {}

	onChange(value: any) {}

	onTouched() {}

	onSuggestionsPick(suggest: DadataSuggestions) {
		this.isDropdownOpened.set(false)
		this.innerSearchControl.setValue(suggest.value, {
			emitEvent: false
		})
		// this.onChange(city)
		this.addressForm.patchValue({
			city: suggest.data.city || '',
			street: suggest.data.street || '',
			building: suggest.data.house || ''
		})
		this.onChange(this.innerSearchControl.value)
		this.cdr.detectChanges()
	}

	constructor() {
		this.addressForm.valueChanges //слушаем любые изм
			.pipe(takeUntilDestroyed()) // отп
			.subscribe((val) => {
				const pieceAddr = [val.city, val.street, val.building] //если польз стёр собираем строку
					.filter((addr) => addr) //фильтр чтобы адрр был полный
					.join(', ')
				this.onChange(pieceAddr)
			})
	}
}
