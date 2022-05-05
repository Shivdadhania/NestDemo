import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Param,
    Patch,
    Query,
    UseGuards,
    Logger,
    UseInterceptors
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './dto/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetUrl } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { JsonResponseInterceptor } from '../json-response.interceptor';

@Controller('tasks')
@UseGuards(AuthGuard())
@UseInterceptors(JsonResponseInterceptor)
export class TasksController {
    private logger = new Logger('Task Controller');
    constructor(private taskService: TasksService) { }

    @Get()
    getTasks(
        @Query() filterTaskDto: GetTaskFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        if (Object.keys(filterTaskDto).length) {
            return this.taskService.getTasksWithFilters(filterTaskDto, user);

        } else {
            return this.taskService.getAllTasks(user);
        }
    }

    @Get('/:id')
    getTasksById(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return await this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(
        @GetUser() user: User,
        @Param('id') id: string
    ): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @GetUser() user: User,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.taskService.updateTaskStatus(id, status, user);
    }
}
