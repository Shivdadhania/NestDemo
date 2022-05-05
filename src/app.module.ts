import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks/dto/task.repository';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TasksModule,
        TypeOrmModule.forRootAsync({
            imports: [],
            inject: [],
            useFactory: async () => {
                // const sequelize = new Sequelize({
                //     host: constants.DB_CONFIG.host,
                //     port: constants.DB_CONFIG.port,
                //     database: constants.DB_CONFIG.database,
                //     username: constants.DB_CONFIG.user,
                //     password: constants.DB_CONFIG.password,
                //     dialect: 'postgres',
                //     dialectOptions: {
                //         decimalNumbers: true
                //     },
                //     logging: false,
                //     pool: {
                //         max: 100,
                //         min: 0,
                //         acquire: 30000,
                //         idle: 5000,
                //     },
                // });
                // sequelize.addModels([

                // ]);
                return {
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT),
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.PG_DB,
                    autoLoadEntities: true,
                    synchronize: true,
                };
            },

        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
