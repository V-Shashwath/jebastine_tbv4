/**
 * GitLab CI/CD Configuration
 * TrialByte Clinical Trials Platform
 */

export interface GitLabCIConfig {
    stages: string[];
    image: string;
    variables: Record<string, string>;
}

const gitlabCIConfig: GitLabCIConfig = {
    stages: ['build', 'test', 'review', 'deploy'],
    image: 'node:20-alpine',
    variables: {
        CI_DEBUG_TRACE: 'false',
        KUBERNETES_MEMORY_LIMIT: '4Gi',
    },
};

export default gitlabCIConfig;
