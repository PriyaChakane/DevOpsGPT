export interface DockerScores {
  imageScore: number;
  securityScore: number;
  optimizationScore: number;
  estimatedImageSizeMb: number;
}

export interface DockerIssue {
  id: string;
  problem: string;
  impact: string;
  fix: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'optimization' | 'dependency' | 'best-practice';
}

export interface DockerAnalysisResult {
  scores: DockerScores;
  issues: DockerIssue[];
  layerSuggestions: string[];
  fixedDockerfileSnippet: string;
}
