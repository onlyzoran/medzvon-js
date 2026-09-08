import { Intent } from '../src/types.js';

export const STOP_PHRASES = ['это самое', 'типа того', 'как бы'];

export const STOP_WORDS = new Set([
  'ну',
  'вот',
  'типа',
  'наверное',
  'наверно',
  'короче',
  'значит',
  'мне',
  'меня',
  'мной',
  'я',
  'вы',
  'мой',
  'моя',
  'мое',
  'мои',
  'это',
  'тот',
  'та',
  'те',
  'так',
  'же',
  'ли',
  'бы',
  'а',
  'и',
  'но',
  'не',
  'ни',
  'на',
  'в',
  'к',
  'у',
  'с',
  'со',
  'из',
  'по',
  'за',
  'до',
  'от',
  'для',
  'про',
  'о',
  'об',
  'то',
  'что',
  'как',
  'где',
  'когда',
  'или',
  'ещё',
  'еще',
  'уже',
  'very',
  'the',
]);

export const SPLIT_REPAIRS = [
  { prefix: 'за', suffix: 'писаться', whole: 'записаться' },
  { prefix: 'за', suffix: 'писать', whole: 'записать' },
  { prefix: 'пере', suffix: 'нести', whole: 'перенести' },
  { prefix: 'пере', suffix: 'нос', whole: 'перенос' },
  { prefix: 'от', suffix: 'менить', whole: 'отменить' },
  { prefix: 'от', suffix: 'мена', whole: 'отмена' },
  { prefix: 'по', suffix: 'жаловаться', whole: 'пожаловаться' },
];

export const RESCHEDULE_CONTEXT_MARKERS = new Set([
  'запись',
  'записи',
  'записью',
  'вместо',
  'пятница',
  'субботу',
  'другой',
  'другую',
  'день',
  'дата',
  'время',
]);

export const INTENT_PATTERNS = {
  [Intent.BOOK]: {
    keywords: [
      { word: 'записаться', weight: 1.0 },
      { word: 'можно', weight: 0.3 },
    ],
    phrases: [
      { phrase: ['хочу', 'записаться'], weight: 1.0 },
    ],
  }
};

export const HOMOPHONE_REPLACEMENTS = [
  { wrong: 'принести', correct: 'перенести', requiresContext: true },
];

export const FAREWELL_WORDS = new Set([
  'спасибо',
  'благодарю',
  'до',
  'свидания',
  'свидание',
  'пока',
  'досвидания',
]);

export const DECISION_THRESHOLDS = {
  minConfidence: 0.35,
  ambiguityGap: 0.15,
  gibberishUnknownRatio: 0.5,
  fuzzyMatchMaxDistance: 2,
  fuzzyMatchMinWordLength: 4,
  fuzzyWeightFactor: 0.7,
};
