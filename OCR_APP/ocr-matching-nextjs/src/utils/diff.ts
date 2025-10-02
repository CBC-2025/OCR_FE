import { diffWords } from 'diff';

export const getDiff = (text1: string, text2: string) => {
    const differences = diffWords(text1, text2);
    return differences.map(part => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        return { value: part.value, color };
    });
};