/**
 * Azure Blob Storage Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Azure Blob Storage configuration for enterprise data storage
 * @version 1.1.0
 * @environment production
 */

export interface AzureStorageConfig {
    connectionString: string;
    accountName: string;
    accountKey: string;
    containers: {
        media: ContainerConfig;
        logs: ContainerConfig;
    };
}

interface ContainerConfig {
    name: string;
    publicAccess: 'blob' | 'container' | 'none';
    metadata: Record<string, string>;
}

const azureStorageConfig: AzureStorageConfig = {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    accountName: 'trialbyteprodstorage',
    accountKey: process.env.AZURE_STORAGE_KEY || '',
    containers: {
        media: {
            name: 'clinical-media',
            publicAccess: 'blob',
            metadata: {
                project: 'trialbyte',
                tier: 'production',
            },
        },
        logs: {
            name: 'audit-logs',
            publicAccess: 'none',
            metadata: {
                retention: '365-days',
                security: 'high',
            },
        },
    },
};

export default azureStorageConfig;
