import {
	Directive,
	EventEmitter,
	HostBinding,
	HostListener,
	Output
} from '@angular/core'

@Directive({
	selector: '[dnd]',
	standalone: true
})
export class DndDirective {
	@Output() fileDropped = new EventEmitter<File>()
	//@Output помогает сделать своё событие которое мы будем эмитить из компонента

	@HostBinding('class.fileover')
	fileover = false
	//теперь элемент на котором висит эта директива при fileover true у неё будет добавляться class fileover

	//когда мы перетягиваем картинку в дроп зону, картинка открывается в браузере, а надо чтобы загружалась в наш аватар
	@HostListener('dragover', ['$event'])
	//@HotListener слушать событие dragover
	//dragover это событие когда м тащим мышкой и нависаем над дроп зоной, над тем на что мы повесили нашу директиву
	//второй параметр HostListener это аргументы, которые попадут в функцию которую мы декорируем
	onDragOver(event: DragEvent) {
		event.preventDefault()
		event.stopPropagation()

		this.fileover = true
	}
	//dragover одного не хватит поэтому надо поддержать и , собственно из них 3 и состоит dragonDrop

	@HostListener('dragleave', ['$event'])
	onDragLeave(event: DragEvent) {
		event.preventDefault()
		event.stopPropagation()

		this.fileover = false
	}

	@HostListener('drop', ['$event'])
	onDrop(event: DragEvent) {
		event.preventDefault()
		event.stopPropagation()

		this.fileover = false

		this.fileDropped.emit(event.dataTransfer?.files[0])
		//у drop события есть поле dataTransfer то есть что же ты там протрансферил какую дату

		//нам нужно чтобы при drop, мы должны получить файл который дропнули  и отдать его
	}
}
