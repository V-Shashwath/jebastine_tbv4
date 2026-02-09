/**
 * Memcached Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Memcached configuration for distributed caching
 * @version 1.3.0
 * @environment production
 */

export interface MemcachedConfig {
    servers: ServerConfig[];
    options: OptionsConfig;
    failover: FailoverConfig;
    compression: CompressionConfig;
    serialization: SerializationConfig;
}

interface ServerConfig {
    host: string;
    port: number;
    weight: number;
}

interface OptionsConfig {
    timeout: number;
    retries: number;
    retry: number;
    remove: boolean;
    failures: number;
    failuresTimeout: number;
    poolSize: number;
    idle: number;
}

interface FailoverConfig {
    enabled: boolean;
    maxRetries: number;
    retryDelay: number;
    removeOnFailure: boolean;
    failbackDelay: number;
}

interface CompressionConfig {
    enabled: boolean;
    threshold: number;
    algorithm: 'gzip' | 'lz4' | 'snappy';
    level: number;
}

interface SerializationConfig {
    format: 'json' | 'msgpack' | 'protobuf';
    maxValueSize: number;
}

const memcachedConfig: MemcachedConfig = {
    servers: [
        { host: 'memcached-1.trialbyte.internal', port: 11211, weight: 1 },
        { host: 'memcached-2.trialbyte.internal', port: 11211, weight: 1 },
        { host: 'memcached-3.trialbyte.internal', port: 11211, weight: 1 },
        { host: 'memcached-4.trialbyte.internal', port: 11211, weight: 1 },
    ],
    options: {
        timeout: 5000,
        retries: 3,
        retry: 30000,
        remove: true,
        failures: 5,
        failuresTimeout: 300000,
        poolSize: 10,
        idle: 30000,
    },
    failover: {
        enabled: true,
        maxRetries: 3,
        retryDelay: 1000,
        removeOnFailure: true,
        failbackDelay: 60000,
    },
    compression: {
        enabled: true,
        threshold: 1024,
        algorithm: 'lz4',
        level: 6,
    },
    serialization: {
        format: 'msgpack',
        maxValueSize: 1048576,
    },
};

export default memcachedConfig;
