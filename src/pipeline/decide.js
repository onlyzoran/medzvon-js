import {
    DECISION_THRESHOLDS,
    FAREWELL_WORDS,
    GREETING_WORDS,
    KNOWN_VOCABULARY,
} from '../../data/intentPatterns.js';
import { Intent } from '../types.js';

const SCORABLE_INTENTS = [
    Intent.BOOK,
    Intent.CANCEL,
    Intent.RESCHEDULE,
    Intent.INFO,
    Intent.OPERATOR,
    Intent.COMPLAINT,
];

function isKnownOrFuzzyKnown(token) {
    if (KNOWN_VOCABULARY.has(token)) {
        return true;
    }

    for (const known of KNOWN_VOCABULARY) {
        if (known.length >= 4 && token.length >= 4) {
            const maxLenDiff = Math.abs(known.length - token.length);
            if (maxLenDiff <= 2) {
                let diff = 0;
                const minLen = Math.min(known.length, token.length);
                for (let i = 0; i < minLen; i += 1) {
                    if (known[i] !== token[i]) {
                        diff += 1;
                    }
                }
                diff += maxLenDiff;
                if (diff <= 2) {
                    return true;
                }
            }
        }
    }

    return false;
}

function isNoiseToken(token) {
    if (/^[ыаоуеэюяи]{3,}$/u.test(token) && !KNOWN_VOCABULARY.has(token)) {
        return true;
    }
    return false;
}

function isGibberish(tokens) {
    if (tokens.length === 0) {
        return true;
    }

    const unknownTokens = tokens.filter(
        (token) => !isKnownOrFuzzyKnown(token) || isNoiseToken(token)
    );
    return unknownTokens.length / tokens.length > DECISION_THRESHOLDS.gibberishUnknownRatio;
}

function isFarewellOnly(tokens) {
    if (tokens.length === 0) {
        return false;
    }

    return tokens.every(
        (token) =>
            FAREWELL_WORDS.has(token) ||
            GREETING_WORDS.has(token) ||
            token === 'до'
    );
}

function getRankedScores(scores) {
    return SCORABLE_INTENTS.map((intent) => ({ intent, score: scores[intent] }))
        .sort((a, b) => b.score - a.score);
}

function normalizeConfidence(topScore, totalScore) {
    if (totalScore <= 0) {
        return 0;
    }
    return Math.min(1, topScore / totalScore);
}

function hasMultipleStrongIntents(scores) {
    const strongCount = SCORABLE_INTENTS.filter((intent) => scores[intent] >= 2).length;
    return strongCount >= 2;
}

export function decide(tokens, scores) {
    const ranked = getRankedScores(scores);
    const [top, second] = ranked;
    const totalScore = ranked.reduce((sum, item) => sum + item.score, 0);

    if (tokens.length === 0) {
        return {
            intent: Intent.UNCLEAR,
            confidence: 0,
            reason: 'empty_input',
        };
    }

    if (isGibberish(tokens)) {
        return {
            intent: Intent.UNCLEAR,
            confidence: 0,
            reason: 'gibberish_or_noise',
        };
    }

    if (isFarewellOnly(tokens) && top.score === 0) {
        return {
            intent: Intent.UNCLEAR,
            confidence: 0,
            reason: 'farewell_without_intent',
        };
    }

    const confidence = normalizeConfidence(top.score, totalScore);

    if (top.score === 0 || confidence < DECISION_THRESHOLDS.minConfidence) {
        return {
            intent: Intent.UNCLEAR,
            confidence,
            reason: 'low_confidence',
        };
    }

    if (hasMultipleStrongIntents(scores)) {
        return {
            intent: Intent.UNCLEAR,
            confidence,
            reason: 'multiple_strong_intents',
        };
    }

    if (
        second.score > 0 &&
        top.score > 0 &&
        (top.score - second.score) / top.score < DECISION_THRESHOLDS.ambiguityGap
    ) {
        return {
            intent: Intent.UNCLEAR,
            confidence,
            reason: 'ambiguous_intent',
        };
    }

    return {
        intent: top.intent,
        confidence,
        reason: 'matched_signals',
    };
}
