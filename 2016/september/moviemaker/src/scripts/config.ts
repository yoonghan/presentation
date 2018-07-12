require.config({
    paths: {
      'TweenMax': '/public/js/minified/TweenMax.min',
    },

    shim: {
      'TweenMax': {
        deps: [],
        exports: 'TweenMax'
      }
    },
    deps:['anotmain']
});
