import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { Feature } from '../interfaces/job.interface'

@Injectable({
	providedIn: 'root'
})
export class JobsService {
	getAddresses() {
		return of([
			{
				country: 'Россия',
				city: 'Владимир',
				street: 'Сурикова',
				building: '10'
			},
			{
				country: 'Россия',
				city: 'Астрахань',
				street: 'Румынская',
				building: '52'
			}
		])
	}

	getFeature(): Observable<Feature[]> {
		return of([
			{
				code: 'dining',
				label: 'Столовая',
				value: true
			},
			{
				code: 'transport',
				label: 'Транспорт',
				value: true
			},
			{
				code: 'Parking',
				label: 'Парковка',
				value: true
			}
		])
	}
}
