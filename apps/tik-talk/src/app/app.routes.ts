import { Routes } from '@angular/router'
import {canActivateAuth, LoginPageComponent} from '@tt/auth'
import {FormsJobPageComponent, ProfilePageComponent, SearchPageComponent, SettingsPageComponent} from "@tt/profile";
import {chatsRoutes} from "@tt/chats";
import {LayoutComponent} from "@tt/layout";
import {CommunitiesPageComponent} from "@tt/communities";

export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: '', redirectTo: 'profile/me', pathMatch: 'full' },
			{ path: 'search', component: SearchPageComponent },
			{ path: 'profile/:id', component: ProfilePageComponent },
			{ path: 'settings', component: SettingsPageComponent },
			{ path: 'jobs', component: FormsJobPageComponent },
			{ path: 'communities', component: CommunitiesPageComponent },
			{
				path: 'chats',
				loadChildren: () => chatsRoutes //функция которая должна вернуть chatsRoutes
			}
			//делаем чтобы открытый чат был в url прописан
		],
		canActivate: [canActivateAuth]
	},
	{ path: 'login', component: LoginPageComponent }
]
