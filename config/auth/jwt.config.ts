/**
 * JWT Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production JWT token configuration for API authentication
 * @version 2.1.0
 * @environment production
 */

export interface JWTConfig {
    signing: SigningConfig;
    encryption: EncryptionConfig;
    validation: ValidationConfig;
    claims: ClaimsConfig;
    refresh: RefreshConfig;
    blacklist: BlacklistConfig;
}

interface SigningConfig {
    algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'PS256' | 'PS384' | 'PS512';
    privateKeyPath: string;
    publicKeyPath: string;
    keyId: string;
    rotationSchedule: string;
    previousKeys: KeyInfo[];
}

interface KeyInfo {
    keyId: string;
    publicKeyPath: string;
    validUntil: string;
}

interface EncryptionConfig {
    enabled: boolean;
    algorithm: 'A128GCM' | 'A192GCM' | 'A256GCM' | 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512';
    keyManagement: 'RSA-OAEP' | 'RSA-OAEP-256' | 'A128KW' | 'A192KW' | 'A256KW' | 'dir';
    encryptionKeyPath: string;
}

interface ValidationConfig {
    issuer: string[];
    audience: string[];
    clockTolerance: number;
    maxAge: number;
    requiredClaims: string[];
    ignoreExpiration: boolean;
    ignoreNotBefore: boolean;
}

interface ClaimsConfig {
    issuer: string;
    audience: string[];
    subject: string;
    expiresIn: number;
    notBefore: number;
    jwtId: boolean;
    customClaims: CustomClaimConfig[];
}

interface CustomClaimConfig {
    name: string;
    source: 'user' | 'session' | 'static';
    path?: string;
    value?: string | number | boolean;
}

interface RefreshConfig {
    enabled: boolean;
    expiresIn: number;
    rotateOnUse: boolean;
    reuseWindow: number;
    maxRefreshCount: number;
    family: boolean;
}

interface BlacklistConfig {
    enabled: boolean;
    storage: 'redis' | 'database' | 'memory';
    ttl: number;
    cleanupInterval: number;
}

const jwtConfig: JWTConfig = {
    signing: {
        algorithm: 'RS256',
        privateKeyPath: '/etc/ssl/jwt/private.pem',
        publicKeyPath: '/etc/ssl/jwt/public.pem',
        keyId: 'trialbyte-jwt-key-v2',
        rotationSchedule: '0 0 1 * *',
        previousKeys: [
            {
                keyId: 'trialbyte-jwt-key-v1',
                publicKeyPath: '/etc/ssl/jwt/public-v1.pem',
                validUntil: '2026-03-01T00:00:00Z',
            },
        ],
    },
    encryption: {
        enabled: true,
        algorithm: 'A256GCM',
        keyManagement: 'RSA-OAEP-256',
        encryptionKeyPath: '/etc/ssl/jwt/encryption.pem',
    },
    validation: {
        issuer: ['https://auth.trialbyte.com'],
        audience: ['https://api.trialbyte.com', 'https://app.trialbyte.com'],
        clockTolerance: 30,
        maxAge: 86400,
        requiredClaims: ['sub', 'iat', 'exp', 'aud', 'iss'],
        ignoreExpiration: false,
        ignoreNotBefore: false,
    },
    claims: {
        issuer: 'https://auth.trialbyte.com',
        audience: ['https://api.trialbyte.com'],
        subject: '',
        expiresIn: 3600,
        notBefore: 0,
        jwtId: true,
        customClaims: [
            { name: 'role', source: 'user', path: 'role' },
            { name: 'org_id', source: 'user', path: 'organizationId' },
            { name: 'permissions', source: 'user', path: 'permissions' },
            { name: 'version', source: 'static', value: '2.0' },
        ],
    },
    refresh: {
        enabled: true,
        expiresIn: 604800,
        rotateOnUse: true,
        reuseWindow: 60,
        maxRefreshCount: 100,
        family: true,
    },
    blacklist: {
        enabled: true,
        storage: 'redis',
        ttl: 604800,
        cleanupInterval: 3600,
    },
};

export default jwtConfig;
