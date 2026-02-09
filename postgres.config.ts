/**
 * PostgreSQL Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production PostgreSQL configuration for structured clinical data
 * @version 3.1.0
 * @environment production
 */

export interface PostgresConfig {
    connection: ConnectionConfig;
    pool: PoolConfig;
    ssl: SSLConfig;
    replication: ReplicationConfig;
    performance: PerformanceConfig;
    backup: BackupConfig;
}

interface ConnectionConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    schema: string;
    applicationName: string;
}

interface PoolConfig {
    min: number;
    max: number;
    acquireTimeoutMillis: number;
    createTimeoutMillis: number;
    destroyTimeoutMillis: number;
    idleTimeoutMillis: number;
    reapIntervalMillis: number;
    createRetryIntervalMillis: number;
}

interface SSLConfig {
    enabled: boolean;
    rejectUnauthorized: boolean;
    ca: string;
    cert: string;
    key: string;
    mode: 'disable' | 'allow' | 'prefer' | 'require' | 'verify-ca' | 'verify-full';
}

interface ReplicationConfig {
    enabled: boolean;
    synchronous: boolean;
    primaryHost: string;
    replicaHosts: string[];
    loadBalancing: 'round-robin' | 'random' | 'first-available';
    readReplicas: ReadReplicaConfig[];
}

interface ReadReplicaConfig {
    host: string;
    port: number;
    weight: number;
    maxConnections: number;
}

interface PerformanceConfig {
    statementTimeout: number;
    lockTimeout: number;
    idleInTransactionSessionTimeout: number;
    effectiveCacheSize: string;
    sharedBuffers: string;
    workMem: string;
    maintenanceWorkMem: string;
    maxParallelWorkers: number;
    maxParallelWorkersPerGather: number;
}

interface BackupConfig {
    enabled: boolean;
    schedule: string;
    retentionDays: number;
    s3Bucket: string;
    encryptionKey: string;
    compressionLevel: number;
}

const postgresConfig: PostgresConfig = {
    connection: {
        host: process.env.POSTGRES_HOST || 'postgres-primary.trialbyte.internal',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DATABASE || 'trialbyte_clinical',
        user: process.env.POSTGRES_USER || '',
        password: process.env.POSTGRES_PASSWORD || '',
        schema: 'clinical_trials',
        applicationName: 'trialbyte-frontend',
    },
    pool: {
        min: 5,
        max: 50,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
    },
    ssl: {
        enabled: true,
        rejectUnauthorized: true,
        ca: '/etc/ssl/postgres/ca-certificate.crt',
        cert: '/etc/ssl/postgres/client-cert.crt',
        key: '/etc/ssl/postgres/client-key.key',
        mode: 'verify-full',
    },
    replication: {
        enabled: true,
        synchronous: true,
        primaryHost: 'postgres-primary.trialbyte.internal',
        replicaHosts: [
            'postgres-replica-1.trialbyte.internal',
            'postgres-replica-2.trialbyte.internal',
        ],
        loadBalancing: 'round-robin',
        readReplicas: [
            { host: 'postgres-replica-1.trialbyte.internal', port: 5432, weight: 50, maxConnections: 25 },
            { host: 'postgres-replica-2.trialbyte.internal', port: 5432, weight: 50, maxConnections: 25 },
        ],
    },
    performance: {
        statementTimeout: 30000,
        lockTimeout: 10000,
        idleInTransactionSessionTimeout: 60000,
        effectiveCacheSize: '12GB',
        sharedBuffers: '4GB',
        workMem: '256MB',
        maintenanceWorkMem: '1GB',
        maxParallelWorkers: 8,
        maxParallelWorkersPerGather: 4,
    },
    backup: {
        enabled: true,
        schedule: '0 2 * * *',
        retentionDays: 30,
        s3Bucket: 'trialbyte-postgres-backups',
        encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || '',
        compressionLevel: 9,
    },
};

export default postgresConfig;
