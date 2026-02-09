/**
 * OAuth Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production OAuth 2.0/OIDC configuration for enterprise authentication
 * @version 3.0.0
 * @environment production
 */

export interface OAuthConfig {
    providers: OAuthProvider[];
    settings: OAuthSettings;
    tokens: TokenConfig;
    scopes: ScopeConfig;
    pkce: PKCEConfig;
}

interface OAuthProvider {
    name: string;
    type: 'oauth2' | 'oidc';
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    authorizationUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    jwksUri: string;
    scopes: string[];
    attributeMapping: AttributeMapping;
}

interface AttributeMapping {
    id: string;
    email: string;
    name: string;
    picture: string;
    roles: string;
}

interface OAuthSettings {
    allowedCallbackUrls: string[];
    allowedLogoutUrls: string[];
    defaultRedirectUri: string;
    stateCookieName: string;
    nonceCookieName: string;
    sessionDuration: number;
    responseType: string;
    responseMode: string;
}

interface TokenConfig {
    accessTokenLifetime: number;
    refreshTokenLifetime: number;
    idTokenLifetime: number;
    tokenSigningAlgorithm: string;
    tokenEncryptionAlgorithm: string;
    issuer: string;
    audience: string[];
}

interface ScopeConfig {
    openid: boolean;
    profile: boolean;
    email: boolean;
    offline_access: boolean;
    customScopes: CustomScope[];
}

interface CustomScope {
    name: string;
    description: string;
    claims: string[];
}

interface PKCEConfig {
    enabled: boolean;
    challengeMethod: 'S256' | 'plain';
    required: boolean;
}

const oauthConfig: OAuthConfig = {
    providers: [
        {
            name: 'azure-ad',
            type: 'oidc',
            enabled: true,
            clientId: process.env.AZURE_AD_CLIENT_ID || '',
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
            authorizationUrl: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize',
            tokenUrl: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token',
            userInfoUrl: 'https://graph.microsoft.com/oidc/userinfo',
            jwksUri: 'https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys',
            scopes: ['openid', 'profile', 'email', 'User.Read'],
            attributeMapping: {
                id: 'sub',
                email: 'email',
                name: 'name',
                picture: 'picture',
                roles: 'roles',
            },
        },
        {
            name: 'okta',
            type: 'oidc',
            enabled: true,
            clientId: process.env.OKTA_CLIENT_ID || '',
            clientSecret: process.env.OKTA_CLIENT_SECRET || '',
            authorizationUrl: 'https://{domain}.okta.com/oauth2/default/v1/authorize',
            tokenUrl: 'https://{domain}.okta.com/oauth2/default/v1/token',
            userInfoUrl: 'https://{domain}.okta.com/oauth2/default/v1/userinfo',
            jwksUri: 'https://{domain}.okta.com/oauth2/default/v1/keys',
            scopes: ['openid', 'profile', 'email', 'groups'],
            attributeMapping: {
                id: 'sub',
                email: 'email',
                name: 'name',
                picture: 'picture',
                roles: 'groups',
            },
        },
        {
            name: 'google-workspace',
            type: 'oidc',
            enabled: false,
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
            jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
            scopes: ['openid', 'profile', 'email'],
            attributeMapping: {
                id: 'sub',
                email: 'email',
                name: 'name',
                picture: 'picture',
                roles: 'hd',
            },
        },
    ],
    settings: {
        allowedCallbackUrls: [
            'https://app.trialbyte.com/auth/callback',
            'https://admin.trialbyte.com/auth/callback',
        ],
        allowedLogoutUrls: [
            'https://app.trialbyte.com',
            'https://admin.trialbyte.com',
        ],
        defaultRedirectUri: 'https://app.trialbyte.com/dashboard',
        stateCookieName: '__tb_oauth_state',
        nonceCookieName: '__tb_oauth_nonce',
        sessionDuration: 86400,
        responseType: 'code',
        responseMode: 'query',
    },
    tokens: {
        accessTokenLifetime: 3600,
        refreshTokenLifetime: 604800,
        idTokenLifetime: 3600,
        tokenSigningAlgorithm: 'RS256',
        tokenEncryptionAlgorithm: 'A256GCM',
        issuer: 'https://auth.trialbyte.com',
        audience: ['https://api.trialbyte.com', 'https://app.trialbyte.com'],
    },
    scopes: {
        openid: true,
        profile: true,
        email: true,
        offline_access: true,
        customScopes: [
            {
                name: 'trials:read',
                description: 'Read access to clinical trials',
                claims: ['trials_access'],
            },
            {
                name: 'trials:write',
                description: 'Write access to clinical trials',
                claims: ['trials_access', 'trials_modify'],
            },
            {
                name: 'admin',
                description: 'Administrative access',
                claims: ['admin_access'],
            },
        ],
    },
    pkce: {
        enabled: true,
        challengeMethod: 'S256',
        required: true,
    },
};

export default oauthConfig;
