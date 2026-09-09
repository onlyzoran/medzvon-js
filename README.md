# MedZvon - классификатор намерений из сырого STT

Детерминированный пайплайн на **JavaScript (ES modules)**, который по тексту от speech-to-text определяет намерение звонящего в медицинский колл-центр. Без внешних LLM/API. Сборка не требуется - запуск напрямую через Node.js.

## Документация

- [`docs/pipeline.md`](docs/pipeline.md) - Визуализация подхода
- [`docs/approach.md`](docs/approach.md) - Письменное рассуждение

---

## Намерения

| Intent | Описание | Примеры триггеров |
|--------|----------|-------------------|
| `BOOK` | Записаться на приём | записаться, врач, терапевт, приём |
| `CANCEL` | Отменить запись | отменить, отмена |
| `RESCHEDULE` | Перенести запись | перенести, вместо, другой день |
| `INFO` | Вопрос о цене / адресе / графике | сколько стоит, адрес, график |
| `OPERATOR` | Хочет живого человека | человек, оператор, робот |
| `COMPLAINT` | Жалоба | пожаловаться, безобразие, жду |
| `UNCLEAR` | Понять невозможно | шум, прощание, неоднозначность |

`UNCLEAR` - **валидный результат**, а не ошибка. Система честно переспрашивает, вместо того чтобы увести разговор не туда.

---

## Быстрый старт

```bash
npm install
npm test
npm run cli -- "хочу записаться к терапевту на завтра"
```

Пример ответа:

```json
{
  "intent": "BOOK",
  "confidence": 1,
  "reason": "matched_signals",
  "debug": {
    "tokens": ["хочу", "записаться", "к", "терапевту", "на", "завтра"],
    "scores": {
      "BOOK": 3.1,
      "CANCEL": 0,
      "RESCHEDULE": 0,
      "INFO": 0,
      "OPERATOR": 0,
      "COMPLAINT": 0
    }
  }
}
```

---

## Структура проекта

```
just-group-test-1/
├── src/
│   ├── index.js                # classifyIntent() - публичный API
│   ├── cli.js                  # CLI для ручной проверки
│   ├── types.js                # Intent, IntentResult, IntentScores
│   └── pipeline/
│       ├── normalize.js        # этап 1
│       ├── repairStt.js        # этап 2
│       ├── filterStopWords.js  # этап 3
│       ├── scoreIntents.js     # этап 4
│       └── decide.js           # этап 5
├── data/
│   └── intentPatterns.js       # словари, веса, пороги, STT-правила
├── tests/
│   └── examples.test.js        # 11 примеров брифа + edge cases
├── docs/
│   ├── pipeline.md             # краткая схема пайплайна
│   └── approach.md             # обоснование подхода
├── package.json
```
