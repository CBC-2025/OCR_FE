// This file defines and exports common types used in the application.

export interface OCRResult {
    field: string;
    extractedText: string;
    originalText: string;
    matchPercentage: number;
}

export interface MatchResult {
    field: string;
    status: 'match' | 'partial' | 'mismatch';
}

// New types for API integration
export interface PersonInfo {
    ho_ten: string;
    cccd: string;
}

export interface DocumentData {
    nguoi_mua: PersonInfo[];
    dia_chi_mua: string;
    so_thua: string;
    to_ban_do: string;
    dien_tich: string;
    loai_dat: string;
    tai_san_gan_voi_dat: string;
}

export interface HopDongData extends DocumentData {
    nguoi_ban: PersonInfo[];
    dia_chi_ban: string;
}

export interface ExtractedData {
    phieuchuyen: DocumentData;
    hopdong: HopDongData;
}

export interface ComparisonItem {
    phieuchuyen: string;
    hopdong: string;
    similarity: number;
}

export interface ComparisonResult {
    [key: string]: ComparisonItem;
}