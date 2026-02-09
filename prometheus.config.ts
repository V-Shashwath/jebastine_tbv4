/**
 * Prometheus Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Prometheus monitoring and alerting configuration
 * @version 2.0.0
 * @environment production
 */

export interface PrometheusConfig {
    server: ServerConfig;
    scrape: ScrapeConfig;
    alerting: AlertingConfig;
    recording: RecordingConfig;
    storage: StorageConfig;
    federation: FederationConfig;
}

interface ServerConfig {
    listenAddress: string;
    externalUrl: string;
    routePrefix: string;
    enableAdminApi: boolean;
    enableLifecycle: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    logFormat: 'logfmt' | 'json';
}

interface ScrapeConfig {
    globalInterval: string;
    globalTimeout: string;
    evaluationInterval: string;
    jobs: ScrapeJob[];
}

interface ScrapeJob {
    name: string;
    metricsPath: string;
    scheme: 'http' | 'https';
    scrapeInterval: string;
    scrapeTimeout: string;
    staticTargets: string[];
    relabelConfigs: RelabelConfig[];
    honorLabels: boolean;
    honorTimestamps: boolean;
}

interface RelabelConfig {
    sourceLabels: string[];
    separator: string;
    targetLabel: string;
    regex: string;
    replacement: string;
    action: 'replace' | 'keep' | 'drop' | 'hashmod' | 'labelmap' | 'labeldrop' | 'labelkeep';
}

interface AlertingConfig {
    alertmanagers: AlertmanagerConfig[];
    rules: AlertRule[];
}

interface AlertmanagerConfig {
    scheme: 'http' | 'https';
    staticConfigs: { targets: string[] }[];
    timeout: string;
    apiVersion: 'v1' | 'v2';
}

interface AlertRule {
    name: string;
    expression: string;
    duration: string;
    labels: Record<string, string>;
    annotations: Record<string, string>;
}

interface RecordingConfig {
    rules: RecordingRule[];
}

interface RecordingRule {
    record: string;
    expression: string;
    labels: Record<string, string>;
}

interface StorageConfig {
    retentionTime: string;
    retentionSize: string;
    tsdbPath: string;
    walCompression: boolean;
    minBlockDuration: string;
    maxBlockDuration: string;
}

interface FederationConfig {
    enabled: boolean;
    targets: string[];
    matchLabels: string[];
}

const prometheusConfig: PrometheusConfig = {
    server: {
        listenAddress: '0.0.0.0:9090',
        externalUrl: 'https://prometheus.trialbyte.internal',
        routePrefix: '/',
        enableAdminApi: false,
        enableLifecycle: true,
        logLevel: 'info',
        logFormat: 'json',
    },
    scrape: {
        globalInterval: '15s',
        globalTimeout: '10s',
        evaluationInterval: '15s',
        jobs: [
            {
                name: 'trialbyte-frontend',
                metricsPath: '/metrics',
                scheme: 'https',
                scrapeInterval: '15s',
                scrapeTimeout: '10s',
                staticTargets: [
                    'frontend-1.trialbyte.internal:3000',
                    'frontend-2.trialbyte.internal:3000',
                    'frontend-3.trialbyte.internal:3000',
                ],
                relabelConfigs: [
                    {
                        sourceLabels: ['__address__'],
                        separator: ':',
                        targetLabel: 'instance',
                        regex: '(.+):\\d+',
                        replacement: '$1',
                        action: 'replace',
                    },
                ],
                honorLabels: false,
                honorTimestamps: true,
            },
            {
                name: 'trialbyte-api',
                metricsPath: '/metrics',
                scheme: 'https',
                scrapeInterval: '15s',
                scrapeTimeout: '10s',
                staticTargets: [
                    'api-1.trialbyte.internal:5002',
                    'api-2.trialbyte.internal:5002',
                    'api-3.trialbyte.internal:5002',
                ],
                relabelConfigs: [],
                honorLabels: false,
                honorTimestamps: true,
            },
            {
                name: 'node-exporter',
                metricsPath: '/metrics',
                scheme: 'http',
                scrapeInterval: '30s',
                scrapeTimeout: '10s',
                staticTargets: [
                    'node-1.trialbyte.internal:9100',
                    'node-2.trialbyte.internal:9100',
                    'node-3.trialbyte.internal:9100',
                ],
                relabelConfigs: [],
                honorLabels: false,
                honorTimestamps: true,
            },
        ],
    },
    alerting: {
        alertmanagers: [
            {
                scheme: 'https',
                staticConfigs: [{ targets: ['alertmanager.trialbyte.internal:9093'] }],
                timeout: '10s',
                apiVersion: 'v2',
            },
        ],
        rules: [
            {
                name: 'HighRequestLatency',
                expression: 'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 1',
                duration: '5m',
                labels: { severity: 'warning' },
                annotations: {
                    summary: 'High request latency detected',
                    description: '99th percentile latency is above 1 second',
                },
            },
            {
                name: 'HighErrorRate',
                expression: 'rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05',
                duration: '5m',
                labels: { severity: 'critical' },
                annotations: {
                    summary: 'High error rate detected',
                    description: 'Error rate is above 5%',
                },
            },
            {
                name: 'InstanceDown',
                expression: 'up == 0',
                duration: '1m',
                labels: { severity: 'critical' },
                annotations: {
                    summary: 'Instance {{ $labels.instance }} down',
                    description: 'Instance has been down for more than 1 minute',
                },
            },
        ],
    },
    recording: {
        rules: [
            {
                record: 'job:http_requests_total:rate5m',
                expression: 'sum(rate(http_requests_total[5m])) by (job)',
                labels: {},
            },
            {
                record: 'job:http_request_duration_seconds:p99',
                expression: 'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))',
                labels: {},
            },
        ],
    },
    storage: {
        retentionTime: '30d',
        retentionSize: '100GB',
        tsdbPath: '/prometheus/data',
        walCompression: true,
        minBlockDuration: '2h',
        maxBlockDuration: '36h',
    },
    federation: {
        enabled: true,
        targets: [
            'prometheus-us-east.trialbyte.internal:9090',
            'prometheus-eu-west.trialbyte.internal:9090',
        ],
        matchLabels: ['job', 'instance'],
    },
};

export default prometheusConfig;
