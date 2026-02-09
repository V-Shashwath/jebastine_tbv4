/**
 * Datadog Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Datadog APM and monitoring configuration
 * @version 3.0.0
 * @environment production
 */

export interface DatadogConfig {
    agent: AgentConfig;
    apm: APMConfig;
    logs: LogsConfig;
    metrics: MetricsConfig;
    rum: RUMConfig;
    synthetics: SyntheticsConfig;
}

interface AgentConfig {
    apiKey: string;
    site: 'datadoghq.com' | 'datadoghq.eu' | 'us3.datadoghq.com' | 'us5.datadoghq.com' | 'ddog-gov.com';
    hostname: string;
    tags: string[];
    env: string;
    service: string;
    version: string;
}

interface APMConfig {
    enabled: boolean;
    traceAgentUrl: string;
    sampleRate: number;
    analyticsEnabled: boolean;
    runtimeMetrics: boolean;
    profiling: ProfilingConfig;
    errorTracking: ErrorTrackingConfig;
}

interface ProfilingConfig {
    enabled: boolean;
    cpuEnabled: boolean;
    heapEnabled: boolean;
    uploadPeriod: number;
}

interface ErrorTrackingConfig {
    enabled: boolean;
    sampleRate: number;
    maxLogLines: number;
}

interface LogsConfig {
    enabled: boolean;
    forwardConsoleLogs: boolean;
    forwardErrorsToLogs: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    sampleRate: number;
    excludePatterns: string[];
}

interface MetricsConfig {
    enabled: boolean;
    flushInterval: number;
    histogramAggregates: string[];
    histogramPercentiles: number[];
    customMetrics: CustomMetricConfig[];
}

interface CustomMetricConfig {
    name: string;
    type: 'count' | 'gauge' | 'histogram' | 'distribution';
    tags: string[];
}

interface RUMConfig {
    enabled: boolean;
    applicationId: string;
    clientToken: string;
    sessionSampleRate: number;
    sessionReplaySampleRate: number;
    trackInteractions: boolean;
    trackFrustrations: boolean;
    trackResources: boolean;
    trackLongTasks: boolean;
    defaultPrivacyLevel: 'mask-user-input' | 'mask' | 'allow';
}

interface SyntheticsConfig {
    enabled: boolean;
    tests: SyntheticTest[];
}

interface SyntheticTest {
    name: string;
    type: 'api' | 'browser';
    url: string;
    frequency: number;
    locations: string[];
    assertions: Assertion[];
}

interface Assertion {
    type: 'statusCode' | 'responseTime' | 'body';
    operator: 'is' | 'contains' | 'lessThan' | 'greaterThan';
    target: string | number;
}

const datadogConfig: DatadogConfig = {
    agent: {
        apiKey: process.env.DATADOG_API_KEY || '',
        site: 'datadoghq.com',
        hostname: 'trialbyte-frontend',
        tags: [
            `env:${process.env.NODE_ENV || 'production'}`,
            'team:frontend',
            'project:trialbyte',
        ],
        env: process.env.NODE_ENV || 'production',
        service: 'trialbyte-frontend',
        version: process.env.APP_VERSION || '1.0.0',
    },
    apm: {
        enabled: true,
        traceAgentUrl: 'https://trace.agent.datadoghq.com',
        sampleRate: 1.0,
        analyticsEnabled: true,
        runtimeMetrics: true,
        profiling: {
            enabled: true,
            cpuEnabled: true,
            heapEnabled: true,
            uploadPeriod: 60,
        },
        errorTracking: {
            enabled: true,
            sampleRate: 1.0,
            maxLogLines: 10,
        },
    },
    logs: {
        enabled: true,
        forwardConsoleLogs: true,
        forwardErrorsToLogs: true,
        logLevel: 'info',
        sampleRate: 100,
        excludePatterns: ['/health', '/ready', '/metrics'],
    },
    metrics: {
        enabled: true,
        flushInterval: 10,
        histogramAggregates: ['max', 'median', 'avg', 'count'],
        histogramPercentiles: [0.75, 0.90, 0.95, 0.99],
        customMetrics: [
            { name: 'trialbyte.trials.viewed', type: 'count', tags: ['trial_id', 'user_role'] },
            { name: 'trialbyte.search.duration', type: 'histogram', tags: ['query_type'] },
            { name: 'trialbyte.active_users', type: 'gauge', tags: ['user_role'] },
        ],
    },
    rum: {
        enabled: true,
        applicationId: process.env.DATADOG_RUM_APP_ID || '',
        clientToken: process.env.DATADOG_RUM_CLIENT_TOKEN || '',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackInteractions: true,
        trackFrustrations: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
    },
    synthetics: {
        enabled: true,
        tests: [
            {
                name: 'Homepage Load Test',
                type: 'browser',
                url: 'https://app.trialbyte.com',
                frequency: 300,
                locations: ['aws:us-east-1', 'aws:eu-west-1'],
                assertions: [
                    { type: 'statusCode', operator: 'is', target: 200 },
                    { type: 'responseTime', operator: 'lessThan', target: 3000 },
                ],
            },
            {
                name: 'API Health Check',
                type: 'api',
                url: 'https://api.trialbyte.com/health',
                frequency: 60,
                locations: ['aws:us-east-1', 'aws:us-west-2', 'aws:eu-west-1'],
                assertions: [
                    { type: 'statusCode', operator: 'is', target: 200 },
                    { type: 'responseTime', operator: 'lessThan', target: 500 },
                ],
            },
        ],
    },
};

export default datadogConfig;
