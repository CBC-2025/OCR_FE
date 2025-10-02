export const formatJobStatus = (status: string): string => {
    switch (status) {
        case 'completed':
            return '🟩 XANH';
        case 'in_progress':
            return '🟨 VÀNG';
        case 'failed':
            return '🟥 ĐỎ';
        default:
            return '🔄 ĐANG XỬ LÝ';
    }
};

export const getStatus = (matchPercentage: number): 'match' | 'partial' | 'mismatch' => {
    if (matchPercentage >= 100) return 'match';
    if (matchPercentage >= 85) return 'partial';
    return 'mismatch';
};

export const formatFieldComparison = (field: string, original: string, extracted: string): string => {
    return `${field}: ${original} vs ${extracted}`;
};

export const formatProgressPercentage = (completed: number, total: number): string => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return `${percentage.toFixed(2)}%`;
};