import { Pipe, PipeTransform } from '@angular/core'
import { DateTime } from 'luxon'

@Pipe({
	name: 'dateTime',
	standalone: true
})
export class DateTimePipe implements PipeTransform {
	transform(value: string | null): any {
		if (!value) return ''
		//если нет значения возвращаем пустую строчку

		const time = DateTime.fromISO(value, { zone: 'utc' })
		//fromIso для преобразования строки медот в люксоне

		return time.toRelative()
		//вычисляет дату с текущим моментом и заданной датой
	}
}
