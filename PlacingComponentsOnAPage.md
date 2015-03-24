

# Meta Data and Included Files Setup #
Before placing a component the framework requires some meta data and links to CSS and JavaScript within the head element of the page:

## Event Meta ##
In order to support non-HTML5 compliant browsers the framework needs to know the location of a file that can manage the event model for these browsers. This is done with the following meta:
```
<meta name="eventUrl" content="http://hosting.page.domain.com/Event.html"/>
```
`"http://hosting.page.domain.com/Event.html"` must point to the location of the framework's `Event.html` file, hosted in the same domain as the page that is to host the components. Go to this project's [downloads section for a copy of this file](http://code.google.com/p/htmlcomponentframework/downloads/detail?name=Event.html&can=2&q=).

## CSS ##
The framework requires a small CSS file:
```
<link rel="stylesheet" type="text/css" href="componentFramework/ComponentFramework.css"/>
```
`"componentFramework/ComponentFramework.css"` must point to the location of the framework's ComponentFramework.css file. See http://htmlcomponentframework.googlecode.com/svn/releases/ for the releases of this file. There is no need to make a copy of this file; its online location can be referenced.

## JavaScript ##
The framework and dependent JavaScript is included with:
```
<script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jquery-1.3.2.min.js"></script> 
<script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/json2.js"></script> 
<script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jsonschema-b4.js"></script> 
<script type="text/javascript" src="componentFramework/ComponentFramework.js"></script>
```
`"componentFramework/ComponentFramework.js"` must point to the location of the framework's ComponentFramework.js file. See http://htmlcomponentframework.googlecode.com/svn/releases/ for the releases of this file. There is no need to make a copy of this file; its online location can be referenced. Note that the framework depends on JQuery and libraries to parse JSON and JSON schemas. These files are controlled by 3<sup>rd</sup> parties (see ["Required CSS and JavaScript"](Reference#Required_CSS_and_JavaScript.md) in the [reference section](Reference.md)).
If the page is not a component itself then the following must be added to the `onload` event handler of the `body` tag to initialise the framework:
```
<body onload="ComponentFramework.loadAndRender();">
```

# Inline Components #
Components may be placed inline by adding markup to a page.

## Including a Component Definition ##
To use an inline component its definition must first be included using a `meta` element within the `head` element of the page, e.g.:
```
<meta scheme="JSON" name="includeComponent" content='{"name":"component name","url":"URL to HTML of component"}' />
```
The `scheme` attribute tells the framework that the data in the content attribute is in JSON format. The `name` attribute identifies to the framework that a component is to be included. The `content` data is JSON describing a name for the component and where to find its HTML. The name can be any string and will be used later to reference the component definition when adding it to the page.

## Adding an Instance of a Component ##
An instance of the component can be added inline to the page body using a `div` element, e.g.:
```
<div id="componentID" title="component name" class="cf_component_marker" />
```
The `id` attribute associates a unique identifier with the component instance; this is used by the framework to refer to the instance. The `title` attribute references the name used when the component definition was included. The `class` attribute must contain `"cf_component_marker"`, which is a style from the framework. It indicates to the framework that this `div` element is an inline component.

### Supplying Constructor Parameters ###
A component may require constructor parameters; the HTML meta of the component will indicate what these are (see ["Constructor Definition"](WritingComponents#Constructor_Definition.md) in the [writing components section](WritingComponents.md)). Constructor parameters are added with hidden `input` elements as children of the component `div` element, e.g.:
```
<div title="component name" class="cf_component_marker" >
   <input type="hidden" name="parameterName" value="..." />
</div>
```
Each `input` element is a parameter to the constructor. The `name` attribute defines the parameter name; the `value` attribute defines the value of the parameter. The value may be a primitive or a JSON object.

### Callback when Component is Loaded ###
It may be useful to know when a component has loaded. In order to specify a function to be called when the component has loaded add another parameter to the constructor parameters list with the name `loadedCallback`. The value of this parameter is the name of the function to call, e.g.:
```
   ...
   <input type="hidden" name="loadedCallback" value="functionNameToCallWhenLoaded" />
   ...
```

# Programmatically Adding Components #
The steps involved in adding a component programmatically are:
  1. include the component definition
  1. create an instance of the component
  1. add the component to the DOM

## Programmatically Including a Component Definition ##
A component is included with the following:
```
ComponentFramework.includeComponent("component name", "URL to HTML of component");
```
The values passed to the `includeComponent` method match those previously described for including inline components.

## Programmatically Creating an Instance of a Component ##
An instance of a component is created with the following:
```
var component = ComponentFramework.newComponent(componentId, "component name", optionalParameters, optionalLoadedCallbackFunction);
```
where:
  * `componentId` <br>is a unique ID with which the component instance can be referred to by the framework.<br>
<ul><li><code>"component name"</code> <br>is the name of the component definition, used previously to include the component.<br>
</li><li><code>optionalParameters</code> <br>are the parameters to pass to the component constructor and may be left out if there are no constructor parameters; otherwise the value is an object with properties that match the parameter names, e.g.:<br>
<pre><code>var parameters = new Object();<br>
parameters.parameter1Name = valueOfParameter1;<br>
parameters.parameter2Name = valueOfParameter2;<br>
...<br>
</code></pre>
</li><li><code>optionalLoadedCallbackFunction</code> <br>is an optional function to call when the component has loaded.</li></ul>

<h2>Adding a Component to the DOM</h2>
The object returned from the <code>newComponent</code> method invocation is a component object (see <a href='Reference#Component_Object.md'>"Component Object"</a> in the <a href='Reference.md'>reference section</a>). The actual DOM element of the component can be retrieved with:<br>
<pre><code>var componentDOMElement = component.getElement();<br>
</code></pre>
where <code>component</code> is the component object returned from the <code>newComponent</code> method invocation.<br>
<br>
The DOM element can be inserted into the page DOM using whichever technique is preferred.