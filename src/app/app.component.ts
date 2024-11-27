import {  HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './components/todos/todos.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TodosComponent,HttpClientModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'toDoApp';

}
