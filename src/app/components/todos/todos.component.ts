import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  providers: [ApiService]
})
export class TodosComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', status: 'pending', dueDate: '' };
  isUpdating = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.apiService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  addTask(): void {
    if (this.validateTask()) {
      console.log('Adding Task:', this.newTask);
      this.apiService.addTask(this.newTask).subscribe(
        (task) => {
          this.tasks.push(task);
          this.resetForm();
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      );
    } else {
      console.error('Title or due date is missing!');
    }
  }

editTask(task: Task): void {
  this.newTask = { ...task };
  // Convert the ISO date to 'yyyy-MM-dd' format
  this.newTask.dueDate = new Date(task.dueDate).toISOString().split('T')[0]; // 'yyyy-MM-dd'
  this.isUpdating = true;
}


updateTask(): void {
  if (this.validateTask()) {
    if (this.newTask._id) {
      this.apiService.updateTask(this.newTask._id, this.newTask).subscribe(
        (updatedTask) => {
          const index = this.tasks.findIndex(t => t._id === updatedTask._id);
          this.tasks[index] = updatedTask;
          this.resetForm();  // Reset form after updating
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    } else {
      console.error('Task does not have a valid _id!');
    }
  } else {
    console.error('Title or due date is missing!');
  }
}

deleteTask(id: string): void {
  if (id) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      this.apiService.deleteTask(id).subscribe(
        () => {
          this.tasks = this.tasks.filter(task => task._id !== id);
          // Reset form after deletion
          this.resetForm();
        },
        (error) => {
          console.error('Error deleting task:', error);
        }
      );
    }
  }
}


  validateTask(): boolean {
    return !!this.newTask.title && !!this.newTask.dueDate && !isNaN(new Date(this.newTask.dueDate).getTime());
  }

 resetForm(): void {
  this.newTask = { title: '', status: 'pending', dueDate: '' };
  this.isUpdating = false;
}
}
