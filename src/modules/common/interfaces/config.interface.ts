export interface IConfig {
    readonly apiPort: number;

    readonly swagger: {
        enabled: boolean;
    };

    readonly database: {
        readonly url: string;
    };

    aws: {
        cloudwatchGroupName: string;
        cloudwatchLogStreamName: string;
        region: string;
    };
}
