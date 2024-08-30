
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);
  // tasks = signal<Task[]>([
  //   {
  //     id: Date.now(),
  //     title: 'Instalar el Angular CLI',
  //     completed: false
  //   },
  //   {
  //     id: Date.now(),
  //     title: 'Crear proyecto',
  //     completed: false
  //   },
  //   {
  //     id: Date.now(),
  //     title: 'Crear componente',
  //     completed: false
  //   },
  //   {
  //     id: Date.now(),
  //     title: 'Crear servicio',
  //     completed: false
  //   },
  // ]);

  filter = signal<'all' | 'pending' | 'completed'>('all');

  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending'){
      return tasks.filter((task) => !task.completed);
    } else if (filter === 'completed'){
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  });

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/^\s*\S.*$/)
    ],
  });

  // Option 2
  injector = inject(Injector);


  // Option 1
  // constructor(){
  //   effect(() => {
  //     const tasks = this.tasks();
  //     console.log(tasks);
  //     localStorage.setItem('tasks', JSON.stringify(tasks));
  //   });
  // }

  ngOnInit(){
    const storage = localStorage.getItem("tasks");
    if (storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  // Continuing Option 2
  // Esto se hace si y sólo si el effect está en otra parte que no sea el constructor
  trackTasks(){
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, {injector: this.injector});
  }

  // // Como se hacía antes del form (directamente del elemento)
  // changeHandler(event: Event){
  //   const input = event.target as HTMLInputElement;
  //   const newTask = input.value;
  //   this.addTask(newTask);
  // }
  changeHandler(){
    if (this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value.trim();
      this.addTask(value);
    }
    this.newTaskCtrl.setValue('');  
  }

  addTask(title: string){
    const newTask:Task = {
      id: Date.now(),
      title: title,
      completed: false,
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number){
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }

  updateTask(index: number){
    this.tasks.update((tasks) => tasks.fill({...tasks[index], completed: !tasks[index].completed}, index, index +1 ));
    
    // // Otra formma de hacer el update
    // this.tasks.update((tasks) => tasks.map((task, position) => {
    //   if(position === index){
    //     task.completed = !task.completed;
    //   } 
    //   return task;
    // }));

    // // Otra formma de hacer el update
    // const updatedTasks = [...tasks];
      // updatedTasks[index] = {
      //   ...updatedTasks[index],
      //   completed: updatedTasks[index].completed ? false : true,
      // };
      // return updatedTasks;
    // });
  }

  updateTaskEditingMode(index: number){
    this.tasks.update((tasks) => tasks.map((task, position) => {
      return {...task, editing: position === index ? true : false}
    }));
  }

  updateTaskText(index: number, event: Event){
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => tasks.fill({...tasks[index], title: input.value, editing: false}, index, index +1 ));
    console.log(this.tasks()[index]);
  }

  changeFilter(filter: 'all' | 'pending' | 'completed'){
    this.filter.set(filter);
  }

}
