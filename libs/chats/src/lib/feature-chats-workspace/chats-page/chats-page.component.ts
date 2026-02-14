import {Component, inject, OnInit} from '@angular/core'
import { RouterOutlet }            from '@angular/router'
import {ChatsListComponent} from "../chats-list/chats-list.component";
import {ChatsService} from "@tt/data-access/chats";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-chats-page',
	imports: [ChatsListComponent, RouterOutlet],
	templateUrl: './chats-page.component.html',
	styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {
	#chatService = inject(ChatsService);

	// constructor() {
	// 	this.#chatService.connectWs()
	// 		.pipe(
	// 			takeUntilDestroyed()
	// 		)
	// 		.subscribe()
	// }
	// ngOnInit() {
	// 	//приконектимся к веб сокету
	// 	this.#chatService.connectWs().subscribe()
	// }
}
