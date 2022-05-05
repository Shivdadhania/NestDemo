import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './dto/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: {
                id: id,
                user: user
            },
        });

        if (!found) {
            throw new NotFoundException(`Task Id ${id} not found for given user`);
        }
        return found;
    }

    async getAllTasks(user: User): Promise<Task[]> {
        const task = this.taskRepository.createQueryBuilder('task').where({ user }).getMany();
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { description, title } = createTaskDto;
        const task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
        await this.taskRepository.save(task);
        return task;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        // const found = await this.getTaskById(id);
        // this.tasks = this.tasks.filter(k => k.id !== found.id);

        const result = await this.taskRepository.delete({ id, user });
        console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task Id ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User) {

        const found = await this.getTaskById(id, user);
        found.status = status;
        await this.taskRepository.save(found);

        return found;
    }

    async getTasksWithFilters(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        let tasks = await this.getAllTasks(user);

        if (status) {
            tasks = tasks.filter(k => k.status === status);
        }
        if (search) {
            tasks = tasks.filter(k => {
                if (k.title.includes(search) || k.description.includes(search)) {
                    return true;
                }
                return false;
            });
        }

        return tasks;
    };
}
