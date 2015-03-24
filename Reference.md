

# Framework Files #
The framework consists of the following files:
  * ajax-loader.gif <br>An animated GIF to indicate that a component is loading.<br>
<ul><li>ComponentFramework.css <br>CSS used by the component framework.<br>
</li><li>ComponentFramework.js <br>The component framework JavaScript.<br>
</li><li>Event.html <br>An HTML page to manage event handling for non-HTML5 browsers. This file must be hosted in the same domain as the component.<br>
</li><li>infinite.png <br>An image to display if a component hierarchy is detected to have infinite recursion.</li></ul>

<h1>Required CSS and JavaScript</h1>
The framework requires CSS and JavaScript to be included in components and web pages that include components.<br>
<h2>Dependencies</h2>
The framework depends on JQuery and libraries to parse JSON and JSON schemas. These files must be included in the component HTML <code>head</code>:<br>
<ul><li><a href='http://jquery.com/'>jquery-1.3.2.min.js</a> <br>JQuery is used to read and manipulate the DOM of a component or component container. The framework is built against version 1.3.3.<br>
</li><li><a href='http://www.json.org/json2.js'>json2.js</a> <br>JSON2 is used to parse JSON.<br>
</li><li><a href='http://groups.google.com/group/json-schema'>jsonschema-b4.js</a> <br>JSON schema is used to schema check component construction and event data.<br>
These files can be found at: <a href='http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs'>http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs</a></li></ul>

<h2>Framework</h2>
The framework itself requires two files to be included in the component HTML <code>head</code>:<br>
<ul><li>ComponentFramework.css<br>
</li><li>ComponentFramework.js<br>
See <a href='http://htmlcomponentframework.googlecode.com/svn/releases/'>http://htmlcomponentframework.googlecode.com/svn/releases/</a> for the releases of these files. There is no need to make copies of these files; their online location can be referenced.</li></ul>

<h1>Component Meta Information</h1>
Including or defining a component requires the use of <code>meta</code> tags within the HTML <code>head</code>.<br>
<br>
<h2>Meta for Including and Defining a Component</h2>

<h3>Non-HTML5 Event Model</h3>
The following tag is to support the event model in non-HTML5 browsers:<br>
<pre><code>&lt;meta name="eventUrl" content="http://component.domain.com/Event.html"/&gt;<br>
</code></pre>
<code>"http://component.domain.com/Event.html"</code> must point to the location of the framework's <code>Event.html</code> file, hosted in the same domain as the component. Go to this project's <a href='http://code.google.com/p/htmlcomponentframework/downloads/detail?name=Event.html&can=2&q='>downloads section for a copy of this file</a>.<br>
<br>
<h2>Meta for Including a Component</h2>

<h3>Inline Component Inclusion</h3>
The following tag includes a component within a web page so that it can be placed inline, within the page HTML.<br>
<pre><code>&lt;meta scheme="JSON" name="includeComponent" content='{"name":"component name","url":"URL to HTML of component"}' /&gt;<br>
</code></pre>
The <code>scheme</code> attribute tells the framework that the data in the <code>content</code> attribute is in JSON format. The <code>name</code> attribute identifies to the framework that a component is to be included. The <code>content</code> data is JSON describing a name for the component and where to find its HTML.<br>
<br>
<h2>Meta for Defining a Component</h2>

<h3>Component Marker</h3>
The following tag indicates to the framework that the web page is a component.<br>
<pre><code>&lt;meta name="HTMLComponent" /&gt;<br>
</code></pre>

<h3>Constructor Definition</h3>
If the component has a non-default constructor then this must be defined with the following <code>meta</code> tag:<br>
<pre><code>&lt;meta scheme="JSONSchema" name="constructor" content='...' /&gt;<br>
</code></pre>
The <code>scheme</code> attribute tells the framework that the data in the <code>content</code> attribute is in JSON schema format. The <code>content</code> attribute data describes an object (the constructor) and properties (the constructor parameters). For example, a constructor that takes two string parameters <code>string1</code> and <code>string2</code> is defined by the JSON schema:<br>
<pre><code>{<br>
  "type": "object", <br>
  "properties": <br>
  {<br>
    "string1": {"type": "string"}, <br>
    "string2": {"type": "string"}<br>
  }<br>
}<br>
</code></pre>

<h3>Accepts Event Definition</h3>
The following <code>meta</code> tag is used to define an event that the component can accept:<br>
<pre><code>&lt;meta scheme="PartialJSONSchema" name="acceptsEvent" content='...' /&gt;<br>
</code></pre>
The <code>scheme</code> attribute tells the framework that the data in the <code>content</code> attribute is in a partial JSON schema format. In this context this means that the content is a JSON object that has a name corresponding to the event name and a value that is a JSON schema describing the event data. The <code>name</code> attribute tells the framework that this is a definition of an event that the component can accept.<br>
The JSON schema describes an object (the event) and properties (the event parameters). For example, an event named <code>"twoParameterEvent"</code> that takes two string parameters <code>string1</code> and <code>string2</code> is defined by the partial JSON schema:<br>
<pre><code>{<br>
  "twoParameterEvent": <br>
  {<br>
    "type": "object", <br>
    "properties": <br>
    {<br>
      "string1": {"type": "string"}, <br>
      "string2": {"type": "string"}<br>
    }<br>
  }<br>
}<br>
</code></pre>
An event that carries no parameters can be defined like the following partial JSON schema:<br>
<pre><code>{<br>
  "noParameterEvent": <br>
  {<br>
    "type": "null"<br>
  }<br>
}<br>
</code></pre>

<h3>Raises Event Definition</h3>
The following <code>meta</code> tag is used to define an event that the component can raise:<br>
<pre><code>&lt;meta scheme="PartialJSONSchema" name="raisesEvent" content='...' /&gt;<br>
</code></pre>
This definition is the same as for accepted events except that the <code>name</code> attribute tells the framework that this is a definition of an event that the component can raise.<br>
<br>
<h1>Inline Components</h1>
A component is included inline, within the HTML, using a <code>div</code> tag, e.g.:<br>
<pre><code>&lt;div id="componentID" title="component name" class="cf_component_marker" /&gt;<br>
</code></pre>
The <code>id</code> attribute associates a unique identifier with the component instance; this is used by the framework to refer to the instance. The <code>title</code> attribute references the name used when the component definition was included. The <code>class</code> attribute must contain <code>"cf_component_marker"</code>, which is a style from the framework. It indicates to the framework that this <code>div</code> element is an inline component.<br>
<br>
<h2>Component Constructor Parameters</h2>
Constructor parameters are added with hidden <code>input</code> elements as children of the component <code>div</code> element, e.g.:<br>
<pre><code>&lt;div title="component name" class="cf_component_marker" &gt;<br>
   &lt;input type="hidden" name="parameterName" value="..." /&gt;<br>
&lt;/div&gt;<br>
</code></pre>
Each <code>input</code> element is a parameter to the constructor. The <code>name</code> attribute defines the parameter name; the <code>value</code> attribute defines the value of the parameter. The value may be a primitive or a JSON object.<br>
<br>
<h2>Component Loaded Callback</h2>
In order to specify a function to be called when the component has loaded add another parameter to the constructor parameters list with the name <code>loadedCallback</code>. The value of this parameter is the name of the function to call, e.g.:<br>
<pre><code>   ...<br>
   &lt;input type="hidden" name="loadedCallback" value="functionNameToCallWhenLoaded" /&gt;<br>
   ...<br>
</code></pre>

<h1>Framework JavaScript API</h1>
<h2>Component Framework Object</h2>

<h3>ComponentFramework.getComponent(componentId)</h3>
Gets a component object (a component that has already been created).<br>
<ul><li>componentId <br>The ID given to the component when it was created.</li></ul>

The component object is returned.<br>
<br>
<h3>ComponentFramework.includeComponent(friendlyClassName, url)</h3>
Programmatically includes a component.<br>
<ul><li>friendlyClassName <br>A class name to give the component. Used when creating an instance of the component.<br>
</li><li>url <br>The URL to the component's HTML.</li></ul>

<h3>ComponentFramework.loadAndRender()</h3>
Loads and renders inline components. This should be attached to the <code>onload</code> event handler for a web page that includes components.<br>
<br>
<h3>ComponentFramework.newComponent(componentId, friendlyClassName, parameters, loadedCallback)</h3>
Creates a new instance of a component.<br>
<ul><li>componentId <br>An unique ID to assign to the instance of the component.<br>
</li><li>friendlyClassName <br>The class name given to the component when it was included.<br>
</li><li>parameters (optional) <br>An object carrying the parameters to pass to the component constructor. The object property names match the constructor parameter names, e.g.:<br>
<pre><code>var parameters = new Object();<br>
parameters.parameter1Name = valueOfParameter1;<br>
parameters.parameter2Name = valueOfParameter2;<br>
...<br>
</code></pre>
</li><li>loadedCallback (optional) <br>A function to invoke when the component has loaded.</li></ul>

The new component object is returned.<br>
<br>
<h3>ComponentFramework.raiseEvent(eventName, eventProperties)</h3>
Raises an event to the component's container.<br>
<ul><li>eventName <br>The name of the event as described in the HTML meta of the component.<br>
</li><li>eventProperties <br>An object carrying the event parameters. The object property names match the event parameter names, e.g.:<br>
<pre><code>var eventParameters = new Object(); <br>
eventParameters.string1 = "string 1 parameter value"; <br>
eventParameters.string2 = "string 2 parameter value";<br>
</code></pre></li></ul>

<h3>ComponentFramework.removeComponent(componentId)</h3>
Removes a component from the framework and releases its resources.<br>
<ul><li>componentId <br>The ID given to the component when it was created.</li></ul>

<h2>Component Object</h2>
The component object returned from <code>ComponentFramework.getComponent</code> and <code>ComponentFramework.newComponent</code> has the following methods defined:<br>
<br>
<h3>.addEventListener(eventName, eventHandlerFunction)</h3>
Adds an event handler function to the component object's event listeners.<br>
<ul><li>eventName <br>The name of the event as described in the HTML meta of the component.<br>
</li><li>eventHandlerFunction <br>The function to handle the event. The event handler function is invoked by the framework with the event parameters object and could be defined as:<br>
<pre><code>function eventHandlerFunction(eventParameters) {...}<br>
</code></pre>
where <code>eventParameters</code> is an object with property names that match the event parameter names.</li></ul>

<h3>.fireEvent(eventName, eventParameters)</h3>
Fires an event at the component object.<br>
<ul><li>eventName <br>The name of the event as described in the HTML meta of the component.<br>
</li><li>eventParameters <br>An object with property names that match the event parameter names.</li></ul>

<h3>.getElement()</h3>
Gets the DOM element of the component object. The DOM element can be inserted into the page DOM using whichever technique is preferred.