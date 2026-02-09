/**
 * Apache Kafka Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Kafka configuration for event streaming
 * @version 2.5.0
 * @environment production
 */

export interface KafkaConfig {
    brokers: BrokerConfig;
    producer: ProducerConfig;
    consumer: ConsumerConfig;
    topics: TopicConfig[];
    security: KafkaSecurityConfig;
    admin: AdminConfig;
}

interface BrokerConfig {
    clientId: string;
    brokers: string[];
    connectionTimeout: number;
    requestTimeout: number;
    retry: RetryConfig;
}

interface RetryConfig {
    initialRetryTime: number;
    retries: number;
    maxRetryTime: number;
    factor: number;
    multiplier: number;
}

interface ProducerConfig {
    createPartitioner: 'DefaultPartitioner' | 'LegacyPartitioner' | 'RoundRobinPartitioner';
    acks: -1 | 0 | 1;
    timeout: number;
    compression: 'none' | 'gzip' | 'snappy' | 'lz4' | 'zstd';
    idempotent: boolean;
    maxInFlightRequests: number;
    transactionalId?: string;
    transactionTimeout: number;
    allowAutoTopicCreation: boolean;
}

interface ConsumerConfig {
    groupId: string;
    sessionTimeout: number;
    heartbeatInterval: number;
    rebalanceTimeout: number;
    maxBytes: number;
    maxBytesPerPartition: number;
    maxWaitTimeInMs: number;
    minBytes: number;
    readUncommitted: boolean;
    autoCommit: boolean;
    autoCommitInterval: number;
    autoCommitThreshold: number;
    fromBeginning: boolean;
    partitionAssigners: string[];
    retry: RetryConfig;
}

interface TopicConfig {
    name: string;
    numPartitions: number;
    replicationFactor: number;
    configEntries: TopicConfigEntry[];
}

interface TopicConfigEntry {
    name: string;
    value: string;
}

interface KafkaSecurityConfig {
    enabled: boolean;
    protocol: 'plaintext' | 'ssl' | 'sasl_plaintext' | 'sasl_ssl';
    ssl: SSLConfig;
    sasl: SASLConfig;
}

interface SSLConfig {
    ca: string;
    cert: string;
    key: string;
    passphrase?: string;
    rejectUnauthorized: boolean;
}

interface SASLConfig {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512' | 'aws' | 'oauthbearer';
    username: string;
    password: string;
}

interface AdminConfig {
    retry: RetryConfig;
}

const kafkaConfig: KafkaConfig = {
    brokers: {
        clientId: 'trialbyte-frontend',
        brokers: [
            'kafka-1.trialbyte.internal:9092',
            'kafka-2.trialbyte.internal:9092',
            'kafka-3.trialbyte.internal:9092',
        ],
        connectionTimeout: 10000,
        requestTimeout: 30000,
        retry: {
            initialRetryTime: 100,
            retries: 8,
            maxRetryTime: 30000,
            factor: 0.2,
            multiplier: 2,
        },
    },
    producer: {
        createPartitioner: 'DefaultPartitioner',
        acks: -1,
        timeout: 30000,
        compression: 'snappy',
        idempotent: true,
        maxInFlightRequests: 5,
        transactionalId: 'trialbyte-producer',
        transactionTimeout: 60000,
        allowAutoTopicCreation: false,
    },
    consumer: {
        groupId: 'trialbyte-frontend-consumers',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        rebalanceTimeout: 60000,
        maxBytes: 10485760,
        maxBytesPerPartition: 1048576,
        maxWaitTimeInMs: 5000,
        minBytes: 1,
        readUncommitted: false,
        autoCommit: true,
        autoCommitInterval: 5000,
        autoCommitThreshold: 100,
        fromBeginning: false,
        partitionAssigners: ['RoundRobinAssigner'],
        retry: {
            initialRetryTime: 100,
            retries: 8,
            maxRetryTime: 30000,
            factor: 0.2,
            multiplier: 2,
        },
    },
    topics: [
        {
            name: 'trialbyte.trials.events',
            numPartitions: 12,
            replicationFactor: 3,
            configEntries: [
                { name: 'retention.ms', value: '604800000' },
                { name: 'cleanup.policy', value: 'delete' },
                { name: 'compression.type', value: 'snappy' },
            ],
        },
        {
            name: 'trialbyte.drugs.updates',
            numPartitions: 6,
            replicationFactor: 3,
            configEntries: [
                { name: 'retention.ms', value: '2592000000' },
                { name: 'cleanup.policy', value: 'compact' },
            ],
        },
        {
            name: 'trialbyte.user.activity',
            numPartitions: 12,
            replicationFactor: 3,
            configEntries: [
                { name: 'retention.ms', value: '86400000' },
                { name: 'cleanup.policy', value: 'delete' },
            ],
        },
        {
            name: 'trialbyte.notifications',
            numPartitions: 6,
            replicationFactor: 3,
            configEntries: [
                { name: 'retention.ms', value: '604800000' },
                { name: 'cleanup.policy', value: 'delete' },
            ],
        },
    ],
    security: {
        enabled: true,
        protocol: 'sasl_ssl',
        ssl: {
            ca: '/etc/ssl/kafka/ca.crt',
            cert: '/etc/ssl/kafka/client.crt',
            key: '/etc/ssl/kafka/client.key',
            rejectUnauthorized: true,
        },
        sasl: {
            mechanism: 'scram-sha-512',
            username: process.env.KAFKA_USERNAME || '',
            password: process.env.KAFKA_PASSWORD || '',
        },
    },
    admin: {
        retry: {
            initialRetryTime: 100,
            retries: 5,
            maxRetryTime: 30000,
            factor: 0.2,
            multiplier: 2,
        },
    },
};

export default kafkaConfig;
