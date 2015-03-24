

# Event Model #
Communication with components is managed by event handling. A component may accept events that have been fired from its container (i.e. a web page or wrapping component) or a component may raise events to its container. The event model prevents a container and component from accessing each other in any way other than the carefully defined events. The event model also prevents two components within a container from communicating with each other unless the container is explicitly coded to route certain events.

**NB Security** <br>These features make the communication secure; however, care must be taken when sharing sensitive information with components hosted externally to a web application. The components could submit information to a 3<sup>rd</sup> party - if in doubt host the components in the same domain as the web application.<br>
<br>
<h1>Firing an Event at a Component</h1>
In order to fire an event at a component the instance of the component is required and optionally an object to carry the event parameters. The event is fired on the component instance as shown in the following example:<br>
<pre><code>component.fireEvent("eventName", eventParameters);<br>
</code></pre>
The value <code>"eventName"</code> refers to the name of the event as described in the HTML meta of the component (see <a href='WritingComponents#Accepted_Events.md'>"Accepted Events"</a> in the <a href='WritingComponents.md'>writing components section</a>).<br>
<br>
<h2>Obtaining a Component Instance</h2>
If a component was created programmatically (see <a href='PlacingComponentsOnAPage#Programmatically_Creating_an_Instance_of_a_Component.md'>"Programmatically Creating an Instance of a Component"</a> in the <a href='PlacingComponentsOnAPage.md'>placing components on a page section</a>) then an instance of the component was returned from the function call that created the component. However, if the instance object is no longer available or the component was created inline (see <a href='PlacingComponentsOnAPage#Adding_an_Instance_of_a_Component.md'>"Adding an Instance of a Component"</a> in the <a href='PlacingComponentsOnAPage.md'>placing components on a page section</a>) then the instance may be retrieved from the framework as follows:<br>
<pre><code>var component = ComponentFramework.getComponent(componentId);<br>
</code></pre>
where:<br>
<ul><li><code>componentId</code> <br>is the unique ID assigned to the component instance when it was created</li></ul>

<h2>Constructing the Event Parameters Object</h2>
If an event takes parameters then an object is required to carry their values. The event parameter names match the properties of the object. For example, the event parameters object for an event that takes two string parameters <code>string1</code> and <code>string2</code> could be created as:<br>
<pre><code>var eventParameters = new Object(); <br>
eventParameters.string1 = "string 1 parameter value"; <br>
eventParameters.string2 = "string 2 parameter value";<br>
</code></pre>

<h1>Raising an Event from within a Component</h1>
In order to raise an event to a container from within a component the framework is invoked directly with the event name and optionally an object to carry the event parameters, as shown in the following example:<br>
<pre><code>ComponentFramework.raiseEvent("eventName", eventParameters);<br>
</code></pre>
The value <code>"eventName"</code> refers to the name of the event as described in the HTML meta of the component (see <a href='WritingComponents#Raised_Events.md'>"Raised Events"</a> in the <a href='WritingComponents.md'>writing components section</a>). The <code>eventParameters</code> object is the same as described <a href='#Constructing_the_Event_Parameters_Object.md'>above</a>.<br>
<br>
<h1>Receiving an Event Raised from a Component</h1>
In order to receive an event raised from a component the instance of the component and a function to handle the event is required. The event handler function is added to the component instance's event listeners as shown in the following example:<br>
<pre><code>component.addEventListener("eventName", eventHandlerFunction);<br>
</code></pre>
where:<br>
<ul><li><code>component</code> <br>is the component instance (see <a href='#Obtaining_a_Component_Instance.md'>Obtaining a Component Instance above</a>).<br>
</li><li><code>"eventName"</code> <br>is the name of the event as described in the HTML meta of the component (see <a href='WritingComponents#Raised_Events.md'>"Raised Events"</a> in the <a href='WritingComponents.md'>writing components section</a>).<br>
</li><li><code>eventHandlerFunction</code> <br>is the function to handle the event, described <a href='#Event_Handler_Function.md'>below</a>.</li></ul>

<h2>Event Handler Function</h2>
The event handler function is invoked by the framework with the event parameters object and could be defined as:<br>
<pre><code>function eventHandlerFunction(eventParameters) {...}<br>
</code></pre>
The <code>eventParameters</code> object is the same as that described in <a href='CommunicatingWithComponents#Constructing_the_Event_Parameters_Object.md'>constructing the event parameters object above</a>.<br>
<br>
<b>NB Closures</b> <br>If the function accesses state variables of the component container or requires extra information from the component container then be careful with closures<sup>[1]</sup>.<br>
<br>
<h1>References</h1>
<ol><li><a href='http://www.mollypages.org/misc/jsclo.mp'>JavaScript closures</a>