import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DaDataToken } from './token'
import { map } from 'rxjs'
import { DadataSuggestions } from '../interfaces/dadata.interfaces'

@Injectable({
	providedIn: 'root'
})
export class DadataService {
	#apiUrl =
		'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
	#http = inject(HttpClient)

	getSuggestions(query: string) {
		return this.#http
			.post<{ suggestions: DadataSuggestions[] }>(
				this.#apiUrl,
				{ query },
				{
					headers: {
						Authorization: `Token ${DaDataToken}`
					}
				}
			)
			.pipe(
				map((res) => {
					return res.suggestions
					// return Array.from(
					// 	new Set(
					// 		res.suggestions.map((suggestions) => {
					// 			return suggestions.data.city
					// 		})
					// 	)
					// )
				})
			)
	}
}
