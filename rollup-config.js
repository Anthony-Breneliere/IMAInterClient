import rollup from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

export default {
    entry: 'app/main-aot.js',
    dest: 'bundle/dist/build.js', // output a single application bundle
    sourceMap: false,
    format: 'iife',
    onwarn: function(warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') { return; }

        // console.warn everything else
        console.warn("Warning: " + warning.message);
    },
    plugins: [
        nodeResolve({ jsnext: true, module: true }),
        commonjs({
            include: ['node_modules/rxjs/**',
                'node_modules/core-js/client/**',
                'node_modules/zone.js/dist/**',
                'node_modules/systemjs/dist/**',
                'node_modules/jquery/dist/**',
                'node_modules/lodash/lodash.js',
                'node_modules/signalr/jquery.signalR.min.js',
                'node_modules/typescript-collections/dist/lib/**',
                'node_modules/angular2-contextmenu/**',
                'node_modules/@angular/core/**',
                'node_modules/@angular/common/**',
                'node_modules/moment/**'
            ],
            namedExports: {
                // left-hand side can be an absolute path, a path
                // relative to the current directory, or the name
                // of a module in node_modules
                // 'node_modules/angular2-contextmenu/src/contextMenu.component.js': ['ContextMenuComponent']
                'node_modules/angular2-contextmenu/angular2-contextmenu.js': ['ContextMenuComponent'],
                'node_modules/lodash/lodash.js': ['merge']
            }
        }),
        uglify()
    ]
}