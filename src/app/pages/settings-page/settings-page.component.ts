import {Component, effect, inject} from '@angular/core';
import {ProfileHeaderComponent}    from "../../common-ui/profile-header/profile-header.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProfileService} from "../../data/services/profile.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fb = inject(FormBuilder)
  //дай нам formBuilder
  profileService = inject(ProfileService)

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: ['']
  })

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack)
        //нам придёт массив обязательно или нуль мы его обязательно смержим
      })
    })
  }

  onSave() {
    this.form.markAllAsTouched()
    //сделай так как будто мы с формой интерактивили
    this.form.updateValueAndValidity()

    if (this.form.invalid) return

    //@ts-ignore
    firstValueFrom(this.profileService.patchProfile({
      ...this.form.value,
      stack: this.splitStack(this.form.value.stack)
    }))
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return []
    if (Array.isArray(stack)) return stack
    //если это массив тогда возвращаем stack

    return stack.split(',')
    //split — это «ножницы», которые делают из одной строки удобный список элементов.
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return ''
    if (Array.isArray(stack)) return stack.join(',')
    // если перед нами список (массив), склеить все его элементы в одну строку через запятую.

    return stack
  }
}
