import {
    Catch,
    HttpException,
    HttpStatus,
    type ExceptionFilter,
    type ArgumentsHost
} from '@nestjs/common';
import type { Response } from 'express';
import { ANONYMOUS } from './models/constants';
import { LoggerService } from './providers';
import type { GqlContextType } from '@nestjs/graphql';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    public constructor(private readonly loggerService: LoggerService) {}

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public catch(exception: any, host: ArgumentsHost): void {
        const hostType = host.getType<GqlContextType>();

        let response: unknown;
        let path = '';
        let email: string | null = ANONYMOUS;

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.BAD_REQUEST;

        if (hostType === 'http') {
            const context = host.switchToHttp();

            response = context.getResponse();
            const request = context.getRequest();

            path = request.url;
            email = request.user ? request.user.email : ANONYMOUS;

            this.loggerService.error(
                `${status} ${request.method} ${
                    request.url
                }; Request body is: ${JSON.stringify(
                    request.body
                )}; Request headers are: ${JSON.stringify(
                    request.headers
                )}; Request email is: ${email};`,
                exception
            );
        }

        // eslint-disable-next-line no-prototype-builtins
        if (exception.hasOwnProperty('response')) {
            const { response: exceptionResponse } = exception;

            const message = Array.isArray(exceptionResponse.message)
                ? // eslint-disable-next-line no-magic-numbers
                  exceptionResponse.message[0]
                : exceptionResponse.message;

            this._raiseException(
                hostType,
                path,
                response,
                status,
                exceptionResponse.error,
                message
            );

            return;
        }

        // eslint-disable-next-line no-prototype-builtins
        if (exception.hasOwnProperty('errors')) {
            const { errors } = exception;

            const message = Array.isArray(errors)
                ? // eslint-disable-next-line no-magic-numbers
                  errors[0].message
                : exception.message;

            this._raiseException(hostType, path, response, status, errors, message);

            return;
        }

        this._raiseException(
            hostType,
            path,
            response,
            status,
            exception.message,
            exception.message
        );
    }

    private _raiseException(
        contextType: GqlContextType,
        path: string,
        response: Response,
        status: HttpStatus,
        error: unknown = undefined,
        message: string | null | undefined = undefined
    ): void {
        if (!message) {
            message =
                status === HttpStatus.TOO_MANY_REQUESTS
                    ? 'Too many requests, please try again later'
                    : 'Internal server error';
        }

        switch (contextType) {
            case 'http': {
                response.status(status).json({
                    success: false,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path,
                    message,
                    error: error ?? message
                });

                break;
            }

            default: {
                throw new HttpException(
                    {
                        success: false,
                        statusCode: status,
                        timestamp: new Date().toISOString(),
                        path,
                        message,
                        error: error ?? message
                    },
                    status
                );
            }
        }
    }
}
