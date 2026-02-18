import { Component, Input } from '@angular/core'

@Component({
	selector: 'svg[icon]',
	standalone: true,
	//все svg у который будет указываться атрибут icon, станут этим компонентом
	imports: [],
	template: '<svg:use [attr.href]="href"></svg:use>',
	styles: ['']
	//будем байдить некий арибут href, байдим атрибут к переменной
	//наша переменная будет гетером.
	//гетером она будет для того что-бы на лету вычисляться свободно
})
export class SvgIconComponent {
	@Input() icon = ''

	get href() {
		return `/assets/svg/${this.icon}.svg#${this.icon}`
		//для этого синитаксиса нужно внутри файла svg сослаться на определённый символ с id
	}
}
