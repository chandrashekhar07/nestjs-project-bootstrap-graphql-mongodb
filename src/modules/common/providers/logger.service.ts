import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { isDeploymentEnv as isDeploymentEnvironment } from '../utilities';
@Injectable()
export class LoggerService {
    private readonly instance: winston.Logger;

    public constructor() {
        const format = isDeploymentEnvironment()
            ? winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.json(),
                  winston.format.errors({ stack: true })
              )
            : winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple(),
                  winston.format.errors({ stack: true })
              );

        this.instance = winston.createLogger({
            level: 'info',
            silent: false,
            format,
            transports: [
                new winston.transports.Console({
                    stderrLevels: ['error']
                })
            ]
        });
    }

    public info(message: string): void {
        this.instance.info(message);
    }

    public warn(message: string): void {
        this.instance.warn(message);
    }

    public error(message: string, error?: Error): void {
        this.instance.error(message, error);
    }
}
