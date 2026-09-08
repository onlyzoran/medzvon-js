import { Intent } from '../src/types.js';

/** Заполнители речи — не несут намерения */
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
  'перенести',
  'перенос',
  'понедельник',
  'вторник',
  'среда',
  'среду',
  'четверг',
  'четверга',
  'пятница',
  'пятницу',
  'суббота',
  'субботу',
  'воскресенье',
  'завтра',
  'послезавтра',
  'другой',
  'другую',
  'день',
  'дата',
  'время',
]);

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

export const GREETING_WORDS = new Set([
  'здравствуйте',
  'здравствуй',
  'привет',
  'добрый',
  'день',
  'утро',
  'вечер',
  'алло',
  'ало',
  'алё',
]);

export const INTENT_PATTERNS = {
  [Intent.BOOK]: {
    keywords: [
      { word: 'записаться', weight: 1.0 },
      { word: 'записать', weight: 0.9 },
      { word: 'запись', weight: 0.4 },
      { word: 'прием', weight: 0.35 },
      { word: 'приема', weight: 0.3 },
      { word: 'врач', weight: 0.5 },
      { word: 'врачу', weight: 0.5 },
      { word: 'доктор', weight: 0.5 },
      { word: 'доктору', weight: 0.5 },
      { word: 'терапевт', weight: 0.6 },
      { word: 'терапевту', weight: 0.6 },
      { word: 'кардиолог', weight: 0.5 },
      { word: 'кардиологу', weight: 0.5 },
      { word: 'лор', weight: 0.5 },
      { word: 'лора', weight: 0.5 },
      { word: 'хочу', weight: 0.3 },
      { word: 'нужно', weight: 0.3 },
      { word: 'можно', weight: 0.3 },
    ],
    phrases: [
      { phrase: ['хочу', 'записаться'], weight: 1.2 },
      { phrase: ['нужно', 'записаться'], weight: 1.1 },
      { phrase: ['запись', 'к', 'врачу'], weight: 0.9 },
    ],
  },
  [Intent.CANCEL]: {
    keywords: [
      { word: 'отменить', weight: 1.0 },
      { word: 'отмена', weight: 1.0 },
      { word: 'отмену', weight: 1.0 },
      { word: 'отменяю', weight: 0.9 },
      { word: 'отмените', weight: 0.9 },
      { word: 'аннулировать', weight: 0.9 },
      { word: 'запись', weight: 0.5 },
      { word: 'записи', weight: 0.4 },
    ],
    phrases: [
      { phrase: ['отменить', 'запись'], weight: 1.3 },
      { phrase: ['отмена', 'записи'], weight: 1.2 },
    ],
  }
};

/** Общий словарь для детекции gibberish */
export function buildKnownVocabulary() {
  const vocab = new Set([
    ...STOP_WORDS,
    ...GREETING_WORDS,
    ...FAREWELL_WORDS,
    ...RESCHEDULE_CONTEXT_MARKERS,
    'хочу',
    'нужно',
    'скажите',
    'сказать',
    'могу',
    'можно',
    'на',
    'завтра',
    'пятницу',
    'пятница',
    'вторник',
    'среду',
    'среда',
    'четверг',
    'четверга',
    'час',
    'линии',
    'линия',
    'с',
    'а',
    'не',
  ]);

  for (const pattern of Object.values(INTENT_PATTERNS)) {
    for (const { word } of pattern.keywords) {
      vocab.add(word);
    }
    for (const { phrase } of pattern.phrases) {
      for (const token of phrase) {
        vocab.add(token);
      }
    }
  }

  for (const repair of SPLIT_REPAIRS) {
    vocab.add(repair.prefix);
    vocab.add(repair.suffix);
    vocab.add(repair.whole);
  }

  return vocab;
}

export const KNOWN_VOCABULARY = buildKnownVocabulary();

export const DECISION_THRESHOLDS = {
  minConfidence: 0.35,
  ambiguityGap: 0.15,
  gibberishUnknownRatio: 0.5,
  fuzzyMatchMaxDistance: 2,
  fuzzyMatchMinWordLength: 4,
  fuzzyWeightFactor: 0.7,
};
