import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(createTaskDto: CreateTaskDto): Task {

        const { description, title } = createTaskDto;
        const task: Task = {
            id: v4(),
            title: title,
            description: description,
            status: TaskStatus.OPEN
        };
        console.log(task);
        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(k => k.id !== id);
    }

    updateTaskStatus(id: string, status: string) {

        const task = this.tasks.find(k => k.id === id);
        task.status = status;
        return task;
    }
}
