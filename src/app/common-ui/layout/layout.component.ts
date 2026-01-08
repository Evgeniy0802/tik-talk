import {Component, inject} from '@angular/core';
import {RouterOutlet}       from "@angular/router";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ProfileService} from "../../data/services/profile.service";

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  profileService = inject(ProfileService)

  ngOnInit() { //будет выполнен при старте этого компонента
    this.profileService.getMe().subscribe(val => { //получаем данные о себе при инициализации этого компонента
      console.log(val)
    })

  }
}
