module.exports = {
  someSidebar: {
    Introduction: ['intro/gettingStarted'],
    Basic: [
      'basic/createReducer',
      'basic/branching',
      'basic/loop',
      'basic/composing',
      'basic/subState'
    ],
    Advanced: ['advanced/predicate', 'advanced/mapAction'],
    Redux: [],
    Recipes: ['recipe/normalization'],
    'API Reference': [
      'api/composeReducer',

      // value
      'api/initState',
      'api/setValue',
      'api/unsetValue',
      'api/incValue',
      'api/decValue',
      'api/pushValue',
      'api/pushValues',
      'api/popValues',

      // flow
      'api/branch',
      'api/predicate',
      'api/branchAction',
      'api/mapAction',
      'api/mapActions',
      'api/onEach',

      'api/withContext',
      'api/at',
      'api/provideResolver',

      'api/pathResolver',
      'api/valueResolver'
    ]
    // Docusaurus: ['doc1', 'doc2', 'doc3'],
    // Features: ['mdx'],
  }
};
