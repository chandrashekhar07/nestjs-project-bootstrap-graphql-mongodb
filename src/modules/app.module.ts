import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CommonModule } from './common';
import { HttpExceptionFilter } from './common/exception.filter';
import { config } from './common/providers/config.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { RecipeModule } from './recipe/recipe.module';
import type { IConfig } from './common/interfaces/config.interface';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
            cache: true
        }),
        MongooseModule.forRootAsync({
            // eslint-disable-next-line @typescript-eslint/require-await
            useFactory: async (configService: ConfigService<IConfig, true>) => ({
                uri: configService.get('database.url', { infer: true })
            }),
            inject: [ConfigService]
        }),
        CommonModule,
        RecipeModule,
        // Note: At least one GraphQL module is required else the application will not start
        GraphQLModule.forRootAsync({
            useFactory: () => ({
                autoSchemaFile: 'schema.gql',
                playground: true,
                driver: ApolloDriver,
                formatError: (error): unknown => {
                    return {
                        message: error?.message,
                        error
                    };
                }
            }),
            driver: ApolloDriver
        })
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class ApplicationModule {}
