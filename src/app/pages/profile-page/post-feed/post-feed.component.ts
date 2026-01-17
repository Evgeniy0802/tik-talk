import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {PostInputComponent}                                     from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService}               from "../../../data/services/post.service";
import {firstValueFrom, fromEvent} from "rxjs";

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  hostElement = inject(ElementRef) //нужна для того чтобы мы рендерелись на абсолютно разных платформах
  r2 = inject(Renderer2)

  feed = inject(PostService).posts

  @HostListener('window:resize')
  onWindowResize() {
    //потом будем вызывать тут
    console.log(123)
    this.resizeFeed()
  }


  //узнать динамическую велечину до конца страницы, делаем overflow-y: scroll
  //чтобы получить хост элемент на котором находится этот компонент, сам селектор компонента app-post-feed



  //нужно прогреть наше состояние
  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  ngAfterViewInit() {
    //вызовем её тут первый раз
    this.resizeFeed()

    fromEvent(window, 'resize')
        .subscribe(() => {
          console.log(123)
        })
  }

  //узнать динамическую велечину до конца страницы, делаем overflow-y: scroll
  //чтобы получить хост элемент на котором находится этот компонент, сам селектор компонента app-post-feed
  resizeFeed() {
    //посмотреть как далеко от вера экрана расположен  этот элемент
    const {top} = this.hostElement.nativeElement.getBoundingClientRect() //пришлёт координаты где расположен элемент

    const height = window.innerHeight - top - 24 - 24
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);

  }
}
