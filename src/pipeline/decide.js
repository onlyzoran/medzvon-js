import {
    DECISION_THRESHOLDS
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
