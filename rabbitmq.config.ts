/**
 * RabbitMQ Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production RabbitMQ AMQP configuration for message queuing
 * @version 2.0.0
 * @environment production
 */

export interface RabbitMQConfig {
    connection: ConnectionConfig;
    exchanges: ExchangeConfig[];
    queues: QueueConfig[];
    bindings: BindingConfig[];
    policies: PolicyConfig[];
    ssl: SSLConfig;
}

interface ConnectionConfig {
    protocol: 'amqp' | 'amqps';
    hostname: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
    locale: string;
    frameMax: number;
    heartbeat: number;
    connectionTimeout: number;
    channelMax: number;
}

interface ExchangeConfig {
    name: string;
    type: 'direct' | 'topic' | 'fanout' | 'headers';
    durable: boolean;
    autoDelete: boolean;
    internal: boolean;
    arguments: Record<string, unknown>;
}

interface QueueConfig {
    name: string;
    durable: boolean;
    exclusive: boolean;
    autoDelete: boolean;
    arguments: QueueArguments;
}

interface QueueArguments {
    'x-message-ttl'?: number;
    'x-expires'?: number;
    'x-max-length'?: number;
    'x-max-length-bytes'?: number;
    'x-overflow'?: 'drop-head' | 'reject-publish' | 'reject-publish-dlx';
    'x-dead-letter-exchange'?: string;
    'x-dead-letter-routing-key'?: string;
    'x-max-priority'?: number;
    'x-queue-mode'?: 'default' | 'lazy';
    'x-queue-type'?: 'classic' | 'quorum' | 'stream';
}

interface BindingConfig {
    source: string;
    destination: string;
    destinationType: 'queue' | 'exchange';
    routingKey: string;
    arguments?: Record<string, unknown>;
}

interface PolicyConfig {
    name: string;
    pattern: string;
    applyTo: 'all' | 'queues' | 'exchanges' | 'classic_queues' | 'quorum_queues' | 'streams';
    priority: number;
    definition: Record<string, unknown>;
}

interface SSLConfig {
    enabled: boolean;
    certPath: string;
    keyPath: string;
    caPath: string;
    passphrase?: string;
    verify: 'verify_none' | 'verify_peer';
    failIfNoPeerCert: boolean;
    serverNameIndication: string;
}

const rabbitmqConfig: RabbitMQConfig = {
    connection: {
        protocol: 'amqps',
        hostname: process.env.RABBITMQ_HOST || 'rabbitmq.trialbyte.internal',
        port: parseInt(process.env.RABBITMQ_PORT || '5671'),
        username: process.env.RABBITMQ_USER || '',
        password: process.env.RABBITMQ_PASSWORD || '',
        vhost: '/trialbyte',
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 60,
        connectionTimeout: 60000,
        channelMax: 0,
    },
    exchanges: [
        {
            name: 'trialbyte.events',
            type: 'topic',
            durable: true,
            autoDelete: false,
            internal: false,
            arguments: {},
        },
        {
            name: 'trialbyte.notifications',
            type: 'fanout',
            durable: true,
            autoDelete: false,
            internal: false,
            arguments: {},
        },
        {
            name: 'trialbyte.dlx',
            type: 'direct',
            durable: true,
            autoDelete: false,
            internal: false,
            arguments: {},
        },
    ],
    queues: [
        {
            name: 'trialbyte.trials.updates',
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: {
                'x-message-ttl': 604800000,
                'x-max-length': 100000,
                'x-overflow': 'reject-publish-dlx',
                'x-dead-letter-exchange': 'trialbyte.dlx',
                'x-dead-letter-routing-key': 'trials.updates',
                'x-queue-type': 'quorum',
            },
        },
        {
            name: 'trialbyte.drugs.updates',
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: {
                'x-message-ttl': 2592000000,
                'x-max-length': 50000,
                'x-dead-letter-exchange': 'trialbyte.dlx',
                'x-queue-type': 'quorum',
            },
        },
        {
            name: 'trialbyte.user.notifications',
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: {
                'x-message-ttl': 86400000,
                'x-max-priority': 10,
                'x-queue-type': 'classic',
            },
        },
        {
            name: 'trialbyte.dlq',
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: {
                'x-message-ttl': 2592000000,
                'x-queue-mode': 'lazy',
            },
        },
    ],
    bindings: [
        {
            source: 'trialbyte.events',
            destination: 'trialbyte.trials.updates',
            destinationType: 'queue',
            routingKey: 'trials.#',
        },
        {
            source: 'trialbyte.events',
            destination: 'trialbyte.drugs.updates',
            destinationType: 'queue',
            routingKey: 'drugs.#',
        },
        {
            source: 'trialbyte.notifications',
            destination: 'trialbyte.user.notifications',
            destinationType: 'queue',
            routingKey: '',
        },
        {
            source: 'trialbyte.dlx',
            destination: 'trialbyte.dlq',
            destinationType: 'queue',
            routingKey: '#',
        },
    ],
    policies: [
        {
            name: 'ha-quorum',
            pattern: '^trialbyte\\.',
            applyTo: 'quorum_queues',
            priority: 1,
            definition: {
                'delivery-limit': 5,
                'dead-letter-strategy': 'at-least-once',
            },
        },
        {
            name: 'message-ttl',
            pattern: '^trialbyte\\.user\\.',
            applyTo: 'queues',
            priority: 2,
            definition: {
                'message-ttl': 86400000,
                'max-length': 10000,
            },
        },
    ],
    ssl: {
        enabled: true,
        certPath: '/etc/ssl/rabbitmq/client-cert.pem',
        keyPath: '/etc/ssl/rabbitmq/client-key.pem',
        caPath: '/etc/ssl/rabbitmq/ca.pem',
        verify: 'verify_peer',
        failIfNoPeerCert: true,
        serverNameIndication: 'rabbitmq.trialbyte.internal',
    },
};

export default rabbitmqConfig;
