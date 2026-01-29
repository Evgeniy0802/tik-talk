import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService}                       from "../../auth/auth.service";
import {delay, from, map, skip, take, tap} from "rxjs";
import {Router}                                                  from "@angular/router";
import {SvgIconComponent} from "../../common-ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-login-page',
    imports: [
        ReactiveFormsModule,
        SvgIconComponent
    ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  authService = inject(AuthService)
  router = inject(Router)

  isPasswordVisible = signal<boolean>(false) //контейнер для значения, который имеет тип boolean, превостепено он будет false

  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  })

  onSubmit(event: Event) {
    console.log(this.form.value)

    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value)
          .subscribe( res => {
            this.router.navigate(['']) //делаем навигаицю на пустую строку, на корень проекта
            console.log(res)
          })
    }
  }

  // constructor() {
  //   let a = 0
  //   from([1,2,3,4,5,6,7,8,9])
  //       .pipe(
  //           map(val => val * 2), //мэпит так же как в массивах, он что то изменяет
  //           tap((val) => { //он берет значение, ты можешь с ним что то сделать, но он никак на конвеер не влияет
  //             a = val                 //можем получить значение и что то с ним сделать, обычно сохранить во внешнюю переменную
  //                                   //можем написать функцию, которая может поработать с каждым конкретным значением, которое пролетает мимо
  //
  //           })
  //
  //       )
  //       .subscribe(val => {
  //         console.log('subscribe', val)
  //       })
  // }
}
