export interface Pageable<T> {
	items: T[]
	total: number
	page: number
	size: number
	pages: number
}

//эта некая функция js и мы передаём туда параметры(T) и как мы будем её использовать
//что мы в пэйджебл передадим тот тип и будет в item, дженерик
