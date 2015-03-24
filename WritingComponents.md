

# Component Files #
Components are written using a combination of HTML, CSS and JavaScript. Each of these may exist in a separate file.

# HTML #
The HTML of a component consists of:
  * meta to describe how the component is constructed and its supported events
  * inclusion of required files
  * body data to describe the component content

## Meta ##
A component meta is stored in `meta` tags within the head element of the HTML.

### Component Indicator and non-HTML5 Compliance ###
All components require the following `meta` tags:
```
<meta name="HTMLComponent" /> 
<meta name="eventUrl" content="http://component.domain.com/Event.html"/>
```
The `meta` tag with the `name` attribute of `"HTMLComponent"` indicates to the component framework that this is a component.<br>
The <code>meta</code> tag with the <code>name</code> attribute of <code>"eventUrl"</code> tells the component the location of a file that can manage the event model for non-HTML5 compliant browsers.<br>
<code>"http://component.domain.com/Event.html"</code> must point to the location of the framework's <code>Event.html</code> file, hosted in the same domain as the component. Go to this project's <a href='http://code.google.com/p/htmlcomponentframework/downloads/detail?name=Event.html&can=2&q='>downloads section for a copy of this file</a>.<br>
<br>
<h3>Constructor Definition</h3>
If the component has a non-default constructor then this must be defined with the following <code>meta</code> tag:<br>
<pre><code>&lt;meta scheme="JSONSchema" name="constructor" content='...' /&gt;<br>
</code></pre>
The <code>scheme</code> attribute tells the framework that the data in the <code>content</code> attribute is in JSON schema format<sup>[1]</sup><sup>[2]</sup>. The <code>content</code> attribute data describes an object (the constructor) and properties (the constructor parameters). For example, a constructor that takes two string parameters <code>string1</code> and <code>string2</code> is defined by the JSON schema:<br>
<pre><code>{<br>
  "type": "object", <br>
  "properties": <br>
  {<br>
    "string1": {"type": "string"}, <br>
    "string2": {"type": "string"}<br>
  }<br>
}<br>
</code></pre>

<h3>Event Definitions</h3>
Communication with components is managed by event handling. A component may accept events that have been fired from its container (i.e. a web page or wrapping component) or a component may raise events to its container. These events must be defined in the component meta; this makes the communication secure as the framework (combined with the JavaScript same origin policy<sup>[3]</sup>) prevents a container and component from accessing each other in any way other than the carefully defined events. The event model also prevents two components within a container from communicating with each other unless the container is explicitly coded to route certain events.<br>
<br>
<h4>Accepted Events</h4>
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

<h4>Raised Events</h4>
The following <code>meta</code> tag is used to define an event that the component can raise:<br>
<pre><code>&lt;meta scheme="PartialJSONSchema" name="raisesEvent" content='...' /&gt;<br>
</code></pre>
This definition is the same as for accepted events, <a href='#Accepted_Events.md'>above</a>, except that the <code>name</code> attribute tells the framework that this is a definition of an event that the component can raise.<br>
<br>
<h2>Included Files</h2>
The framework requires some CSS, some 3<sup>rd</sup> party JavaScript libraries and its own JavaScript to be included. These are included in the head element of the HTML.<br>
<br>
<h3>CSS Files</h3>
The framework CSS is included with:<br>
<pre><code>&lt;link rel="stylesheet" type="text/css" href="componentFramework/ComponentFramework.css"/&gt;<br>
</code></pre>
<code>"componentFramework/ComponentFramework.css"</code> must point to the location of the framework's <code>ComponentFramework.css</code> file. See <a href='http://htmlcomponentframework.googlecode.com/svn/releases/'>http://htmlcomponentframework.googlecode.com/svn/releases/</a> for the releases of this file. There is no need to make a copy of this file; its online location can be referenced.<br>
Additional CSS should be included for the component's own styling (see <a href='#CSS.md'>CSS section below</a>).<br>
<br>
<h3>JavaScript Files</h3>
The framework and dependent JavaScript is included with:<br>
<pre><code>&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jquery-1.3.2.min.js"&gt;&lt;/script&gt; <br>
&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/json2.js"&gt;&lt;/script&gt; <br>
&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jsonschema-b4.js"&gt;&lt;/script&gt; <br>
&lt;script type="text/javascript" src="componentFramework/ComponentFramework.js"&gt;&lt;/script&gt;<br>
</code></pre>
<code>"componentFramework/ComponentFramework.js"</code> must point to the location of the framework's <code>ComponentFramework.js</code> file. See <a href='http://htmlcomponentframework.googlecode.com/svn/releases/'>http://htmlcomponentframework.googlecode.com/svn/releases/</a> for the releases of this file. There is no need to make a copy of this file; its online location can be referenced. Note that the framework depends on JQuery and libraries to parse JSON and JSON schemas. These files are controlled by 3<sup>rd</sup> parties (see <a href='Reference#Required_CSS_and_JavaScript.md'>"Required CSS and JavaScript"</a> in the <a href='Reference.md'>reference section</a>).<br>
Additional JavaScript should be included to control the component's behaviour (see <a href='#JavaScript.md'>JavaScript section below</a>).<br>
<br>
<h2>Body</h2>
The content of a component is written in the the <code>body</code> element of the HTML, just like a regular web page. The framework places no restrictions on the content; the designer is free to add anything they want to construct the component. Because of this, and the fact that a regular HTML page is created, a component can be previewed and tested locally in a browser without the need of a server.<br>
<br>
<h1>CSS</h1>
A component's styling should be stored in a separate CSS file, included in the <code>head</code> element of the HTML. The framework places no restrictions on the CSS; however it should be noted that all the styles used by the framework are named with the prefix <code>"cf_"</code> and so should not be overridden unless a change to the framework styling is desired (the framework styles are mainly to display an image when a component is loading and an image if there was a problem during component construction). When designing a component it may be useful to provide a parameter in the constructor to allow the dynamic linking of a user specific CSS file, so that the styling can be customised.<br>
<br>
<h1>JavaScript</h1>
A component's behaviour should be stored in a separate JavaScript file, included in the <code>head</code> element of the HTML. The framework places a minimal set of restrictions on the component's Javascript as follows:<br>
<br>
<h2>Main Class Name</h2>
The framework expects a class to instantiate in order to initialise the component's JavaScript. The name of this class must be the same as the filename of the component's HTML (without the file extension). There are no restrictions on how the class is defined, only that it must be possible to create an instance of it using the <code>new</code> operator.<br>
<br>
<h2>Constructor</h2>
The component's main class constructor (the function that is invoked by the <code>new</code> operator) must accept parameters that match in type and order those defined in the constructor schema (see <a href='#Constructor_Definition.md'>Constructor Definition section above</a>).<br>
The framework instantiates the class identified above using parameters supplied by the creator of a component. The parameters are checked against the constructor schema.<br>
If no constructor has been defined then a default (parameterless) constructor is assumed.<br>
<br>
<h2>Functions to Accept Events</h2>
The main class must define visible functions for all the events that the component can accept. The function names must match the event names defined in the accepted event partial schemas (see <a href='#Accepted_Events.md'>Accepted Events section above</a>); likewise the function parameters must match in type and order those defined in the accepted event partial schemas.<br>
For the example given in the <a href='#Accepted_Events.md'>Accepted Events section</a> the function signature could be:<br>
<pre><code>this.twoParameterEvent = function(string1, string2) {...};<br>
</code></pre>

When managing an event the framework maps the event object properties to the event function parameters and checks them against the accepted event partial schema.<br>
<br>
<h1>References</h1>
<ol><li><a href='http://tools.ietf.org/html/draft-zyp-json-schema-02'>A JSON Media Type for Describing the Structure and Meaning of JSON Documents</a>
</li><li><a href='http://groups.google.com/group/json-schema/web/json-schema-proposal-working-draft'>JSON Schema Proposal</a>
</li><li><a href='http://en.wikipedia.org/wiki/Same_origin_policy'>Same origin policy</a>