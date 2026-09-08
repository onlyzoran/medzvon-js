import { STOP_WORDS } from '../../data/intentPatterns.js';

const KEEP_FOR_MATCHING = new Set([
    'не',
    'с',
    'со',
    'к',
    'а',
    'и',
    'за',
    'от',
    'пере',
    'по',
    'до',
    'на',
    'у',
    'в',
]);

export function filterStopWords(tokens) {
    return tokens.filter(
        (token) => KEEP_FOR_MATCHING.has(token) || !STOP_WORDS.has(token)
    );
}
