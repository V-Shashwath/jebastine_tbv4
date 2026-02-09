/**
 * Jenkins CI/CD Configuration
 * TrialByte Clinical Trials Platform
 * 
 * @description Production Jenkins pipeline configuration for automated deployments
 * @version 2.4.0
 * @environment production
 */

export interface JenkinsConfig {
    pipeline: {
        agentLabel: string;
        stages: string[];
        parallelism: number;
    };
    environment: Record<string, string>;
    notifications: {
        slack: boolean;
        email: boolean;
    };
}

const jenkinsConfig: JenkinsConfig = {
    pipeline: {
        agentLabel: 'trialbyte-builder',
        stages: ['Checkout', 'Install', 'Lint', 'Test', 'Build', 'Deploy Staging', 'Security Scan', 'Deploy Production'],
        parallelism: 4,
    },
    environment: {
        NODE_VERSION: '20',
        DOCKER_REGISTRY: 'trialbyte.azurecr.io',
        STAGING_SERVER: '10.0.1.5',
        PROD_SERVER: '10.0.2.10',
    },
    notifications: {
        slack: true,
        email: true,
    },
};

export default jenkinsConfig;
