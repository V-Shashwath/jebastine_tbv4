/**
 * Cassandra Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Apache Cassandra configuration for time-series clinical data
 * @version 2.2.0
 * @environment production
 */

export interface CassandraConfig {
    connection: ConnectionConfig;
    cluster: ClusterConfig;
    loadBalancing: LoadBalancingConfig;
    retry: RetryConfig;
    consistency: ConsistencyConfig;
    pooling: PoolingConfig;
    ssl: SSLConfig;
    authentication: AuthenticationConfig;
}

interface ConnectionConfig {
    contactPoints: string[];
    localDataCenter: string;
    keyspace: string;
    protocolVersion: number;
    socketOptions: SocketOptions;
}

interface SocketOptions {
    connectTimeout: number;
    readTimeout: number;
    keepAlive: boolean;
    tcpNoDelay: boolean;
}

interface ClusterConfig {
    clusterName: string;
    datacenter: string;
    rack: string;
    replicationFactor: number;
    replicationStrategy: 'SimpleStrategy' | 'NetworkTopologyStrategy';
    datacenterReplication: Record<string, number>;
}

interface LoadBalancingConfig {
    policy: 'RoundRobin' | 'DCAwareRoundRobin' | 'TokenAware' | 'WhiteList';
    localDataCenter: string;
    usedHostsPerRemoteDC: number;
    allowRemoteDCsForLocalConsistencyLevel: boolean;
}

interface RetryConfig {
    maxRetries: number;
    retryDelayMs: number;
    retryOnTimeout: boolean;
    retryOnUnavailable: boolean;
    retryOnReadTimeout: boolean;
    retryOnWriteTimeout: boolean;
}

interface ConsistencyConfig {
    read: ConsistencyLevel;
    write: ConsistencyLevel;
    serial: ConsistencyLevel;
    default: ConsistencyLevel;
}

type ConsistencyLevel = 'any' | 'one' | 'two' | 'three' | 'quorum' | 'all' | 'localQuorum' | 'eachQuorum' | 'serial' | 'localSerial' | 'localOne';

interface PoolingConfig {
    coreConnectionsPerHost: {
        local: number;
        remote: number;
    };
    maxConnectionsPerHost: {
        local: number;
        remote: number;
    };
    maxRequestsPerConnection: number;
    heartbeatIntervalSeconds: number;
}

interface SSLConfig {
    enabled: boolean;
    ca: string;
    cert: string;
    key: string;
    rejectUnauthorized: boolean;
    checkServerIdentity: boolean;
}

interface AuthenticationConfig {
    enabled: boolean;
    username: string;
    password: string;
    provider: 'PlainTextAuthProvider' | 'DsePlainTextAuthProvider';
}

const cassandraConfig: CassandraConfig = {
    connection: {
        contactPoints: [
            'cassandra-node-1.trialbyte.internal',
            'cassandra-node-2.trialbyte.internal',
            'cassandra-node-3.trialbyte.internal',
        ],
        localDataCenter: 'us-east-1',
        keyspace: 'trialbyte_timeseries',
        protocolVersion: 4,
        socketOptions: {
            connectTimeout: 5000,
            readTimeout: 12000,
            keepAlive: true,
            tcpNoDelay: true,
        },
    },
    cluster: {
        clusterName: 'trialbyte-cassandra-cluster',
        datacenter: 'us-east-1',
        rack: 'rack1',
        replicationFactor: 3,
        replicationStrategy: 'NetworkTopologyStrategy',
        datacenterReplication: {
            'us-east-1': 3,
            'us-west-2': 2,
            'eu-west-1': 2,
        },
    },
    loadBalancing: {
        policy: 'TokenAware',
        localDataCenter: 'us-east-1',
        usedHostsPerRemoteDC: 0,
        allowRemoteDCsForLocalConsistencyLevel: false,
    },
    retry: {
        maxRetries: 3,
        retryDelayMs: 1000,
        retryOnTimeout: true,
        retryOnUnavailable: true,
        retryOnReadTimeout: true,
        retryOnWriteTimeout: false,
    },
    consistency: {
        read: 'localQuorum',
        write: 'localQuorum',
        serial: 'localSerial',
        default: 'localQuorum',
    },
    pooling: {
        coreConnectionsPerHost: {
            local: 2,
            remote: 1,
        },
        maxConnectionsPerHost: {
            local: 8,
            remote: 2,
        },
        maxRequestsPerConnection: 32768,
        heartbeatIntervalSeconds: 30,
    },
    ssl: {
        enabled: true,
        ca: '/etc/ssl/cassandra/ca.crt',
        cert: '/etc/ssl/cassandra/client.crt',
        key: '/etc/ssl/cassandra/client.key',
        rejectUnauthorized: true,
        checkServerIdentity: true,
    },
    authentication: {
        enabled: true,
        username: process.env.CASSANDRA_USER || '',
        password: process.env.CASSANDRA_PASSWORD || '',
        provider: 'PlainTextAuthProvider',
    },
};

export default cassandraConfig;
