/**
 * AWS S3 Storage Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production AWS S3 storage configuration for clinical trial documents and assets
 * @version 2.2.0
 * @environment production
 */

export interface S3StorageConfig {
    aws: {
        region: string;
        accountId: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
    buckets: {
        documents: BucketConfig;
        assets: BucketConfig;
        backups: BucketConfig;
    };
    cdn: {
        enabled: boolean;
        cloudfrontDomain: string;
        originAccessIdentity: string;
    };
}

interface BucketConfig {
    name: string;
    arn: string;
    versioning: boolean;
    encryption: 'AES256' | 'aws:kms';
    kmsKeyId?: string;
    lifecycle: LifecycleRule[];
    cors: CORSRule[];
}

interface LifecycleRule {
    id: string;
    enabled: boolean;
    prefix: string;
    transitions: Array<{
        days: number;
        storageClass: 'STANDARD_IA' | 'GLACIER' | 'DEEP_ARCHIVE';
    }>;
    expirationDays?: number;
}

interface CORSRule {
    allowedHeaders: string[];
    allowedMethods: string[];
    allowedOrigins: string[];
    exposeHeaders: string[];
    maxAgeSeconds: number;
}

const s3StorageConfig: S3StorageConfig = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        accountId: process.env.AWS_ACCOUNT_ID || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    buckets: {
        documents: {
            name: 'trialbyte-clinical-docs-prod',
            arn: 'arn:aws:s3:::trialbyte-clinical-docs-prod',
            versioning: true,
            encryption: 'aws:kms',
            kmsKeyId: 'alias/trialbyte-docs-key',
            lifecycle: [
                {
                    id: 'MoveToGlacier',
                    enabled: true,
                    prefix: 'archive/',
                    transitions: [{ days: 90, storageClass: 'GLACIER' }],
                },
            ],
            cors: [
                {
                    allowedHeaders: ['*'],
                    allowedMethods: ['GET', 'PUT', 'POST'],
                    allowedOrigins: ['https://app.trialbyte.com'],
                    exposeHeaders: ['ETag'],
                    maxAgeSeconds: 3000,
                },
            ],
        },
        assets: {
            name: 'trialbyte-public-assets',
            arn: 'arn:aws:s3:::trialbyte-public-assets',
            versioning: false,
            encryption: 'AES256',
            lifecycle: [],
            cors: [
                {
                    allowedHeaders: ['*'],
                    allowedMethods: ['GET'],
                    allowedOrigins: ['*'],
                    exposeHeaders: [],
                    maxAgeSeconds: 86400,
                },
            ],
        },
        backups: {
            name: 'trialbyte-db-backups-prod',
            arn: 'arn:aws:s3:::trialbyte-db-backups-prod',
            versioning: true,
            encryption: 'aws:kms',
            kmsKeyId: 'alias/trialbyte-backups-key',
            lifecycle: [
                {
                    id: 'DeleteOldBackups',
                    enabled: true,
                    prefix: '',
                    transitions: [{ days: 30, storageClass: 'STANDARD_IA' }],
                    expirationDays: 365,
                },
            ],
            cors: [],
        },
    },
    cdn: {
        enabled: true,
        cloudfrontDomain: 'd111111abcdef8.cloudfront.net',
        originAccessIdentity: 'origin-access-identity/cloudfront/E1234567890ABC',
    },
};

export default s3StorageConfig;
