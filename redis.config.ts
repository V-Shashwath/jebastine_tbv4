/**
 * Redis Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Redis cluster configuration for caching and session management
 * @version 2.0.0
 * @environment production
 */

export interface RedisConfig {
    connection: ConnectionConfig;
    cluster: ClusterConfig;
    sentinel: SentinelConfig;
    cache: CacheConfig;
    session: SessionConfig;
    pubsub: PubSubConfig;
    security: SecurityConfig;
}

interface ConnectionConfig {
    host: string;
    port: number;
    password: string;
    database: number;
    connectTimeout: number;
    commandTimeout: number;
    keepAlive: number;
    family: 4 | 6;
}

interface ClusterConfig {
    enabled: boolean;
    nodes: ClusterNode[];
    maxRedirections: number;
    retryDelayOnFailover: number;
    retryDelayOnClusterDown: number;
    scaleReads: 'master' | 'slave' | 'all';
}

interface ClusterNode {
    host: string;
    port: number;
}

interface SentinelConfig {
    enabled: boolean;
    masterName: string;
    sentinels: SentinelNode[];
    failoverTimeout: number;
    parallelSyncs: number;
}

interface SentinelNode {
    host: string;
    port: number;
}

interface CacheConfig {
    defaultTTL: number;
    maxMemory: string;
    maxMemoryPolicy: 'noeviction' | 'allkeys-lru' | 'volatile-lru' | 'allkeys-random' | 'volatile-random' | 'volatile-ttl';
    keyPrefix: string;
    compressionEnabled: boolean;
    compressionThreshold: number;
}

interface SessionConfig {
    prefix: string;
    ttl: number;
    rolling: boolean;
    resave: boolean;
    saveUninitialized: boolean;
}

interface PubSubConfig {
    enabled: boolean;
    channels: string[];
    patternSubscriptions: string[];
    messageRetention: number;
}

interface SecurityConfig {
    tls: boolean;
    tlsCert: string;
    tlsKey: string;
    tlsCa: string;
    aclEnabled: boolean;
    aclUsers: ACLUser[];
}

interface ACLUser {
    username: string;
    permissions: string[];
    keys: string[];
    channels: string[];
}

const redisConfig: RedisConfig = {
    connection: {
        host: process.env.REDIS_HOST || 'redis-primary.trialbyte.internal',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || '',
        database: 0,
        connectTimeout: 10000,
        commandTimeout: 5000,
        keepAlive: 30000,
        family: 4,
    },
    cluster: {
        enabled: true,
        nodes: [
            { host: 'redis-node-1.trialbyte.internal', port: 6379 },
            { host: 'redis-node-2.trialbyte.internal', port: 6379 },
            { host: 'redis-node-3.trialbyte.internal', port: 6379 },
            { host: 'redis-node-4.trialbyte.internal', port: 6379 },
            { host: 'redis-node-5.trialbyte.internal', port: 6379 },
            { host: 'redis-node-6.trialbyte.internal', port: 6379 },
        ],
        maxRedirections: 16,
        retryDelayOnFailover: 100,
        retryDelayOnClusterDown: 100,
        scaleReads: 'slave',
    },
    sentinel: {
        enabled: false,
        masterName: 'trialbyte-master',
        sentinels: [
            { host: 'sentinel-1.trialbyte.internal', port: 26379 },
            { host: 'sentinel-2.trialbyte.internal', port: 26379 },
            { host: 'sentinel-3.trialbyte.internal', port: 26379 },
        ],
        failoverTimeout: 60000,
        parallelSyncs: 1,
    },
    cache: {
        defaultTTL: 3600,
        maxMemory: '8gb',
        maxMemoryPolicy: 'allkeys-lru',
        keyPrefix: 'trialbyte:',
        compressionEnabled: true,
        compressionThreshold: 1024,
    },
    session: {
        prefix: 'sess:',
        ttl: 86400,
        rolling: true,
        resave: false,
        saveUninitialized: false,
    },
    pubsub: {
        enabled: true,
        channels: ['trial-updates', 'drug-notifications', 'user-events'],
        patternSubscriptions: ['alerts:*', 'notifications:*'],
        messageRetention: 604800,
    },
    security: {
        tls: true,
        tlsCert: '/etc/ssl/redis/redis.crt',
        tlsKey: '/etc/ssl/redis/redis.key',
        tlsCa: '/etc/ssl/redis/ca.crt',
        aclEnabled: true,
        aclUsers: [
            {
                username: 'trialbyte-app',
                permissions: ['+@all', '-@dangerous'],
                keys: ['trialbyte:*'],
                channels: ['*'],
            },
        ],
    },
};

export default redisConfig;
