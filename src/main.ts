import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { type INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationModule } from './modules/app.module';
import { CommonModule, LogInterceptor } from './modules/common';
import type { IConfig } from './modules/common/interfaces/config.interface';
import {
    API_DEFAULT_PREFIX,
    SWAGGER_DESCRIPTION,
    SWAGGER_PREFIX,
    SWAGGER_TITLE,
    VERSION
} from './modules/common/models/constants';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(ApplicationModule);

    app.setGlobalPrefix(API_DEFAULT_PREFIX);

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v'
    });

    app.enableCors();

    createSwagger(app);

    const logInterceptor = app.select(CommonModule).get(LogInterceptor);
    app.useGlobalInterceptors(logInterceptor);

    const port = app.get(ConfigService).get<IConfig>('API_PORT', {
        infer: true
    });

    await app.listen(port);
}

function createSwagger(app: INestApplication): void {
    const version = VERSION;
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .setVersion(version)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

// eslint-disable-next-line no-console, unicorn/prefer-top-level-await
bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
});
