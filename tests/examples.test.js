import { describe, expect, it } from 'vitest';
import { classifyIntent, Intent } from '../src/index.js';

const BRIEF_EXAMPLES = [
  {
    text: 'здравствуйте хочу записаться к терапевту на завтра',
    intent: Intent.BOOK,
  },
  {
    text: 'мне нужно отменить запись на пятницу',
    intent: Intent.CANCEL,
  },
  {
    text: 'скажите сколько стоит приём кардиолога',
    intent: Intent.INFO,
  },
  {
    text: 'это безобразие я час жду на линии хочу пожаловаться',
    intent: Intent.COMPLAINT,
  },
  {
    text: 'хочу за писаться к врачу на вторник',
    intent: Intent.BOOK,
  },
  {
    text: 'мне ну это самое отменить наверное запись',
    intent: Intent.CANCEL,
  },
  {
    text: 'скока стоит прием у лора',
    intent: Intent.INFO,
  },
  {
    text: 'хочу с человеком поговорить а не с роботом',
    intent: Intent.OPERATOR,
  },
  {
    text: 'принести запись на среду вместо четверга',
    intent: Intent.RESCHEDULE,
  },
  {
    text: 'ыаыы ало алё',
    intent: Intent.UNCLEAR,
  },
  {
    text: 'спасибо до свидания',
    intent: Intent.UNCLEAR,
  },
];

describe('brief examples', () => {
  it.each(BRIEF_EXAMPLES)('classifies "$text" as $intent', ({ text, intent }) => {
    const result = classifyIntent(text, { debug: true });
    expect(result.intent).toBe(intent);
  });
});

describe('edge cases', () => {
  it('returns UNCLEAR for empty input', () => {
    expect(classifyIntent('').intent).toBe(Intent.UNCLEAR);
  });

  it('returns UNCLEAR for whitespace-only input', () => {
    expect(classifyIntent('   ').intent).toBe(Intent.UNCLEAR);
  });

  it('returns UNCLEAR for mixed competing intents', () => {
    const result = classifyIntent(
      'хочу записаться и узнать сколько стоит приём'
    );
    expect(result.intent).toBe(Intent.UNCLEAR);
  });

  it('returns UNCLEAR for off-topic text', () => {
    expect(classifyIntent('какая сегодня погода').intent).toBe(Intent.UNCLEAR);
  });
});
