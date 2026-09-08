import { STOP_PHRASES } from '../../data/intentPatterns.js';

function removePunctuation(text) {
    return text.replace(/[^\p{L}\p{N}\s-]/gu, ' ');
}

export function normalize(rawText) {
    let text = rawText.toLowerCase().trim();
    text = text.replace(/ё/g, 'е');
    text = removePunctuation(text);
    text = text.replace(/\s+/g, ' ');

    for (const phrase of STOP_PHRASES) {
        text = text.replace(new RegExp(`\\b${phrase}\\b`, 'g'), ' ');
    }

    text = text.replace(/\s+/g, ' ').trim();

    const tokens = text
        .split(/\s+/)
        .filter((token) => token.length > 0);

    return {
        original: rawText,
        tokens,
    };
}
