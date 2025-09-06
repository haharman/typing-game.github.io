/* data.js: Locale map for words and UI strings. Enables simple internationalization.
   Key decisions: keep data minimal and structured per-locale for zero-build environments. */

export const LOCALES = {
  en: {
    words: {
      easy: ['cat', 'dog', 'sun', 'moon', 'tree', 'sky', 'ai', 'ka', 'neko', 'inu', 'sora', 'hana'],
      medium: ['orange', 'guitar', 'sushi', 'ramen', 'kawaii', 'tokyo', 'sakura', 'sensei', 'samurai', 'river'],
      hard: ['javascript', 'responsibility', 'extraordinary', 'konnichiwa', 'arigatou', 'mountain', 'computer', 'keyboard', 'nihongo', 'generation']
    },
    ui: {
      title: 'Typing Sprint',
      description: 'Type the word shown and press space or enter to submit. You have 60 seconds to score as many points as possible.',
      start: 'Start',
      practice: 'Practice',
      restart: 'Restart',
      exit: 'Exit',
      stats: {
        time: 's',
        score: 'pts',
        wpm: 'WPM',
        accuracy: '%',
        combo: 'x',
        highScore: 'HS:',
        streak: 'x'
      }
    }
  },
  ja: {
    words: {
      easy: ['ねこ', 'いぬ', 'そら', 'はな'],
      medium: ['さくら', 'すし', 'らーめん'],
      hard: ['こんにちは', 'ありがとう', 'パソコン']
    },
    ui: {
      title: 'タイピングスプリント',
      description: '表示された単語を入力し、スペースまたはエンターで送信します。60秒でできるだけ多く入力しましょう。',
      start: 'スタート',
      practice: '練習',
      restart: 'リスタート',
      exit: '終了',
      stats: {
        time: '秒',
        score: '点',
        wpm: 'WPM',
        accuracy: '%',
        combo: '連',
        highScore: '最高:',
        streak: '連'
      }
    }
  }
};

export const DEFAULT_LOCALE = 'en';
