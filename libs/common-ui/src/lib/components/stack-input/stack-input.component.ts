import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	HostBinding,
	HostListener,
	signal
} from '@angular/core'
import { SvgIconComponent } from '@tt/common-ui'
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR
} from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
	selector: 'tt-stack-input',
	imports: [SvgIconComponent, FormsModule, AsyncPipe],
	templateUrl: './stack-input.component.html',
	styleUrl: './stack-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => StackInputComponent)
		}
	]
})
export class StackInputComponent implements ControlValueAccessor {
	value$ = new BehaviorSubject<string[]>([])
	#disabled = false

	@HostBinding('class.disabled')
	get disabled(): boolean {
		return this.#disabled
	}

	innerInput = ''

	@HostListener('keydown.enter')
	onEnter() {
		if (!this.innerInput) return

		this.value$.next([...this.value$.value, this.innerInput])
		this.innerInput = ''
		this.onChange(this.value$.value)
	}

	registerOnChange(fn: any) {
		this.onChange = fn
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn
	}

	setDisabledState(isDisabled: boolean) {
		this.#disabled = isDisabled
	}

	writeValue(stack: string[] | null) {
		if (!stack) {
			this.value$.next([])
			return
		}

		this.value$.next(stack)
	}

	onChange(value: string[] | null) {}

	onTouched() {}

	onTagDelete(i: number) {
		const tags = this.value$.value
		tags.splice(i, 1)
		this.value$.next(tags)
		this.onChange(this.value$.value)
	}
}
