/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Joi from '@hapi/joi';
import * as _ from 'lodash';
import { API_DEFAULT_PORT } from '../models/constants';
import type { IConfig } from '../interfaces/config.interface';

export const config = (): IConfig => {
    const { env } = process;

    const validationSchema = Joi.object().unknown().keys({
        API_PORT: Joi.string().required(),
        SWAGGER_ENABLE: Joi.string().optional(),

        MONGO_URL: Joi.string().required(),

        CLOUDWATCH_GROUP_NAME: Joi.string().required(),
        CLOUDWATCH_LOG_STREAM_NAME: Joi.string().required(),
        AWS_REGION: Joi.string().required()
    });

    const result = validationSchema.validate(env);

    if (result.error) {
        throw new Error(`Configuration not valid: ${result.error.message}`);
    }

    return {
        apiPort: _.toNumber(env.API_PORT) || API_DEFAULT_PORT,
        swagger: {
            enabled: env.SWAGGER_ENABLE === 'true'
        },

        database: {
            url: env.MONGO_URL!
        },

        aws: {
            cloudwatchGroupName: env.CLOUDWATCH_GROUP_NAME!,
            cloudwatchLogStreamName: env.CLOUDWATCH_LOG_STREAM_NAME!,
            region: env.AWS_REGION!
        }
    };
};
