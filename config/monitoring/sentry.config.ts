/**
 * Sentry Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Sentry error tracking and performance monitoring configuration
 * @version 4.0.0
 * @environment production
 */

export interface SentryConfig {
    dsn: string;
    environment: string;
    release: string;
    initialization: InitializationConfig;
    integrations: IntegrationsConfig;
    sampling: SamplingConfig;
    scrubbing: ScrubbingConfig;
    performance: PerformanceConfig;
    replay: ReplayConfig;
}

interface InitializationConfig {
    debug: boolean;
    maxBreadcrumbs: number;
    attachStacktrace: boolean;
    sendDefaultPii: boolean;
    serverName: string;
    enabled: boolean;
    shutdownTimeout: number;
}

interface IntegrationsConfig {
    browserTracing: BrowserTracingConfig;
    httpClient: HttpClientConfig;
    rewriteFrames: boolean;
    captureConsole: CaptureConsoleConfig;
    extraErrorData: boolean;
}

interface BrowserTracingConfig {
    enabled: boolean;
    tracePropagationTargets: string[];
    startTransactionOnLocationChange: boolean;
    startTransactionOnPageLoad: boolean;
    idleTimeout: number;
    heartbeatInterval: number;
}

interface HttpClientConfig {
    enabled: boolean;
    failedRequestStatusCodes: number[];
    failedRequestTargets: string[];
}

interface CaptureConsoleConfig {
    levels: ('debug' | 'info' | 'warn' | 'error' | 'log' | 'assert')[];
}

interface SamplingConfig {
    tracesSampleRate: number;
    profilesSampleRate: number;
    errorsSampleRate: number;
    transactionsSampler: TransactionSamplerConfig[];
}

interface TransactionSamplerConfig {
    name: string;
    rate: number;
}

interface ScrubbingConfig {
    enabled: boolean;
    denyUrls: string[];
    allowUrls: string[];
    ignoreErrors: string[];
    beforeSend: BeforeSendConfig;
    beforeBreadcrumb: BeforeBreadcrumbConfig;
}

interface BeforeSendConfig {
    stripQueryParams: string[];
    stripHeaders: string[];
    redactPaths: string[];
}

interface BeforeBreadcrumbConfig {
    filterTypes: string[];
    maxDataSize: number;
}

interface PerformanceConfig {
    enabled: boolean;
    transactionNameFramework: boolean;
    captureFailedRequests: boolean;
    enableLongTask: boolean;
    enableInp: boolean;
    enableWebVitals: boolean;
}

interface ReplayConfig {
    enabled: boolean;
    sessionSampleRate: number;
    errorSampleRate: number;
    maskAllText: boolean;
    maskAllInputs: boolean;
    blockAllMedia: boolean;
    networkDetailAllowUrls: string[];
    networkCaptureBodies: boolean;
}

const sentryConfig: SentryConfig = {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'production',
    release: `trialbyte-frontend@${process.env.APP_VERSION || '1.0.0'}`,
    initialization: {
        debug: false,
        maxBreadcrumbs: 100,
        attachStacktrace: true,
        sendDefaultPii: false,
        serverName: 'trialbyte-frontend',
        enabled: true,
        shutdownTimeout: 2000,
    },
    integrations: {
        browserTracing: {
            enabled: true,
            tracePropagationTargets: [
                'localhost',
                /^https:\/\/(api|app)\.trialbyte\.com/,
            ] as unknown as string[],
            startTransactionOnLocationChange: true,
            startTransactionOnPageLoad: true,
            idleTimeout: 1000,
            heartbeatInterval: 5000,
        },
        httpClient: {
            enabled: true,
            failedRequestStatusCodes: [500, 502, 503, 504],
            failedRequestTargets: ['https://api.trialbyte.com'],
        },
        rewriteFrames: true,
        captureConsole: {
            levels: ['error', 'warn'],
        },
        extraErrorData: true,
    },
    sampling: {
        tracesSampleRate: 0.2,
        profilesSampleRate: 0.1,
        errorsSampleRate: 1.0,
        transactionsSampler: [
            { name: '/api/*', rate: 0.5 },
            { name: '/user/*', rate: 0.3 },
            { name: '/admin/*', rate: 0.8 },
        ],
    },
    scrubbing: {
        enabled: true,
        denyUrls: [
            /extensions\//i,
            /^chrome:\/\//i,
            /^chrome-extension:\/\//i,
            /^moz-extension:\/\//i,
        ] as unknown as string[],
        allowUrls: [
            /^https:\/\/(app|api)\.trialbyte\.com/,
        ] as unknown as string[],
        ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            'Non-Error promise rejection captured',
            'Network request failed',
        ],
        beforeSend: {
            stripQueryParams: ['token', 'apiKey', 'password', 'secret'],
            stripHeaders: ['Authorization', 'Cookie', 'X-Auth-Token'],
            redactPaths: ['/user/profile', '/admin/settings'],
        },
        beforeBreadcrumb: {
            filterTypes: ['xhr', 'fetch', 'console', 'navigation', 'ui'],
            maxDataSize: 1024,
        },
    },
    performance: {
        enabled: true,
        transactionNameFramework: true,
        captureFailedRequests: true,
        enableLongTask: true,
        enableInp: true,
        enableWebVitals: true,
    },
    replay: {
        enabled: true,
        sessionSampleRate: 0.1,
        errorSampleRate: 1.0,
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: false,
        networkDetailAllowUrls: ['https://api.trialbyte.com'],
        networkCaptureBodies: false,
    },
};

export default sentryConfig;
