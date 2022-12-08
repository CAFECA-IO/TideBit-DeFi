module.exports = {
  disableEmoji: false, // 是否禁用 emoji
  format: '{type}{scope}: {emoji}{subject}', // Commit 訊息的格式
  list: ['play', 'feat', 'fix', 'test', 'chore', 'docs', 'refactor', 'style', 'ci', 'perf'], // Commit 類型的清單
  maxMessageLength: 64, // Commit 訊息的最大長度
  minMessageLength: 3, // Commit 訊息的最小長度
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues', 'lerna'], // 問題的清單
  scopes: [], // Commit 範圍的清單
  types: {
    // Commit 類型的清單
    chore: {
      description: 'Build process or auxiliary tool changes', // Commit 類型的描述
      emoji: '🤖', // Commit 類型的 emoji
      value: 'chore', // Commit 類型的值
    },
    ci: {
      description: 'CI related changes',
      emoji: '🎡',
      value: 'ci',
    },
    docs: {
      description: 'Documentation only changes',
      emoji: '✏️',
      value: 'docs',
    },
    feat: {
      description: 'A new feature',
      emoji: '🎸',
      value: 'feat',
    },
    fix: {
      description: 'A bug fix',
      emoji: '🐛',
      value: 'fix',
    },
    perf: {
      description: 'A code change that improves performance',
      emoji: '⚡️',
      value: 'perf',
    },
    refactor: {
      description: 'A code change that neither fixes a bug or adds a feature',
      emoji: '💡',
      value: 'refactor',
    },
    release: {
      description: 'Create a release commit',
      emoji: '🏹',
      value: 'release',
    },
    style: {
      description: 'Markup, white-space, formatting, missing semi-colons...',
      emoji: '💄',
      value: 'style',
    },
    test: {
      description: 'Adding missing tests',
      emoji: '💍',
      value: 'test',
    },
    play: {
      description: 'Taking notes and having fun',
      emoji: '🐳',
      value: 'play',
    },
  },
  messages: {
    // Commit 的訊息描述
    type: "Select the type of change that you're committing:",
    customScope: 'Select the scope this component affects:',
    subject: 'Write a short, imperative mood description of the change:\n',
    body: 'Provide a longer description of the change:\n ',
    breaking: 'List any breaking changes:\n',
    footer: 'Issues this commit closes, e.g #123:',
    confirmCommit: 'The packages that this commit has affected\n',
  },
};
