const es = {
  common: {
    back: 'Volver',
    backMenu: 'Volver al menú',
    appName: 'Mind Flip',
  },

  menu: {
    subtitle: 'Configura tu partida',
    sections: {
      grid:      'Tamaño del tablero',
      mode:      'Modo de juego',
      timeLimit: 'Tiempo límite',
      movesLimit:'Límite de movimientos',
      modifiers: 'Modificadores',
    },
    modes: {
      classic:      { label: 'Clásico',     desc: 'Sin límites' },
      timeAttack:   { label: 'Contrareloj', desc: 'Gana antes de que acabe el tiempo' },
      limitedMoves: { label: 'Movimientos', desc: 'Número de intentos limitado' },
    },
    modifiers: {
      shuffle: {
        label: 'La Revuelta',
        desc:  'Tras 5 fallos seguidos, las cartas sin descubrir se barajan',
      },
      scoring: {
        label: 'Jugar con puntos',
        desc:  'Activa el sistema de puntuación y combos',
      },
    },
    movesHint:         'Mínimo: {{min}} mov · Sugerencias basadas en el tablero',
    movesError:        'Mínimo {{min}} movimientos (juego perfecto)',
    customPlaceholder: 'Custom',
    startButton:       '¡Comenzar partida!',
    rankingLink:       'Ver ranking de puntajes',
    footer: {
      tagline: 'Sin publicidad · Sin rastreo · Datos solo en tu dispositivo',
      help:    'Ayuda',
      legal:   'Términos y Privacidad',
    },
  },

  game: {
    moves:     'Movimientos: {{count}}',
    exit:      'Salir',
    shuffling: '¡Revolviendo!',
    timeUp: {
      title:    '¡Buen intento!',
      subtitle: 'Se te acabó el tiempo',
    },
    movesUp: {
      title:    '¡Buen intento!',
      subtitle: 'Te quedaste sin movimientos',
    },
  },

  confetti: {
    win:              '¡Ganaste!',
    justInTime:       '¡Justo al Movimiento!',
    justInTimeSub:    '¡Exacto con el último movimiento!',
    move_one:         '{{count}} movimiento',
    move_other:       '{{count}} movimientos',
    scoreLabel:       'Puntaje',
    namePlaceholder:  'Tu nombre...',
    saveButton:       'Guardar',
    saved:            '✓ Guardado en el ranking',
    backButton:       'Volver al menú',
  },

  combo: {
    first: '¡COMBO!',
    nth:   '¡COMBO x{{n}}!',
  },

  ranking: {
    title:    'Ranking',
    subtitle: 'Top 10 por modo y tablero',
    modes: {
      classic:      'Clásico',
      timeAttack:   'Contrareloj',
      limitedMoves: 'Movimientos',
    },
    rowMeta:  '{{moves}} mov · combo ×{{combo}}',
    empty: {
      title: 'Sin puntajes aún',
      desc:  "Activa \"Jugar con puntos\" en el menú y sé el primero en el ranking.",
    },
    webUnavailable: {
      title: 'Solo en dispositivo',
      desc:  'El ranking requiere almacenamiento local. Abre la app en iOS o Android para ver y guardar puntajes.',
    },
  },

  help: {
    title:    'Ayuda',
    subtitle: 'Cómo jugar y puntuar',
    sections: {
      basics: {
        title: '¿Cómo se juega?',
        p1: 'Voltea cartas buscando pares idénticos. Cuando encuentras dos cartas iguales, quedan descubiertas permanentemente. Ganas cuando descubres todos los pares del tablero.',
        p2: 'Si volteas dos cartas que no coinciden, ambas se dan vuelta de nuevo. Intenta memorizar su posición para no repetir errores.',
      },
      grids: {
        title: 'Tamaños de tablero',
        r1: { label: '4 × 4',  value: '16 cartas · 8 pares' },
        r2: { label: '6 × 4',  value: '24 cartas · 12 pares' },
        r3: { label: '6 × 6',  value: '36 cartas · 18 pares' },
        note: 'El tablero más grande ofrece mayor dificultad y más puntos base si juegas con el sistema de puntaje.',
      },
      modes: {
        title: 'Modos de juego',
        r1: { label: '🎯 Clásico',     value: 'Sin límites. Juega a tu ritmo.' },
        r2: { label: '⏱ Contrareloj',  value: 'Descubre todos los pares antes de que el tiempo se agote. Puedes elegir 2, 5 o 10 minutos.' },
        r3: { label: '🃏 Movimientos',  value: 'Tienes un número fijo de intentos. Voltear dos cartas cuenta como un movimiento.' },
        tip: 'En modo Movimientos: si ganas usando exactamente el último movimiento disponible obtienes la medalla especial 🎯 "¡Justo al Movimiento!"',
      },
      modifiers: {
        title: 'Modificadores',
        r1: { label: '🔀 La Revuelta',      value: 'Tras 5 fallos consecutivos, las cartas no descubiertas se barajan aleatoriamente. Mantiene el juego desafiante.' },
        r2: { label: '⭐ Jugar con puntos', value: 'Activa el sistema de puntaje y los combos. Sin este modificador la partida no genera puntuación.' },
        note: 'Ambos modificadores son independientes y se pueden combinar.',
      },
      combos: {
        title: 'Combos',
        intro: 'Un combo se activa cuando encuentras pares correctos de forma consecutiva sin ningún fallo en el medio.',
        r1: { label: '2 pares seguidos',  value: '¡COMBO!' },
        r2: { label: '3 pares seguidos',  value: '¡COMBO ×2!' },
        r3: { label: '4 pares seguidos',  value: '¡COMBO ×3!' },
        note: 'Cada nivel de combo suma un 10% adicional a tu puntaje final. Un fallo reinicia el contador de combo.',
      },
      score: {
        title: 'Sistema de puntaje',
        intro: 'El puntaje final se calcula con esta fórmula:',
        f1: { symbol: 'Base',         desc: '4×4 = 1.000 · 6×4 = 1.500 · 6×6 = 2.500' },
        f2: { symbol: '× Eficiencia', desc: 'Movimientos mínimos ÷ movimientos usados. Jugar perfecto = ×1.0' },
        f3: { symbol: '× Modo',       desc: 'En Contrareloj y Movimientos: hasta +50% por tiempo/movimientos restantes' },
        f4: { symbol: '× Revuelta',   desc: '+30% si La Revuelta estaba activa (×1.3)' },
        f5: { symbol: '× Combo',      desc: '+10% por cada nivel de combo máximo alcanzado' },
        tip: 'Para el máximo puntaje: tablero 6×6, modo Movimientos con el mínimo de intentos, La Revuelta activada y una racha de combos larga.',
      },
      ranking: {
        title: 'Ranking',
        p1:   'El ranking guarda los 10 mejores puntajes por combinación de modo y tamaño de tablero, directamente en tu dispositivo.',
        p2:   'Al terminar una partida con puntaje activado puedes ingresar un apodo (real o ficticio) para registrar tu resultado.',
        tip:  'El ranking está disponible solo en dispositivo físico (iOS / Android). No está sincronizado en la nube.',
      },
    },
  },

  legal: {
    title:     'Términos y Privacidad',
    updatedAt: '21 de octubre de 2026',
    privacy: {
      heading:    'Política de Privacidad',
      updated:    'Última actualización: {{date}}',
      s1h: 'Responsable del tratamiento',
      s1b: '{{name}} — {{email}}',
      s2h: 'Qué datos se almacenan',
      s2b: '{{app}} solo guarda en tu dispositivo el apodo que ingresas voluntariamente al registrar un puntaje y el resultado obtenido en cada partida. Ese apodo puede ser real o ficticio; no exigimos ni verificamos que corresponda a una persona identificable.',
      s3h: 'Dónde se guardan',
      s3b: 'Todos los datos se almacenan exclusivamente en la base de datos local de tu dispositivo (SQLite). No existe ningún servidor, nube ni base de datos externa asociada a esta aplicación. Ninguna información sale de tu teléfono.',
      s4h: 'Con quién se comparten',
      s4b: 'Con nadie. No vendemos, cedemos ni transmitimos tus datos a terceros, anunciantes ni ningún otro servicio.',
      s5h: 'Publicidad y rastreo',
      s5b: '{{app}} no contiene publicidad de ningún tipo y no utiliza ninguna herramienta de rastreo, analítica o seguimiento de comportamiento (sin Firebase, sin AdMob, sin cookies, sin identificadores de dispositivo).',
      s6h: 'Tus derechos (Ley 19.628)',
      s6b: 'Conforme a la Ley N.° 19.628 sobre Protección de la Vida Privada y a la Ley N.° 21.719, tienes derecho a acceder, rectificar, suprimir y oponerte al tratamiento de tus datos. Dado que toda la información reside en tu propio dispositivo, puedes ejercer estos derechos directamente: elimina los datos de la app desde la configuración de tu teléfono o desinstala la aplicación. Para cualquier consulta adicional escríbenos a {{email}}.',
    },
    terms: {
      heading: 'Términos de Uso',
      updated: 'Última actualización: {{date}}',
      s1h: 'Aceptación',
      s1b: 'Al descargar o utilizar {{app}} aceptas estos Términos de Uso. Si no estás de acuerdo, no uses la aplicación.',
      s2h: 'Licencia de uso',
      s2b: 'Se te otorga una licencia personal, intransferible y no exclusiva para usar {{app}} únicamente con fines de entretenimiento personal. Queda prohibido modificar, descompilar, desensamblar, redistribuir o comercializar la aplicación o cualquier parte de ella.',
      s3h: 'Sin garantías',
      s3b: '{{app}} se entrega «tal cual» y sin garantías de ningún tipo, explícitas o implícitas. No garantizamos disponibilidad continua, ausencia de errores ni resultados específicos derivados del uso de la app.',
      s4h: 'Limitación de responsabilidad',
      s4b: 'En la máxima medida permitida por la ley chilena, {{name}} no será responsable por daños directos, indirectos, incidentales o consecuentes que pudieran surgir del uso o la imposibilidad de uso de la aplicación.',
      s5h: 'Modificaciones',
      s5b: 'Podemos actualizar estos términos en cualquier momento. La versión vigente siempre estará disponible dentro de la app. El uso continuado de {{app}} tras una actualización implica la aceptación de los nuevos términos.',
      s6h: 'Ley aplicable y jurisdicción',
      s6b: 'Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia se someterá a los tribunales ordinarios de justicia competentes de Chile.',
      s7h: 'Contacto',
      s7b: '{{email}}',
    },
    copyright: '© {{year}} {{name}} · {{app}}',
  },
} as const;

export default es;
export type TranslationKeys = typeof es;
