import {Directive, ElementRef, EventEmitter, HostListener, inject, Output} from "@angular/core";

@Directive({
    selector: '[clickDnd]',
})

export class ClickDirective {
    // Output-свойство, которое будет отправлять булево значение.
    // true = показать, false = скрыть.
    @Output() clickApp = new EventEmitter<boolean>()
    //Определяет пользовательское событие, которое будет испускаться (emit), когда пользователь нажимает снаружи элемента.

    // Внутренняя переменная для отслеживания текущего состояния
    private isVisible: boolean = false

    constructor(private el: ElementRef) {

    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        // Проверяем, был ли клик внутри элемента, к которому привязана директива.
        // event.target - это элемент, по которому был произведён клик.
        //Является ли элемент, по которому был сделан клик, потомком или самим элементом, к которому привязана эта директива?
        const clickIn = this.el.nativeElement.contains(event.target as HTMLElement)

        if (clickIn) {
            // Если клик был внутри переключаем состояние
            this.isVisible = true
        } else {
            //если клик снаружи был возвращаем изначальное состояние
            this.isVisible = false
        }

        //отправляем текущее состояние компоненту
        this.clickApp.emit(this.isVisible)
    }
}