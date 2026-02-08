import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
	selector: '[onlyNumber]'
})
export class OnlyNumberDirective {
	constructor(private el: ElementRef) {}

	@HostListener('keypress', ['$event'])
	//@HostListener('keypress', ['$event']). Это дает нам контроль до того, как буква появится на экране.
	onKeyPress(event: KeyboardEvent) {
		const pattern = /[0-9]/ //разрешает цифры от 0 до 9;
		const inputChar = String.fromCharCode(event.charCode)
		//Мы используем String.fromCharCode(event.charCode), чтобы понять, что за символ хочет ввести пользователь.
		// Если символ не соответствует паттерну (т.е. это буква или другой символ),
		// предотвращаем действие по умолчанию (ввод символа)
		if (!pattern.test(inputChar)) {
			event.preventDefault()
			return false
		}
		return true
	}
}
