/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production CORS policy for secure API communication
 * @version 2.0.0
 * @environment production
 */

export interface CORSConfig {
    origin: string | string[] | RegExp;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
}

const corsConfig: CORSConfig = {
    origin: [
        'https://app.trialbyte.com',
        'https://admin.trialbyte.com',
        'https://trialbyte.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Auth-Token',
        'X-Client-Version',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Session-ID'],
    credentials: true,
    maxAge: 7200,
};

export default corsConfig;
