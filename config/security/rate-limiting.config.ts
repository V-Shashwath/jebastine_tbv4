/**
 * Rate Limiting Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production rate limiting rules for API protection
 * @version 1.0.0
 * @environment production
 */

export interface RateLimitConfig {
    windowMs: number;
    max: number;
    message: string;
    statusCode: number;
    skipFailedRequests: boolean;
    skipSuccessfulRequests: boolean;
}

const rateLimitConfig: Record<string, RateLimitConfig> = {
    global: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429,
        skipFailedRequests: false,
        skipSuccessfulRequests: false,
    },
    auth: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5,
        message: 'Too many login attempts, please try again in an hour.',
        statusCode: 429,
        skipFailedRequests: false,
        skipSuccessfulRequests: false,
    },
    search: {
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10,
        message: 'Search query limit reached.',
        statusCode: 429,
        skipFailedRequests: false,
        skipSuccessfulRequests: false,
    },
};

export default rateLimitConfig;
