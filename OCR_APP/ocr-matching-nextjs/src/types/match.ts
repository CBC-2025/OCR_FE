export interface MatchResult {
    fieldName: string;
    sourceValue: string;
    targetValue: string;
    matchPercentage: number;
    status: 'GREEN' | 'YELLOW' | 'RED';
}

export interface MatchSummary {
    totalFields: number;
    matchedFields: number;
    unmatchedFields: number;
    matchResults: MatchResult[];
}