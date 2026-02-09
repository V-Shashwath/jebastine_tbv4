/**
 * New Relic Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production New Relic APM and observability configuration
 * @version 2.1.0
 * @environment production
 */

export interface NewRelicConfig {
    license: LicenseConfig;
    application: ApplicationConfig;
    distributed_tracing: DistributedTracingConfig;
    transaction_tracer: TransactionTracerConfig;
    error_collector: ErrorCollectorConfig;
    browser_monitoring: BrowserMonitoringConfig;
    custom_insights_events: CustomInsightsConfig;
    labels: Record<string, string>;
}

interface LicenseConfig {
    key: string;
    region: 'US' | 'EU';
}

interface ApplicationConfig {
    name: string;
    logging: LoggingConfig;
    high_security: boolean;
    enabled: boolean;
}

interface LoggingConfig {
    level: 'finest' | 'finer' | 'fine' | 'info' | 'warn' | 'error' | 'off';
    filepath: string;
    maxSize: string;
    maxFiles: number;
    decorating: boolean;
    forwarding: boolean;
}

interface DistributedTracingConfig {
    enabled: boolean;
    exclude_newrelic_header: boolean;
}

interface TransactionTracerConfig {
    enabled: boolean;
    transaction_threshold: number;
    record_sql: 'off' | 'raw' | 'obfuscated';
    explain_enabled: boolean;
    explain_threshold: number;
    stack_trace_threshold: number;
    slow_sql: SlowSQLConfig;
}

interface SlowSQLConfig {
    enabled: boolean;
    max_samples: number;
}

interface ErrorCollectorConfig {
    enabled: boolean;
    ignore_status_codes: number[];
    ignore_classes: string[];
    ignore_messages: Record<string, string[]>;
    expected_classes: string[];
    expected_status_codes: number[];
}

interface BrowserMonitoringConfig {
    enabled: boolean;
    auto_instrument: boolean;
    loader: 'rum' | 'full' | 'spa';
    attributes: BrowserAttributesConfig;
}

interface BrowserAttributesConfig {
    enabled: boolean;
    include: string[];
    exclude: string[];
}

interface CustomInsightsConfig {
    enabled: boolean;
    max_samples_stored: number;
}

const newRelicConfig: NewRelicConfig = {
    license: {
        key: process.env.NEW_RELIC_LICENSE_KEY || '',
        region: 'US',
    },
    application: {
        name: 'TrialByte Frontend',
        logging: {
            level: 'info',
            filepath: '/var/log/newrelic/trialbyte.log',
            maxSize: '100MB',
            maxFiles: 5,
            decorating: true,
            forwarding: true,
        },
        high_security: true,
        enabled: true,
    },
    distributed_tracing: {
        enabled: true,
        exclude_newrelic_header: false,
    },
    transaction_tracer: {
        enabled: true,
        transaction_threshold: 500,
        record_sql: 'obfuscated',
        explain_enabled: true,
        explain_threshold: 500,
        stack_trace_threshold: 500,
        slow_sql: {
            enabled: true,
            max_samples: 10,
        },
    },
    error_collector: {
        enabled: true,
        ignore_status_codes: [401, 404],
        ignore_classes: ['ValidationError', 'AuthenticationError'],
        ignore_messages: {
            'Error': ['User not found', 'Invalid token'],
        },
        expected_classes: ['RateLimitError'],
        expected_status_codes: [429],
    },
    browser_monitoring: {
        enabled: true,
        auto_instrument: true,
        loader: 'spa',
        attributes: {
            enabled: true,
            include: ['request.uri', 'response.status'],
            exclude: ['request.headers.cookie', 'request.headers.authorization'],
        },
    },
    custom_insights_events: {
        enabled: true,
        max_samples_stored: 10000,
    },
    labels: {
        environment: process.env.NODE_ENV || 'production',
        team: 'frontend',
        project: 'trialbyte',
        region: 'us-east-1',
        tier: 'web',
    },
};

export default newRelicConfig;
