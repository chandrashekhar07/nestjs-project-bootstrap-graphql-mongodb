import {
    type CallHandler,
    type ExecutionContext,
    Injectable,
    type NestInterceptor
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '../providers';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    public constructor(private readonly logger: LoggerService) {}

    public intercept(
        executionContext: ExecutionContext,
        next: CallHandler
    ): Observable<Response> {
        const startTime = Date.now();

        if (executionContext.getType() === 'http') {
            const context = executionContext.switchToHttp();
            const request = context.getRequest();
            const { statusCode } = context.getResponse();
            const userId = request.user ? request.user.sub : '-';

            return next.handle().pipe(
                map((data) => {
                    this.logger.info(
                        `${this._getTimeDelta(startTime)}ms ${userId} ${
                            request.ip
                        } ${statusCode} ${request.method} ${this._getUrl(request)}`
                    );

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const response: any = {
                        data,
                        httpCode: statusCode,
                        path: request.url,
                        timestamp: new Date().toISOString()
                    };

                    return response;
                })
            );
        }

        return next.handle();
    }

    private _getTimeDelta(startTime: number): number {
        return Date.now() - startTime;
    }

    private _getUrl(request: Request): string {
        return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
    }
}
