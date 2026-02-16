import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	input,
	signal
} from '@angular/core'
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'

@Component({
	selector: 'tt-input',
	imports: [ReactiveFormsModule, FormsModule],
	templateUrl: './tt-input.component.html',
	styleUrl: './tt-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => TtInputComponent) //когда запускается код декоратор объекта в нём может не быть TtInputComponent, функция forward нам помогает
		}
	]
})
export class TtInputComponent implements ControlValueAccessor {
	type = input<'text' | 'password'>('text')
	placeholder = input<string>()

	disabled = signal<boolean>(false)

	onChange: any
	onTouched: any

	value: string | null = null

	writeValue(val: string | null) {
		console.log(val)
		this.value = val //двухсторон связ. Вызывал функ со знач которое ему прилитело. Нужно заставить наш контрол получить это знач
	}

	registerOnChange(fn: any): void {
		//функция которая будет на сетапе контрола вызываться и прокидывает другую функцию
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	setDisabledState(isDisabled: boolean): void {
		//this.disabled.set(isDisabled)
	}

	onModelChange(val: string | null): void {
		//this.onChange(val) //двухсторонее связывание, меняется значение
	}
}
