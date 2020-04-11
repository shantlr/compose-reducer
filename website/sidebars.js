module.exports = {
  someSidebar: {
    'Introduction': ['intro/gettingStarted'],
    'Basic': [
      'basic/createReducer',
      'basic/branching',
      'basic/loop',
      'basic/composing',
      'basic/subState',
    ],
    'Advanced': [
      'advanced/predicate',
      'advanced/mapAction'
    ],
    'Redux': [],
    'Recipes': ['recipe/normalization'],
    'API Reference': [
      'api/composeReducer',

      // value
      'api/initState',
      'api/setValue',
      'api/incValue',
      'api/decValue',

      // flow
      'api/branch',

      'api/pathResolver',
      'api/valueResolver',
    ],
    // Docusaurus: ['doc1', 'doc2', 'doc3'],
    // Features: ['mdx'],
  },
};
