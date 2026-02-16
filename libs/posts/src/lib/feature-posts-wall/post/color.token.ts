import { InjectionToken } from '@angular/core'

export const Color = new InjectionToken<string>('Is is border color', {
	providedIn: 'root',
	factory: () => 'red' //получаем значение по умолчанию red
}) //сообщеие без ошибки
//завели какое то значение в индекшион токен и передаём какое то значение

export const TIMELINE_SERVICE = new InjectionToken<string>('TIMELINE_SERVICE')
