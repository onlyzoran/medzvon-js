import { distance } from 'fastest-levenshtein';
import {
    DECISION_THRESHOLDS,
    INTENT_PATTERNS,
} from '../../data/intentPatterns.js';
import { Intent } from '../types.js';

function createEmptyScores() {
    return {
        [Intent.BOOK]: 0,
        [Intent.CANCEL]: 0,
        [Intent.RESCHEDULE]: 0,
        [Intent.INFO]: 0,
        [Intent.OPERATOR]: 0,
        [Intent.COMPLAINT]: 0,
    };
}

function matchKeyword(token, keyword) {
    if (token === keyword) {
        return { matched: true, factor: 1 };
    }

    const minLength = Math.min(token.length, keyword.length);
    if (minLength < DECISION_THRESHOLDS.fuzzyMatchMinWordLength) {
        return { matched: false, factor: 0 };
    }

    const dist = distance(token, keyword);
    if (dist <= DECISION_THRESHOLDS.fuzzyMatchMaxDistance) {
        return { matched: true, factor: DECISION_THRESHOLDS.fuzzyWeightFactor };
    }

    return { matched: false, factor: 0 };
}

function phraseMatches(tokens, phrase) {
    if (phrase.length > tokens.length) {
        return false;
    }

    for (let i = 0; i <= tokens.length - phrase.length; i += 1) {
        let allMatch = true;
        for (let j = 0; j < phrase.length; j += 1) {
            const result = matchKeyword(tokens[i + j], phrase[j]);
            if (!result.matched) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) {
            return true;
        }
    }

    return false;
}

export function scoreIntents(tokens) {
    const scores = createEmptyScores();
    const tokenBestMatch = new Map();

    for (const [intentKey, pattern] of Object.entries(INTENT_PATTERNS)) {
        const intent = intentKey;
        tokenBestMatch.clear();

        for (const { word, weight } of pattern.keywords) {
            for (const token of tokens) {
                const { matched, factor } = matchKeyword(token, word);
                if (matched) {
                    const contribution = weight * factor;
                    const tokenBest = tokenBestMatch.get(`${intent}:${token}`) ?? 0;
                    if (contribution > tokenBest) {
                        tokenBestMatch.set(`${intent}:${token}`, contribution);
                    }
                }
            }
        }

        for (const [key, contribution] of tokenBestMatch.entries()) {
            if (key.startsWith(`${intent}:`)) {
                scores[intent] += contribution;
            }
        }

        for (const { phrase, weight } of pattern.phrases) {
            if (phraseMatches(tokens, phrase)) {
                scores[intent] += weight;
            }
        }
    }

    return scores;
}
