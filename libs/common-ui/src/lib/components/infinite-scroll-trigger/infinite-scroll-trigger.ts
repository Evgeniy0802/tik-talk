import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	output
} from '@angular/core'

@Component({
	selector: 'tt-infinite-scroll-trigger',
	standalone: true,
	imports: [],
	templateUrl: './infinite-scroll-trigger.html',
	styleUrl: './infinite-scroll-trigger.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollTrigger implements OnInit {
	loaded = output<void>()
	ngOnInit() {
		this.loaded.emit() //инициализироался, до него дошло, дефер его прогрузил и он будет имитить что он готов
	}
}
