import { normalize } from './pipeline/normalize.js';
import { filterStopWords } from './pipeline/filterStopWords.js';
import { repairStt } from './pipeline/repairStt.js';
import { scoreIntents } from './pipeline/scoreIntents.js';
import { decide } from './pipeline/decide.js';

export { Intent } from './types.js';

export function classifyIntent(rawText, options = {}) {
    const normalized = normalize(rawText);
    const repairedTokens = repairStt(normalized.tokens);
    const tokens = filterStopWords(repairedTokens);
    const scores = scoreIntents(tokens);
    const result = decide(tokens, scores);

    if (options.debug) {
        return {
            ...result,
            debug: {
                tokens,
                scores,
            },
        };
    }

    return result;
}
