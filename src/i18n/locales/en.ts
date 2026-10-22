const en = {
  common: {
    back: 'Back',
    backMenu: 'Back to menu',
    appName: 'Mind Flip',
  },

  menu: {
    subtitle: 'Set up your game',
    sections: {
      grid:      'Board size',
      mode:      'Game mode',
      timeLimit: 'Time limit',
      movesLimit:'Move limit',
      modifiers: 'Modifiers',
    },
    modes: {
      classic:      { label: 'Classic',    desc: 'No limits' },
      timeAttack:   { label: 'Time Attack', desc: 'Win before the clock runs out' },
      limitedMoves: { label: 'Moves',       desc: 'Limited number of attempts' },
    },
    modifiers: {
      shuffle: {
        label: 'The Shuffle',
        desc:  'After 5 consecutive failures, unmatched cards are shuffled',
      },
      scoring: {
        label: 'Play for points',
        desc:  'Enables the scoring system and combos',
      },
    },
    movesHint:         'Minimum: {{min}} moves · Suggestions based on board size',
    movesError:        'Minimum {{min}} moves (perfect game)',
    customPlaceholder: 'Custom',
    startButton:       'Start game!',
    rankingLink:       'View score ranking',
    footer: {
      tagline: 'No ads · No tracking · Data stays on your device',
      help:    'Help',
      legal:   'Terms & Privacy',
    },
  },

  game: {
    moves:     'Moves: {{count}}',
    exit:      'Exit',
    shuffling: 'Shuffling!',
    timeUp: {
      title:    'Good try!',
      subtitle: 'You ran out of time',
    },
    movesUp: {
      title:    'Good try!',
      subtitle: 'You ran out of moves',
    },
  },

  confetti: {
    win:              'You won!',
    justInTime:       'Just in Time!',
    justInTimeSub:    'You nailed it on the very last move!',
    move_one:         '{{count}} move',
    move_other:       '{{count}} moves',
    scoreLabel:       'Score',
    namePlaceholder:  'Your name...',
    saveButton:       'Save',
    saved:            '✓ Saved to ranking',
    backButton:       'Back to menu',
  },

  combo: {
    first: 'COMBO!',
    nth:   'COMBO x{{n}}!',
  },

  ranking: {
    title:    'Ranking',
    subtitle: 'Top 10 by mode and board',
    modes: {
      classic:      'Classic',
      timeAttack:   'Time Attack',
      limitedMoves: 'Moves',
    },
    rowMeta:  '{{moves}} moves · combo ×{{combo}}',
    empty: {
      title: 'No scores yet',
      desc:  'Enable "Play for points" in the menu and be the first on the ranking.',
    },
    webUnavailable: {
      title: 'Device only',
      desc:  'The ranking requires local storage. Open the app on iOS or Android to view and save scores.',
    },
  },

  help: {
    title:    'Help',
    subtitle: 'How to play and score',
    sections: {
      basics: {
        title: 'How to play',
        p1: 'Flip cards looking for identical pairs. When you find two matching cards, they stay face up permanently. You win when all pairs on the board are discovered.',
        p2: 'If you flip two cards that do not match, both are turned back over. Try to memorize their positions to avoid repeating mistakes.',
      },
      grids: {
        title: 'Board sizes',
        r1: { label: '4 × 4',  value: '16 cards · 8 pairs' },
        r2: { label: '6 × 4',  value: '24 cards · 12 pairs' },
        r3: { label: '6 × 6',  value: '36 cards · 18 pairs' },
        note: 'The larger the board, the harder the challenge — and the higher the base score when playing for points.',
      },
      modes: {
        title: 'Game modes',
        r1: { label: '🎯 Classic',     value: 'No limits. Play at your own pace.' },
        r2: { label: '⏱ Time Attack',  value: 'Find all pairs before time runs out. Choose 2, 5 or 10 minutes.' },
        r3: { label: '🃏 Moves',        value: 'You have a fixed number of attempts. Flipping two cards counts as one move.' },
        tip: 'In Moves mode: if you win using exactly the last available move, you earn the special 🎯 "Just in Time!" medal.',
      },
      modifiers: {
        title: 'Modifiers',
        r1: { label: '🔀 The Shuffle',      value: 'After 5 consecutive failures, unmatched cards are randomly reshuffled. Keeps the game challenging.' },
        r2: { label: '⭐ Play for points', value: 'Enables the scoring system and combos. Without this modifier, no score is generated.' },
        note: 'Both modifiers are independent and can be combined.',
      },
      combos: {
        title: 'Combos',
        intro: 'A combo activates when you find correct pairs consecutively without any mistake in between.',
        r1: { label: '2 pairs in a row', value: 'COMBO!' },
        r2: { label: '3 pairs in a row', value: 'COMBO ×2!' },
        r3: { label: '4 pairs in a row', value: 'COMBO ×3!' },
        note: 'Each combo level adds 10% to your final score. A mistake resets the combo counter.',
      },
      score: {
        title: 'Scoring system',
        intro: 'Your final score is calculated with this formula:',
        f1: { symbol: 'Base',         desc: '4×4 = 1,000 · 6×4 = 1,500 · 6×6 = 2,500' },
        f2: { symbol: '× Efficiency', desc: 'Minimum moves ÷ moves used. Perfect game = ×1.0' },
        f3: { symbol: '× Mode',       desc: 'In Time Attack and Moves: up to +50% for remaining time/moves' },
        f4: { symbol: '× Shuffle',    desc: '+30% if The Shuffle was active (×1.3)' },
        f5: { symbol: '× Combo',      desc: '+10% for each combo level reached' },
        tip: 'For the highest score: 6×6 board, Moves mode with the minimum attempts, The Shuffle enabled, and a long combo streak.',
      },
      ranking: {
        title: 'Ranking',
        p1:   'The ranking saves the top 10 scores per mode and board size combination, directly on your device.',
        p2:   'After finishing a scored game you can enter a nickname (real or made-up) to record your result.',
        tip:  'The ranking is only available on a physical device (iOS / Android). It is not synced to the cloud.',
      },
    },
  },

  legal: {
    title:     'Terms & Privacy',
    updatedAt: 'October 21, 2026',
    privacy: {
      heading:    'Privacy Policy',
      updated:    'Last updated: {{date}}',
      s1h: 'Data controller',
      s1b: '{{name}} — {{email}}',
      s2h: 'What data is stored',
      s2b: '{{app}} only saves on your device the nickname you voluntarily enter when recording a score, and the result obtained in each game. That nickname can be real or fictitious; we do not require or verify that it corresponds to an identifiable person.',
      s3h: 'Where it is stored',
      s3b: 'All data is stored exclusively in the local database on your device (SQLite). There is no server, cloud, or external database associated with this application. No information leaves your phone.',
      s4h: 'Who it is shared with',
      s4b: 'No one. We do not sell, transfer, or transmit your data to third parties, advertisers, or any other service.',
      s5h: 'Advertising and tracking',
      s5b: '{{app}} contains no advertising of any kind and does not use any tracking, analytics, or behavioral monitoring tools (no Firebase, no AdMob, no cookies, no device identifiers).',
      s6h: 'Your rights (Chilean Law 19.628)',
      s6b: 'In accordance with Chilean Law No. 19.628 on the Protection of Private Life and Law No. 21.719, you have the right to access, rectify, delete, and oppose the processing of your data. Since all information resides on your own device, you can exercise these rights directly: delete the app data from your phone settings or uninstall the application. For any additional inquiries, contact us at {{email}}.',
    },
    terms: {
      heading: 'Terms of Use',
      updated: 'Last updated: {{date}}',
      s1h: 'Acceptance',
      s1b: 'By downloading or using {{app}} you accept these Terms of Use. If you do not agree, do not use the application.',
      s2h: 'License',
      s2b: 'You are granted a personal, non-transferable, non-exclusive license to use {{app}} solely for personal entertainment purposes. Modifying, decompiling, disassembling, redistributing, or commercializing the application or any part of it is prohibited.',
      s3h: 'No warranties',
      s3b: '{{app}} is provided "as is" without warranties of any kind, express or implied. We do not guarantee continuous availability, freedom from errors, or specific results from use of the app.',
      s4h: 'Limitation of liability',
      s4b: 'To the fullest extent permitted by Chilean law, {{name}} shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the application.',
      s5h: 'Modifications',
      s5b: 'We may update these terms at any time. The current version will always be available within the app. Continued use of {{app}} after an update implies acceptance of the new terms.',
      s6h: 'Governing law and jurisdiction',
      s6b: 'These terms are governed by the laws of the Republic of Chile. Any dispute shall be submitted to the competent ordinary courts of justice of Chile.',
      s7h: 'Contact',
      s7b: '{{email}}',
    },
    copyright: '© {{year}} {{name}} · {{app}}',
  },
} as const;

export default en;
