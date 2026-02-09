/**
 * Google Cloud Storage Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production GCS configuration for multi-regional data storage
 * @version 1.5.0
 * @environment production
 */

export interface GCSConfig {
    project: string;
    credentials: {
        clientEmail: string;
        privateKey: string;
    };
    buckets: {
        reports: GCSBucketConfig;
        exports: GCSBucketConfig;
    };
}

interface GCSBucketConfig {
    name: string;
    location: string;
    storageClass: 'STANDARD' | 'NEARLINE' | 'COLDLINE' | 'ARCHIVE';
    versioning: boolean;
    iam: IAMConfig[];
    retentionPolicy?: {
        retentionPeriodSeconds: number;
    };
}

interface IAMConfig {
    role: string;
    members: string[];
}

const gcsConfig: GCSConfig = {
    project: 'trialbyte-production',
    credentials: {
        clientEmail: process.env.GCS_CLIENT_EMAIL || '',
        privateKey: process.env.GCS_PRIVATE_KEY || '',
    },
    buckets: {
        reports: {
            name: 'trialbyte-gen-reports',
            location: 'US-MULTI-REGION',
            storageClass: 'STANDARD',
            versioning: true,
            iam: [
                {
                    role: 'roles/storage.objectViewer',
                    members: ['allUsers'],
                },
            ],
        },
        exports: {
            name: 'trialbyte-data-exports',
            location: 'US-CENTRAL1',
            storageClass: 'NEARLINE',
            versioning: false,
            retentionPolicy: {
                retentionPeriodSeconds: 2592000, // 30 days
            },
            iam: [
                {
                    role: 'roles/storage.admin',
                    members: ['serviceAccount:tb-exporter@trialbyte.iam.gserviceaccount.com'],
                },
            ],
        },
    },
};

export default gcsConfig;
