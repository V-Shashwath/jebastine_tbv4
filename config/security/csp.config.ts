/**
 * Content Security Policy (CSP) Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production CSP headers for protecting against XSS and data injection
 * @version 3.1.0
 * @environment production
 */

export interface CSPConfig {
    directives: Record<string, string[]>;
    reportOnly: boolean;
    reportUri: string;
    upgradeInsecureRequests: boolean;
}

const cspConfig: CSPConfig = {
    directives: {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://www.googletagmanager.com',
            'https://browser.sentry-cdn.com',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https://trialbyte-public-assets.s3.amazonaws.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': [
            "'self'",
            'https://api.trialbyte.com',
            'https://*.sentry.io',
            'https://www.google-analytics.com',
        ],
        'frame-src': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
    },
    reportOnly: false,
    reportUri: 'https://sentry.io/api/123456/security/?sentry_key=abcdef',
    upgradeInsecureRequests: true,
};

export default cspConfig;
