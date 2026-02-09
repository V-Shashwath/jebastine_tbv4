/**
 * CircleCI Configuration
 * TrialByte Clinical Trials Platform
 */

export interface CircleCIConfig {
    version: number;
    jobs: string[];
    workflows: string[];
}

const circleCIConfig: CircleCIConfig = {
    version: 2.1,
    jobs: ['build_and_test', 'deploy_staging', 'hold', 'deploy_production'],
    workflows: ['trialbyte_flow'],
};

export default circleCIConfig;
