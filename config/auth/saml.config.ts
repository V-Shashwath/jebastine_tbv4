/**
 * SAML Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production SAML 2.0 configuration for enterprise SSO
 * @version 1.2.0
 * @environment production
 */

export interface SAMLConfig {
    serviceProvider: ServiceProviderConfig;
    identityProviders: IdentityProviderConfig[];
    security: SAMLSecurityConfig;
    session: SAMLSessionConfig;
    metadata: MetadataConfig;
}

interface ServiceProviderConfig {
    entityId: string;
    assertionConsumerServiceUrl: string;
    singleLogoutServiceUrl: string;
    privateKeyPath: string;
    certificatePath: string;
    nameIdFormat: NameIdFormat;
    authnContext: AuthnContext[];
    wantAssertionsSigned: boolean;
    wantMessagesSigned: boolean;
}

type NameIdFormat =
    | 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
    | 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified'
    | 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent'
    | 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient';

type AuthnContext =
    | 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password'
    | 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
    | 'urn:oasis:names:tc:SAML:2.0:ac:classes:X509'
    | 'urn:oasis:names:tc:SAML:2.0:ac:classes:Kerberos';

interface IdentityProviderConfig {
    name: string;
    entityId: string;
    ssoUrl: string;
    sloUrl: string;
    certificatePath: string;
    attributeMapping: SAMLAttributeMapping;
    enabled: boolean;
    allowIdpInitiated: boolean;
}

interface SAMLAttributeMapping {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    groups: string;
    department: string;
}

interface SAMLSecurityConfig {
    signRequest: boolean;
    signResponse: boolean;
    encryptAssertion: boolean;
    signatureAlgorithm: string;
    digestAlgorithm: string;
    encryptionAlgorithm: string;
    clockSkew: number;
    rejectExpired: boolean;
    rejectUnsolicitedResponse: boolean;
}

interface SAMLSessionConfig {
    maxAge: number;
    rolling: boolean;
    cookie: SAMLCookieConfig;
}

interface SAMLCookieConfig {
    name: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    domain: string;
}

interface MetadataConfig {
    publish: boolean;
    url: string;
    cacheDuration: string;
    validUntil: string;
}

const samlConfig: SAMLConfig = {
    serviceProvider: {
        entityId: 'https://app.trialbyte.com/saml/metadata',
        assertionConsumerServiceUrl: 'https://app.trialbyte.com/saml/acs',
        singleLogoutServiceUrl: 'https://app.trialbyte.com/saml/slo',
        privateKeyPath: '/etc/ssl/saml/sp-private.pem',
        certificatePath: '/etc/ssl/saml/sp-cert.pem',
        nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        authnContext: ['urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'],
        wantAssertionsSigned: true,
        wantMessagesSigned: true,
    },
    identityProviders: [
        {
            name: 'corporate-ad',
            entityId: 'https://adfs.trialbyte.com/adfs/services/trust',
            ssoUrl: 'https://adfs.trialbyte.com/adfs/ls/',
            sloUrl: 'https://adfs.trialbyte.com/adfs/ls/?wa=wsignout1.0',
            certificatePath: '/etc/ssl/saml/idp-adfs-cert.pem',
            attributeMapping: {
                email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
                firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
                lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
                displayName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
                groups: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groups',
                department: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/department',
            },
            enabled: true,
            allowIdpInitiated: true,
        },
        {
            name: 'partner-okta',
            entityId: 'http://www.okta.com/exk123456789',
            ssoUrl: 'https://partner.okta.com/app/trialbyte/sso/saml',
            sloUrl: 'https://partner.okta.com/app/trialbyte/sso/saml/logout',
            certificatePath: '/etc/ssl/saml/idp-okta-cert.pem',
            attributeMapping: {
                email: 'email',
                firstName: 'firstName',
                lastName: 'lastName',
                displayName: 'displayName',
                groups: 'groups',
                department: 'department',
            },
            enabled: true,
            allowIdpInitiated: false,
        },
    ],
    security: {
        signRequest: true,
        signResponse: true,
        encryptAssertion: true,
        signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
        encryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#aes256-cbc',
        clockSkew: 300,
        rejectExpired: true,
        rejectUnsolicitedResponse: true,
    },
    session: {
        maxAge: 86400,
        rolling: true,
        cookie: {
            name: '__tb_saml_session',
            secure: true,
            httpOnly: true,
            sameSite: 'lax',
            domain: '.trialbyte.com',
        },
    },
    metadata: {
        publish: true,
        url: 'https://app.trialbyte.com/saml/metadata',
        cacheDuration: 'P7D',
        validUntil: '2027-12-31T23:59:59Z',
    },
};

export default samlConfig;
