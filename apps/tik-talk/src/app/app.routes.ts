import { Routes } from '@angular/router'
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { SearchPageComponent } from './pages/search-page/search-page.component'
import { LayoutComponent } from './common-ui/layout/layout.component'
import { canActivateAuth } from '@tt/auth'
import { SettingsPageComponent } from './pages/settings-page/settings-page.component'
import { CommunitiesPageComponent } from './pages/communities-page/communities-page.component'
import { chatsRoutes } from './pages/chats-page/chatsRoutes'
import { FormsJobPageComponent } from './pages/forms-job-page/forms-job-page.component'
import {ProfilePageComponent} from "@tt/profile";

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
