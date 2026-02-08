import { Component, ElementRef, inject, Renderer2 } from '@angular/core'
import {
	AbstractControl,
	FormArray,
	FormControl,
	FormGroup,
	FormRecord,
	ReactiveFormsModule,
	ValidatorFn,
	Validators
} from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { KeyValuePipe } from '@angular/common'
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs'
import { MaskitoDirective } from '@maskito/angular'
import { JobsService } from '../../data/services/job.service'
import { Feature, OperationOption } from '../../data/interfaces/job.interface'
import { NameValidator } from './name.validator'
import { MaskitoOptions } from '@maskito/core'
import {OnlyNumberDirective} from "@tt/common-ui";

function validateStartWith(forbiddenLetter: string): ValidatorFn {
	return (control: AbstractControl) => {
		return control.value.startsWith(forbiddenLetter)
			? {
					startsWith: {
						message: `${forbiddenLetter} - последняя буква алавита!`
					}
				}
			: null
	}
}

function validateDateRange({
	fromControlName,
	toControlName
}: {
	fromControlName: string
	toControlName: string
}) {
	return (control: AbstractControl) => {
		const fromControl = control.get(fromControlName)
		const toControl = control.get(toControlName)

		if (!fromControl || !toControl) return null

		const fromDate = new Date(fromControl.value)
		const toDate = new Date(toControl.value)

		if (fromDate && toDate && fromDate > toDate) {
			toControl.setErrors({
				dateRange: {
					message: 'Дата начала не может быть позднее даты конца'
				}
			})
			return {
				dateRange: {
					message: 'Дата начала не может быть позднее даты конца'
				}
			}
		}
		return null
	}
}

enum ReceiverType {
	executor = 'executor',
	responsible = 'responsible',
	supervisor = 'supervisor',
	analyst = 'analyst'
}

enum Operation {
	acceptance = 'acceptance',
	assembly = 'assembly',
	shipment = 'shipment',
	layout = 'layout',
	roll = 'roll',
	hourly = 'hourly',
	inventory = 'inventory',
	repackaging = 'repackaging',
	sorting = 'sorting'
}

interface Address {
	region?: string
	city?: string
	street?: string
	building?: number
}

function getAddressForm(initialValue: Address = {}) {
	return new FormGroup({
		region: new FormControl<string>(initialValue.region ?? ''),
		city: new FormControl<string>(initialValue.city ?? ''),
		street: new FormControl<string>(initialValue.street ?? ''),
		building: new FormControl<number | null>(initialValue.building ?? null)
	})
}

@Component({
	selector: 'app-forms-job',
	imports: [
		ReactiveFormsModule,
		KeyValuePipe,
		OnlyNumberDirective,
		MaskitoDirective
	],
	templateUrl: './forms-job-page.component.html',
	styleUrl: './forms-job-page.component.scss'
})
export class FormsJobPageComponent {
	ReceiverType = ReceiverType
	formsService = inject(JobsService)
	features: Feature[] = []
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)
	private destroy$ = new Subject()
	nameValidator = inject(NameValidator)
	operations: OperationOption[] = [
		{
			value: Operation.acceptance,
			label: 'Приёмка'
		},
		{
			value: Operation.assembly,
			label: 'Сборка'
		},
		{
			value: Operation.shipment,
			label: 'Отгрузка'
		},
		{
			value: Operation.layout,
			label: 'Раскладка'
		},
		{ value: Operation.roll, label: 'Перекат' },
		{ value: Operation.hourly, label: 'Часовой' },
		{
			value: Operation.inventory,
			label: 'Инвентаризация'
		},
		{
			value: Operation.repackaging,
			label: 'Переупаковка'
		},
		{
			value: Operation.sorting,
			label: 'Сортировка'
		}
	]

	initialValue = {
		organization: 'ООО Вайлберисс',
		type: ReceiverType.executor,
		name: '',
		lastName: '',
		operation: Operation.acceptance,
		areaResponsibility: '',
		id: '',
		telephone: '',
		snils: ''
	}

	form = new FormGroup({
		organization: new FormControl(
			this.initialValue.organization,
			Validators.required
		),
		type: new FormControl(this.initialValue.type, Validators.required),
		name: new FormControl(
			this.initialValue.name,
			Validators.required
			//[this.nameValidator.validate.bind(this.nameValidator)]
		),
		lastName: new FormControl(this.initialValue.lastName, Validators.required),
		operation: new FormControl(
			this.initialValue.operation,
			Validators.required
		),
		areaResponsibility: new FormControl(
			this.initialValue.areaResponsibility,
			Validators.required
		),
		id: new FormControl(this.initialValue.id, Validators.required),
		telephone: new FormControl(this.initialValue.telephone, [
			Validators.required
			//Validators.pattern(/^(\+7|8)\d{10}$/)
		]),
		snils: new FormControl(this.initialValue.snils, [
			Validators.required,
			Validators.minLength(11),
			Validators.maxLength(11)
		]),
		addresses: new FormArray([getAddressForm()]),
		feature: new FormRecord({}),
		dateRange: new FormGroup(
			{
				from: new FormControl<string>(''),
				to: new FormControl<string>('')
			},
			validateDateRange({
				fromControlName: 'from',
				toControlName: 'to'
			})
		)
	})

	constructor() {
		this.formsService
			.getAddresses()
			.pipe(takeUntilDestroyed())
			.subscribe((addrs) => {
				//нужно очистить значение FA от предудущих контролов
				while (this.form.controls.addresses.controls.length > 0) {
					//на каждой итерации цикла он удаляет первый попавшийся контрол,
					//удаляет пока они не кончатся
					this.form.controls.addresses.removeAt(0)
				}
			})

		//this.form.controls.addresses.clear();

		//for (const addr of addrs) {
		//@ts-ignore
		//можно передать в getAddressForm (addr)
		//this.form.controls.addresses.push(getAddressForm());
		// }

		// @ts-ignore
		//this.form.controls.addresses.setValue(addrs);

		//@ts-ignore
		//setControl по индексу заменит на что то другое
		//this.form.controls.addresses.setControl(1, getAddressForm(addrs[0]))

		//нужен чтобы взять контрол по определенному индексу
		//this.form.controls.addresses.at(0)
		//});

		this.form.controls.type.valueChanges //слежка за контролом
			.pipe(takeUntilDestroyed())
			.subscribe((value) => {
				this.form.controls.operation.clearValidators()
				if (value === ReceiverType.executor) {
					this.form.controls.areaResponsibility.clearValidators()
				}
				if (
					value === ReceiverType.supervisor ||
					value === ReceiverType.analyst
				) {
					this.form.controls.areaResponsibility.clearValidators()
					this.form.controls.operation.clearValidators()
					this.form.controls.id.clearValidators()
				}
			})

		this.formsService
			.getFeature()
			.pipe(takeUntilDestroyed())
			.subscribe((features) => {
				this.features = features

				for (const feature of features) {
					this.form.controls.feature.addControl(
						feature.code,
						new FormControl(feature.value)
					)
				}
			})

		//Програмно задавать значение формам
		//const formPatch = {
		//name: 'Alesha',
		//lastName: 'Popovich',
		//};
		//this.form.patchValue(formPatch);//можете передать неполный объект
		//this.form.setValue() //можем передать только полнй объект

		//подписываемся на изменение формы
		//this.form.valueChanges.subscribe((value) => {
		//console.log(value);
		//});

		//слушатели не услышат в консоли изменение
		//this.form.patchValue(formPatch, {
		//emitEvent: false,
		//});

		this.form.controls.organization.disable()
	}

	addAddress() {
		//this.form.controls.addresses.push(getAddressForm());
		//еще один метод
		const newAddressForm = getAddressForm()
		this.form.controls.addresses.insert(0, newAddressForm)
	}

	deleteAddress(index: number) {
		this.form.controls.addresses.removeAt(index, {
			emitEvent: false
		})
	}

	readonly dateMask: MaskitoOptions = {
		mask: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]
	}

	readonly phoneMask: MaskitoOptions = {
		mask: [
			'+',
			'7',
			' ',
			'(',
			/\d/,
			/\d/,
			/\d/,
			')',
			' ',
			/\d/,
			/\d/,
			/\d/,
			'-',
			/\d/,
			/\d/,
			'-',
			/\d/,
			/\d/
		]
	}

	onSubmit(event: SubmitEvent) {
		this.form.markAllAsTouched()
		this.form.updateValueAndValidity()

		console.log(this.form.valid)

		//если это задокументировать то при сабмите формы будут показываться поле с ошибками
		this.form.reset(this.initialValue)

		//console.log(this.form.value);
		//console.log(this.form.valid);

		//заменяем поле и можем в ресете указать на что ресетить name: Lucas, можем ресетить контролы
		//this.form.reset();
	}

	sort = () => 0
	protected readonly Operation = Operation

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 36
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}

	ngAfterViewInit() {
		this.resizeFeed()
		fromEvent(window, 'resize')
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe()
	}

	onInputScroll(event: Event) {
		const input = event.target as HTMLInputElement

		this.r2.setStyle(input, 'height', 'auto')
		this.r2.setStyle(input, 'height', input.scrollHeight + 'px')
	}
}

//чтобы страница не перезагружалась задаём FormGroup
//enum это просто именованный список констант, который помогает не запутаться в значениях
//чтобы  форму привязать к html, надо у контролв дать имена formControlName
//можем в самой форме если нужно в род элементе разместить форм группу: formGroupName указываем
//Валидаторы можно передавать с помощью массива, например required и minLength(10), должно быть мин 10 цифр
//1) valueChanges это поток Observable, который кричит каждый раз, когда меняется значение в поле ввода или во всей форме целиком.
//2) используем subscribe чтобы следаить за актульным значением, если к чему то подписываемся то всегда надо отписываться
//Чтобы запачить форму значением используем patchValue() - можем передать небольшой объект не содержащий всех значений формы
//setValue требует передачи всех значений формы, полный объект
//в patchValue вторым аргументом можно передать объект настроек, можем программной поменять значение формы
//reset это значит очистить форму и можно передать на что ресетить другие значение
//disable нельзя на контрол нажать, getRawValue это метод, который позволяет вытащить абсолютно все данные из формы, включая те поля, которые в данный момент заблокированы
//nonNullable запрещает значению поля превращаться в null, даже если ты вызываешь сброс формы, можно прописать начальное значение и оно будет при ресете выводить начальное значение
//setControl по этому индексу заменит на что то другое
//at() нужен  чтобы взять контрол по индексу и делать с ним что угодно
//clear удаляет все элементы из массива делая его пустым
//регулярные выражения!!!
//Maskito библиотек для номеров телефонов, карт, дат и прочее!!!
//1)sort() сортирует массив, принимает сравнитель, пишется по апределенному алгоритму возвращает 1,0,-1.
//2)Понимать как работает sort!!!
//4-5 урок по формам внедрить!!!
//замыкание внизу
// function validateStartWith(forbidenLetter: string): ValidatorFn {
//   return (control: AbstractControl) => {
//     return control.value.startsWith(forbidenLetter)
//     ? {startsWith: {message:`${forbidenLetter} - последняя буква алфавита!`}}
//     : null
//   }
// }
