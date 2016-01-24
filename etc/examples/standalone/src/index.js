var CodeMirror = require("codemirror");
require("../node_modules/codemirror/lib/codemirror.css");
require("../node_modules/codemirror/mode/python/python");

var WidgetManager = require("./manager").WidgetManager;

var urth_widgets = require('urth-widgets');



var services = require('jupyter-js-services');
var getKernelSpecs = services.getKernelSpecs;
var startNewKernel = services.startNewKernel;

var BASEURL = prompt('Notebook BASEURL', 'http://192.168.99.100:8888');

var WSURL = 'ws:' + BASEURL.split(':').slice(1).join(':');

urth_widgets.init('./node_modules/urth-widgets/dist/urth_widgets/');

document.addEventListener("DOMContentLoaded", function(event) {

    // Connect to the notebook webserver.
    getKernelSpecs(BASEURL).then(kernelSpecs => {
        return startNewKernel({
            baseUrl: BASEURL,
            wsUrl: WSURL,
            name: kernelSpecs.default,
        });
    }).then(kernel => {
        
        // Create a codemirror instance
        var code = require("../widget_code.json").join("\n");
        var inputarea = document.getElementsByClassName("inputarea")[0];
        var editor = CodeMirror(inputarea, {
            value: code,
            mode: "python",
            tabSize: 4,
            showCursorWhenSelecting: true,
            viewportMargin: Infinity,
            readOnly: true
        });

        // Create the widget area and widget manager
        var widgetarea = document.getElementsByClassName("widgetarea")[0];
        var manager = new WidgetManager(kernel, widgetarea);

        //more shimming
        IPython.notebook.kernel = kernel;
        IPython.notebook.kernel.widget_manager = manager;
        IPython.notebook.events.trigger('kernel_ready.Kernel');

        // Run backend code to create the widgets.  You could also create the
        // widgets in the frontend, like the other /web/ examples demonstrate.
        var execPromise = kernel.execute({ code: code });
        execPromise.onReply = function(){
            IPython.notebook.events.trigger('shell_reply.Kernel');
        }

    });
});
