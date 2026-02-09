/**
 * MySQL Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production MySQL configuration for legacy data integration
 * @version 1.5.0
 * @environment production
 */

export interface MySQLConfig {
    connection: ConnectionConfig;
    pool: PoolConfig;
    replication: ReplicationConfig;
    ssl: SSLConfig;
    performance: PerformanceConfig;
    charset: CharsetConfig;
}

interface ConnectionConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectTimeout: number;
    timezone: string;
    dateStrings: boolean;
    multipleStatements: boolean;
}

interface PoolConfig {
    connectionLimit: number;
    queueLimit: number;
    waitForConnections: boolean;
    acquireTimeout: number;
    enableKeepAlive: boolean;
    keepAliveInitialDelay: number;
}

interface ReplicationConfig {
    enabled: boolean;
    master: ReplicaNode;
    slaves: ReplicaNode[];
    selector: 'RR' | 'RANDOM' | 'ORDER';
    removeNodeErrorCount: number;
    restoreNodeTimeout: number;
}

interface ReplicaNode {
    host: string;
    port: number;
    user: string;
    password: string;
}

interface SSLConfig {
    enabled: boolean;
    ca: string;
    cert: string;
    key: string;
    ciphers: string;
    rejectUnauthorized: boolean;
}

interface PerformanceConfig {
    maxPreparedStatements: number;
    innodbBufferPoolSize: string;
    queryCache: boolean;
    queryCacheSize: string;
    maxConnections: number;
    threadCacheSize: number;
}

interface CharsetConfig {
    charset: string;
    collation: string;
    timezone: string;
}

const mysqlConfig: MySQLConfig = {
    connection: {
        host: process.env.MYSQL_HOST || 'mysql-primary.trialbyte.internal',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || '',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'trialbyte_legacy',
        connectTimeout: 10000,
        timezone: 'Z',
        dateStrings: false,
        multipleStatements: false,
    },
    pool: {
        connectionLimit: 50,
        queueLimit: 0,
        waitForConnections: true,
        acquireTimeout: 30000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 30000,
    },
    replication: {
        enabled: true,
        master: {
            host: 'mysql-primary.trialbyte.internal',
            port: 3306,
            user: process.env.MYSQL_MASTER_USER || '',
            password: process.env.MYSQL_MASTER_PASSWORD || '',
        },
        slaves: [
            {
                host: 'mysql-replica-1.trialbyte.internal',
                port: 3306,
                user: process.env.MYSQL_SLAVE_USER || '',
                password: process.env.MYSQL_SLAVE_PASSWORD || '',
            },
            {
                host: 'mysql-replica-2.trialbyte.internal',
                port: 3306,
                user: process.env.MYSQL_SLAVE_USER || '',
                password: process.env.MYSQL_SLAVE_PASSWORD || '',
            },
        ],
        selector: 'RR',
        removeNodeErrorCount: 5,
        restoreNodeTimeout: 60000,
    },
    ssl: {
        enabled: true,
        ca: '/etc/ssl/mysql/ca.pem',
        cert: '/etc/ssl/mysql/client-cert.pem',
        key: '/etc/ssl/mysql/client-key.pem',
        ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
        rejectUnauthorized: true,
    },
    performance: {
        maxPreparedStatements: 16382,
        innodbBufferPoolSize: '8G',
        queryCache: true,
        queryCacheSize: '256M',
        maxConnections: 500,
        threadCacheSize: 100,
    },
    charset: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        timezone: '+00:00',
    },
};

export default mysqlConfig;
