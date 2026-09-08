import {
    HOMOPHONE_REPLACEMENTS,
    RESCHEDULE_CONTEXT_MARKERS,
    SPLIT_REPAIRS,
} from '../../data/intentPatterns.js';

function hasRescheduleContext(tokens) {
    return tokens.some((token) => RESCHEDULE_CONTEXT_MARKERS.has(token));
}

function repairSplitWords(tokens) {
    const result = [];
    let i = 0;

    while (i < tokens.length) {
        let merged = false;

        for (const repair of SPLIT_REPAIRS) {
            if (
                i + 1 < tokens.length &&
                tokens[i] === repair.prefix &&
                tokens[i + 1] === repair.suffix
            ) {
                result.push(repair.whole);
                i += 2;
                merged = true;
                break;
            }
        }

        if (!merged) {
            result.push(tokens[i]);
            i += 1;
        }
    }

    return result;
}

function repairHomophones(tokens) {
    const hasContext = hasRescheduleContext(tokens);

    return tokens.map((token) => {
        for (const rule of HOMOPHONE_REPLACEMENTS) {
            if (token === rule.wrong && (!rule.requiresContext || hasContext)) {
                return rule.correct;
            }
        }
        return token;
    });
}

export function repairStt(tokens) {
    const splitRepaired = repairSplitWords(tokens);
    return repairHomophones(splitRepaired);
}
