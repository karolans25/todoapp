import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'hola';

  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear componente',
    'Crear servicio'
  ]);
  
  name = signal('Carolina');
  age = 18;
  disabled = true;
  img = 'https://w3schools.com/howto/img_avatar.png';

  person = signal({
    name: 'Carolina',
    age: 5,
    avatar: 'https://w3schools.com/howto/img_avatar.png'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
    validators: [Validators.required],
  })
  nameCtrl = new FormControl(50, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^\s*\S.*$/),
    ],
  })


  constructor(){
    this.colorCtrl.valueChanges.subscribe(value => {console.log(value);});
  }

  clickHandler(){
    alert('Hola');
  }

  changeHandler(event: Event){
    // console.log(event);
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
    this.person.update(prevState => {return {...prevState, name: newValue}});
  }

  changeAge(event: Event){
    // console.log(event);
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {return {...prevState, age: parseInt(newValue, 10)}});
  }

  keydownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    // console.log(input.value);
    const newValue = input.value;
    this.name.set(newValue);    
  }
  
}
