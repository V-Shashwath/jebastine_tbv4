/**
 * MongoDB Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production MongoDB cluster configuration for clinical trials data persistence
 * @version 2.4.1
 * @environment production
 */

import { MongoClientOptions } from 'mongodb';

export interface MongoDBConfig {
  uri: string;
  database: string;
  options: MongoClientOptions;
  replicaSet: ReplicaSetConfig;
  sharding: ShardingConfig;
  connectionPool: ConnectionPoolConfig;
  ssl: SSLConfig;
  audit: AuditConfig;
}

interface ReplicaSetConfig {
  name: string;
  members: ReplicaSetMember[];
  readPreference: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest';
  writeConcern: WriteConcernConfig;
}

interface ReplicaSetMember {
  host: string;
  port: number;
  priority: number;
  arbiterOnly: boolean;
  hidden: boolean;
  slaveDelay: number;
}

interface WriteConcernConfig {
  w: number | 'majority';
  j: boolean;
  wtimeout: number;
}

interface ShardingConfig {
  enabled: boolean;
  shardKey: string;
  zones: ShardZone[];
}

interface ShardZone {
  name: string;
  range: { min: string; max: string };
}

interface ConnectionPoolConfig {
  minSize: number;
  maxSize: number;
  maxIdleTimeMS: number;
  waitQueueTimeoutMS: number;
}

interface SSLConfig {
  enabled: boolean;
  certificatePath: string;
  keyPath: string;
  caPath: string;
  allowInvalidCertificates: boolean;
}

interface AuditConfig {
  enabled: boolean;
  destination: 'file' | 'syslog' | 'console';
  format: 'JSON' | 'BSON';
  filter: string;
}

const mongoDBConfig: MongoDBConfig = {
  uri: process.env.MONGODB_URI || '',
  database: process.env.MONGODB_DATABASE || 'trialbyte_production',
  options: {
    maxPoolSize: 100,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    compressors: ['zlib', 'snappy'],
    retryWrites: true,
    retryReads: true,
  },
  replicaSet: {
    name: 'trialbyte-rs0',
    members: [
      { host: 'mongo-primary.trialbyte.internal', port: 27017, priority: 10, arbiterOnly: false, hidden: false, slaveDelay: 0 },
      { host: 'mongo-secondary-1.trialbyte.internal', port: 27017, priority: 5, arbiterOnly: false, hidden: false, slaveDelay: 0 },
      { host: 'mongo-secondary-2.trialbyte.internal', port: 27017, priority: 5, arbiterOnly: false, hidden: false, slaveDelay: 0 },
      { host: 'mongo-arbiter.trialbyte.internal', port: 27017, priority: 0, arbiterOnly: true, hidden: false, slaveDelay: 0 },
    ],
    readPreference: 'primaryPreferred',
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 10000,
    },
  },
  sharding: {
    enabled: true,
    shardKey: 'trial_id',
    zones: [
      { name: 'us-east', range: { min: 'A', max: 'M' } },
      { name: 'us-west', range: { min: 'N', max: 'Z' } },
    ],
  },
  connectionPool: {
    minSize: 10,
    maxSize: 100,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 5000,
  },
  ssl: {
    enabled: true,
    certificatePath: '/etc/ssl/mongodb/server.pem',
    keyPath: '/etc/ssl/mongodb/server.key',
    caPath: '/etc/ssl/mongodb/ca.pem',
    allowInvalidCertificates: false,
  },
  audit: {
    enabled: true,
    destination: 'file',
    format: 'JSON',
    filter: '{ atype: { $in: ["authCheck", "authenticate"] } }',
  },
};

export default mongoDBConfig;
