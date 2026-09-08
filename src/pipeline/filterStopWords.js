import { STOP_WORDS } from '../../data/intentPatterns.js';

const KEEP_FOR_MATCHING = new Set([
    'с',
    'со',
    'к',
    'а',
    'на',
    'у',
    'в',
]);

export function filterStopWords(tokens) {
    return tokens.filter(
        (token) => KEEP_FOR_MATCHING.has(token) || !STOP_WORDS.has(token)
    );
}
