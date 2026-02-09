/**
 * AWS SQS Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production AWS SQS configuration for message queuing
 * @version 1.6.0
 * @environment production
 */

export interface SQSConfig {
    aws: AWSConfig;
    queues: QueueConfig[];
    fifo: FIFOConfig;
    deadLetterQueue: DeadLetterQueueConfig;
    polling: PollingConfig;
    encryption: EncryptionConfig;
}

interface AWSConfig {
    region: string;
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    endpoint?: string;
    apiVersion: string;
    maxRetries: number;
    httpOptions: HTTPOptions;
}

interface HTTPOptions {
    connectTimeout: number;
    timeout: number;
    agent?: string;
}

interface QueueConfig {
    name: string;
    url: string;
    arn: string;
    attributes: QueueAttributes;
    tags: Record<string, string>;
}

interface QueueAttributes {
    DelaySeconds: number;
    MaximumMessageSize: number;
    MessageRetentionPeriod: number;
    ReceiveMessageWaitTimeSeconds: number;
    VisibilityTimeout: number;
    RedrivePolicy?: string;
    Policy?: string;
    KmsMasterKeyId?: string;
    KmsDataKeyReusePeriodSeconds?: number;
    SqsManagedSseEnabled?: boolean;
}

interface FIFOConfig {
    enabled: boolean;
    contentBasedDeduplication: boolean;
    deduplicationScope: 'messageGroup' | 'queue';
    throughputLimit: 'perQueue' | 'perMessageGroupId';
}

interface DeadLetterQueueConfig {
    enabled: boolean;
    targetArn: string;
    maxReceiveCount: number;
}

interface PollingConfig {
    waitTimeSeconds: number;
    maxNumberOfMessages: number;
    visibilityTimeout: number;
    messageAttributeNames: string[];
    attributeNames: string[];
}

interface EncryptionConfig {
    enabled: boolean;
    type: 'SQS' | 'KMS';
    kmsKeyId?: string;
    kmsDataKeyReusePeriod: number;
}

const sqsConfig: SQSConfig = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        accountId: process.env.AWS_ACCOUNT_ID || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        apiVersion: '2012-11-05',
        maxRetries: 3,
        httpOptions: {
            connectTimeout: 10000,
            timeout: 30000,
        },
    },
    queues: [
        {
            name: 'trialbyte-trials-events',
            url: `https://sqs.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/trialbyte-trials-events`,
            arn: `arn:aws:sqs:${process.env.AWS_REGION || 'us-east-1'}:${process.env.AWS_ACCOUNT_ID}:trialbyte-trials-events`,
            attributes: {
                DelaySeconds: 0,
                MaximumMessageSize: 262144,
                MessageRetentionPeriod: 1209600,
                ReceiveMessageWaitTimeSeconds: 20,
                VisibilityTimeout: 300,
            },
            tags: {
                Environment: 'production',
                Project: 'trialbyte',
                Team: 'backend',
            },
        },
        {
            name: 'trialbyte-notifications',
            url: `https://sqs.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/trialbyte-notifications`,
            arn: `arn:aws:sqs:${process.env.AWS_REGION || 'us-east-1'}:${process.env.AWS_ACCOUNT_ID}:trialbyte-notifications`,
            attributes: {
                DelaySeconds: 0,
                MaximumMessageSize: 65536,
                MessageRetentionPeriod: 604800,
                ReceiveMessageWaitTimeSeconds: 20,
                VisibilityTimeout: 60,
            },
            tags: {
                Environment: 'production',
                Project: 'trialbyte',
                Team: 'notifications',
            },
        },
        {
            name: 'trialbyte-email-queue.fifo',
            url: `https://sqs.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/trialbyte-email-queue.fifo`,
            arn: `arn:aws:sqs:${process.env.AWS_REGION || 'us-east-1'}:${process.env.AWS_ACCOUNT_ID}:trialbyte-email-queue.fifo`,
            attributes: {
                DelaySeconds: 0,
                MaximumMessageSize: 65536,
                MessageRetentionPeriod: 345600,
                ReceiveMessageWaitTimeSeconds: 20,
                VisibilityTimeout: 120,
            },
            tags: {
                Environment: 'production',
                Project: 'trialbyte',
                Team: 'email',
            },
        },
    ],
    fifo: {
        enabled: true,
        contentBasedDeduplication: true,
        deduplicationScope: 'messageGroup',
        throughputLimit: 'perMessageGroupId',
    },
    deadLetterQueue: {
        enabled: true,
        targetArn: `arn:aws:sqs:${process.env.AWS_REGION || 'us-east-1'}:${process.env.AWS_ACCOUNT_ID}:trialbyte-dlq`,
        maxReceiveCount: 5,
    },
    polling: {
        waitTimeSeconds: 20,
        maxNumberOfMessages: 10,
        visibilityTimeout: 300,
        messageAttributeNames: ['All'],
        attributeNames: ['All'],
    },
    encryption: {
        enabled: true,
        type: 'KMS',
        kmsKeyId: process.env.SQS_KMS_KEY_ID || 'alias/trialbyte-sqs',
        kmsDataKeyReusePeriod: 300,
    },
};

export default sqsConfig;
