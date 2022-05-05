// import { InjectRepository } from '@nestjs/typeorm';
// import { Task } from './task.entity';
// import { EntityRepository, Repository } from 'typeorm';
// import { CreateTaskDto } from './create-task.dto';
// import { TaskStatus } from '../task.model';

// @EntityRepository(Task)
// export class TaskRepository extends Repository<Task> {
//     async createTask(createTaskDto: CreateTaskDto) {
//         const { title, description } = createTaskDto;

//         const task = this.create({
//             title,
//             description,
//             status: TaskStatus.OPEN
//         });

//         await this.save(task);
//         return task;
//     };

// }

import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { GetTaskFilterDto } from './get-task-filter.dto';
import { TaskStatus } from '../task.model';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                { search: `%${search}%` },
            );
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.save(task);
        return task;
    }
}