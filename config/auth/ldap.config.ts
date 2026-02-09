/**
 * LDAP Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production LDAP/Active Directory configuration for user authentication
 * @version 1.4.0
 * @environment production
 */

export interface LDAPConfig {
    connection: LDAPConnectionConfig;
    search: LDAPSearchConfig;
    authentication: LDAPAuthConfig;
    groupMapping: GroupMappingConfig;
    security: LDAPSecurityConfig;
    caching: CachingConfig;
}

interface LDAPConnectionConfig {
    url: string;
    baseDN: string;
    bindDN: string;
    bindPassword: string;
    timeout: number;
    connectTimeout: number;
    reconnect: boolean;
    reconnectInitialDelay: number;
    reconnectMaxDelay: number;
    reconnectFailAfter: number;
}

interface LDAPSearchConfig {
    userBase: string;
    userFilter: string;
    userAttributes: string[];
    groupBase: string;
    groupFilter: string;
    groupAttributes: string[];
    scope: 'base' | 'one' | 'sub';
    sizeLimit: number;
    timeLimit: number;
    paged: boolean;
    pageSize: number;
}

interface LDAPAuthConfig {
    method: 'simple' | 'sasl';
    saslMechanism?: 'PLAIN' | 'EXTERNAL' | 'GSSAPI' | 'DIGEST-MD5';
    usernameAttribute: string;
    passwordAttribute: string;
    passwordEncoding: 'plain' | 'md5' | 'sha' | 'ssha';
    allowEmptyPassword: boolean;
}

interface GroupMappingConfig {
    enabled: boolean;
    memberAttribute: string;
    memberOfAttribute: string;
    nestedGroups: boolean;
    maxNestingLevel: number;
    roleMapping: RoleMapping[];
}

interface RoleMapping {
    ldapGroup: string;
    applicationRole: string;
    permissions: string[];
}

interface LDAPSecurityConfig {
    ssl: boolean;
    startTLS: boolean;
    tlsOptions: TLSOptions;
    referrals: boolean;
    derefAliases: 'never' | 'searching' | 'finding' | 'always';
}

interface TLSOptions {
    ca: string;
    cert: string;
    key: string;
    rejectUnauthorized: boolean;
    minVersion: string;
}

interface CachingConfig {
    enabled: boolean;
    userTTL: number;
    groupTTL: number;
    maxSize: number;
    negativeTTL: number;
}

const ldapConfig: LDAPConfig = {
    connection: {
        url: process.env.LDAP_URL || 'ldaps://ldap.trialbyte.internal:636',
        baseDN: 'dc=trialbyte,dc=com',
        bindDN: 'cn=service-account,ou=Service Accounts,dc=trialbyte,dc=com',
        bindPassword: process.env.LDAP_BIND_PASSWORD || '',
        timeout: 30000,
        connectTimeout: 10000,
        reconnect: true,
        reconnectInitialDelay: 100,
        reconnectMaxDelay: 30000,
        reconnectFailAfter: 10,
    },
    search: {
        userBase: 'ou=Users,dc=trialbyte,dc=com',
        userFilter: '(&(objectClass=person)(sAMAccountName={{username}}))',
        userAttributes: [
            'dn', 'cn', 'sn', 'givenName', 'mail', 'sAMAccountName',
            'memberOf', 'department', 'title', 'telephoneNumber',
        ],
        groupBase: 'ou=Groups,dc=trialbyte,dc=com',
        groupFilter: '(&(objectClass=group)(member={{dn}}))',
        groupAttributes: ['dn', 'cn', 'description', 'member'],
        scope: 'sub',
        sizeLimit: 1000,
        timeLimit: 30,
        paged: true,
        pageSize: 250,
    },
    authentication: {
        method: 'simple',
        usernameAttribute: 'sAMAccountName',
        passwordAttribute: 'userPassword',
        passwordEncoding: 'plain',
        allowEmptyPassword: false,
    },
    groupMapping: {
        enabled: true,
        memberAttribute: 'member',
        memberOfAttribute: 'memberOf',
        nestedGroups: true,
        maxNestingLevel: 5,
        roleMapping: [
            {
                ldapGroup: 'CN=TrialByte-Admins,OU=Groups,DC=trialbyte,DC=com',
                applicationRole: 'admin',
                permissions: ['*'],
            },
            {
                ldapGroup: 'CN=TrialByte-Managers,OU=Groups,DC=trialbyte,DC=com',
                applicationRole: 'manager',
                permissions: ['trials:read', 'trials:write', 'drugs:read', 'drugs:write', 'users:read'],
            },
            {
                ldapGroup: 'CN=TrialByte-Users,OU=Groups,DC=trialbyte,DC=com',
                applicationRole: 'user',
                permissions: ['trials:read', 'drugs:read'],
            },
            {
                ldapGroup: 'CN=TrialByte-ReadOnly,OU=Groups,DC=trialbyte,DC=com',
                applicationRole: 'readonly',
                permissions: ['trials:read'],
            },
        ],
    },
    security: {
        ssl: true,
        startTLS: false,
        tlsOptions: {
            ca: '/etc/ssl/ldap/ca.crt',
            cert: '/etc/ssl/ldap/client.crt',
            key: '/etc/ssl/ldap/client.key',
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
        },
        referrals: false,
        derefAliases: 'never',
    },
    caching: {
        enabled: true,
        userTTL: 300,
        groupTTL: 600,
        maxSize: 10000,
        negativeTTL: 60,
    },
};

export default ldapConfig;
