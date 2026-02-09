/**
 * Hazelcast Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Hazelcast IMDG configuration for distributed computing
 * @version 2.0.0
 * @environment production
 */

export interface HazelcastConfig {
    cluster: ClusterConfig;
    network: NetworkConfig;
    map: MapConfig;
    queue: QueueConfig;
    executor: ExecutorConfig;
    security: SecurityConfig;
}

interface ClusterConfig {
    name: string;
    instanceName: string;
    members: string[];
    autoIncrement: boolean;
    partitionCount: number;
}

interface NetworkConfig {
    port: number;
    portAutoIncrement: boolean;
    publicAddress: string;
    join: JoinConfig;
    ssl: SSLConfig;
}

interface JoinConfig {
    multicast: MulticastConfig;
    tcpIp: TcpIpConfig;
    kubernetes: KubernetesConfig;
}

interface MulticastConfig {
    enabled: boolean;
    group: string;
    port: number;
    trustedInterfaces: string[];
}

interface TcpIpConfig {
    enabled: boolean;
    members: string[];
    connectionTimeoutSeconds: number;
}

interface KubernetesConfig {
    enabled: boolean;
    namespace: string;
    serviceName: string;
    servicePort: number;
}

interface SSLConfig {
    enabled: boolean;
    keyStore: string;
    keyStorePassword: string;
    trustStore: string;
    trustStorePassword: string;
    protocol: string;
}

interface MapConfig {
    name: string;
    backupCount: number;
    asyncBackupCount: number;
    timeToLiveSeconds: number;
    maxIdleSeconds: number;
    eviction: EvictionConfig;
    nearCache: NearCacheConfig;
}

interface EvictionConfig {
    policy: 'LRU' | 'LFU' | 'RANDOM' | 'NONE';
    maxSize: number;
    maxSizePolicy: 'PER_NODE' | 'PER_PARTITION' | 'USED_HEAP_PERCENTAGE';
}

interface NearCacheConfig {
    enabled: boolean;
    maxSize: number;
    timeToLiveSeconds: number;
    maxIdleSeconds: number;
    invalidateOnChange: boolean;
}

interface QueueConfig {
    name: string;
    maxSize: number;
    backupCount: number;
    asyncBackupCount: number;
    emptyQueueTtl: number;
}

interface ExecutorConfig {
    poolSize: number;
    queueCapacity: number;
    statisticsEnabled: boolean;
}

interface SecurityConfig {
    enabled: boolean;
    clientPermissions: ClientPermission[];
    memberCredentials: MemberCredentials;
}

interface ClientPermission {
    type: string;
    name: string;
    principal: string;
    actions: string[];
}

interface MemberCredentials {
    username: string;
    password: string;
}

const hazelcastConfig: HazelcastConfig = {
    cluster: {
        name: 'trialbyte-hazelcast',
        instanceName: 'trialbyte-hz-instance',
        members: [
            'hazelcast-1.trialbyte.internal',
            'hazelcast-2.trialbyte.internal',
            'hazelcast-3.trialbyte.internal',
        ],
        autoIncrement: false,
        partitionCount: 271,
    },
    network: {
        port: 5701,
        portAutoIncrement: false,
        publicAddress: '',
        join: {
            multicast: {
                enabled: false,
                group: '224.2.2.3',
                port: 54327,
                trustedInterfaces: [],
            },
            tcpIp: {
                enabled: true,
                members: [
                    'hazelcast-1.trialbyte.internal:5701',
                    'hazelcast-2.trialbyte.internal:5701',
                    'hazelcast-3.trialbyte.internal:5701',
                ],
                connectionTimeoutSeconds: 5,
            },
            kubernetes: {
                enabled: false,
                namespace: 'trialbyte',
                serviceName: 'hazelcast-service',
                servicePort: 5701,
            },
        },
        ssl: {
            enabled: true,
            keyStore: '/etc/ssl/hazelcast/keystore.jks',
            keyStorePassword: process.env.HAZELCAST_KEYSTORE_PASSWORD || '',
            trustStore: '/etc/ssl/hazelcast/truststore.jks',
            trustStorePassword: process.env.HAZELCAST_TRUSTSTORE_PASSWORD || '',
            protocol: 'TLSv1.3',
        },
    },
    map: {
        name: 'trialbyte-cache',
        backupCount: 1,
        asyncBackupCount: 0,
        timeToLiveSeconds: 3600,
        maxIdleSeconds: 1800,
        eviction: {
            policy: 'LRU',
            maxSize: 10000,
            maxSizePolicy: 'PER_NODE',
        },
        nearCache: {
            enabled: true,
            maxSize: 1000,
            timeToLiveSeconds: 300,
            maxIdleSeconds: 60,
            invalidateOnChange: true,
        },
    },
    queue: {
        name: 'trialbyte-tasks',
        maxSize: 10000,
        backupCount: 1,
        asyncBackupCount: 0,
        emptyQueueTtl: 300,
    },
    executor: {
        poolSize: 16,
        queueCapacity: 1000,
        statisticsEnabled: true,
    },
    security: {
        enabled: true,
        clientPermissions: [
            {
                type: 'map',
                name: 'trialbyte-*',
                principal: 'trialbyte-app',
                actions: ['read', 'put', 'remove'],
            },
        ],
        memberCredentials: {
            username: process.env.HAZELCAST_USER || '',
            password: process.env.HAZELCAST_PASSWORD || '',
        },
    },
};

export default hazelcastConfig;
