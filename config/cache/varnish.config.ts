/**
 * Varnish Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Varnish HTTP accelerator configuration
 * @version 1.1.0
 * @environment production
 */

export interface VarnishConfig {
    backend: BackendConfig;
    cache: CacheConfig;
    purge: PurgeConfig;
    health: HealthCheckConfig;
    vcl: VCLConfig;
}

interface BackendConfig {
    name: string;
    host: string;
    port: number;
    connectTimeout: string;
    firstByteTimeout: string;
    betweenBytesTimeout: string;
    maxConnections: number;
}

interface CacheConfig {
    defaultTTL: string;
    maxAge: string;
    gracePeriod: string;
    keepPeriod: string;
    storage: StorageConfig;
}

interface StorageConfig {
    type: 'malloc' | 'file' | 'persistent';
    size: string;
    path?: string;
}

interface PurgeConfig {
    enabled: boolean;
    acl: string[];
    softPurge: boolean;
    banLurker: boolean;
}

interface HealthCheckConfig {
    url: string;
    interval: string;
    timeout: string;
    window: number;
    threshold: number;
    expectedResponse: number;
}

interface VCLConfig {
    customRules: VCLRule[];
    hashIncludeHost: boolean;
    hashIncludeUrl: boolean;
    stripQueryParams: string[];
    passHeaders: string[];
}

interface VCLRule {
    name: string;
    condition: string;
    action: string;
}

const varnishConfig: VarnishConfig = {
    backend: {
        name: 'trialbyte_origin',
        host: 'origin.trialbyte.internal',
        port: 8080,
        connectTimeout: '5s',
        firstByteTimeout: '30s',
        betweenBytesTimeout: '10s',
        maxConnections: 1000,
    },
    cache: {
        defaultTTL: '1h',
        maxAge: '24h',
        gracePeriod: '4h',
        keepPeriod: '7d',
        storage: {
            type: 'malloc',
            size: '8G',
        },
    },
    purge: {
        enabled: true,
        acl: ['10.0.0.0/8', '172.16.0.0/12'],
        softPurge: true,
        banLurker: true,
    },
    health: {
        url: '/health',
        interval: '5s',
        timeout: '2s',
        window: 8,
        threshold: 3,
        expectedResponse: 200,
    },
    vcl: {
        customRules: [
            {
                name: 'bypass_admin',
                condition: 'req.url ~ "^/admin"',
                action: 'return (pass)',
            },
            {
                name: 'cache_static',
                condition: 'req.url ~ "\\.(css|js|png|jpg|gif|ico)$"',
                action: 'set beresp.ttl = 7d',
            },
        ],
        hashIncludeHost: true,
        hashIncludeUrl: true,
        stripQueryParams: ['utm_source', 'utm_medium', 'utm_campaign'],
        passHeaders: ['Authorization', 'Cookie'],
    },
};

export default varnishConfig;
