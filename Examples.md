

# Hello World #
The following is an example of placing a component on a web page and component communication.<br>
The "Hello World" component displays the time-worn phrase when it receives a <code>greetWorld</code> event. It also displays a "hide greeting" button that hides the phrase and raises a <code>greetingHidden</code> event.<br>
The "Hello World" web page includes the component in-line and fires the 'greetWorld' event at it when the "greet world" button is pressed. The visibility of the "greet world" button is toggled for each event sent and received.<br>
<br>
The working example can be found here: <a href='http://htmlcomponentframework.googlecode.com/svn/examples/hello-world/HelloWorld.html'>http://htmlcomponentframework.googlecode.com/svn/examples/hello-world/HelloWorld.html</a>

<h2>Hello World Component</h2>
<h3>HTML</h3>
The following HTML (<code>HelloWorldComponent.html</code>) describes the Hello World component's events and content:<br>
<pre><code>&lt;html&gt;<br>
	&lt;head&gt;<br>
		&lt;meta name="HTMLComponent" /&gt;<br>
		&lt;meta name="eventUrl" content="http://htmlcomponentframework.googlecode.com/svn/examples/Event.html"/&gt;<br>
		&lt;meta scheme="PartialJSONSchema" name="acceptsEvent" content='{"greetWorld": {"type": "null"}}' /&gt;<br>
		&lt;meta scheme="PartialJSONSchema" name="raisesEvent" content='{"greetingHidden": {"type": "null"}}' /&gt;<br>
		&lt;link rel="stylesheet" type="text/css" href="http://htmlcomponentframework.googlecode.com/svn/releases/1.0/ComponentFramework.css"/&gt;<br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jquery-1.3.2.min.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/json2.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jsonschema-b4.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/releases/1.0/ComponentFramework.js"&gt;&lt;/script&gt;<br>
		&lt;script type="text/javascript" src="HelloWorldComponent.js"&gt;&lt;/script&gt;<br>
	&lt;/head&gt;<br>
	&lt;body&gt;<br>
		&lt;div id="togglePanel" style="display:none"&gt;Hello World! &lt;button id="hideGreetingButton" type="button"&gt;hide greeting&lt;/button&gt;&lt;/div&gt;<br>
	&lt;/body&gt;<br>
&lt;/html&gt;<br>
</code></pre>

<h3>JavaScript</h3>
The following JavaScript (<code>HelloWorldComponent.js</code>) describes the Hello World component's functionality:<br>
<pre><code>function HelloWorldComponent()<br>
{<br>
	jQuery('#hideGreetingButton').click(hideGreeting);<br>
	<br>
	this.greetWorld = function()<br>
	{<br>
		jQuery('#togglePanel').show();<br>
	}<br>
	<br>
	function hideGreeting()<br>
	{<br>
		jQuery('#togglePanel').hide();<br>
		ComponentFramework.raiseEvent("greetingHidden");<br>
	}<br>
}<br>
</code></pre>

<h2>Hello World Web Page</h2>
<h3>HTML</h3>
The following HTML (<code>HelloWorld.html</code>) includes the component in-line and describes the web page's content:<br>
<pre><code>&lt;html&gt;<br>
	&lt;head&gt;<br>
		&lt;meta name="eventUrl" content="http://htmlcomponentframework.googlecode.com/svn/examples/Event.html"/&gt;<br>
		&lt;meta scheme="JSON" name="includeComponent" content='{"name":"HelloWorldComponent","url":"HelloWorldComponent.html"}' /&gt;<br>
		&lt;link rel="stylesheet" type="text/css" href="http://htmlcomponentframework.googlecode.com/svn/releases/1.0/ComponentFramework.css"/&gt;<br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jquery-1.3.2.min.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/json2.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jsonschema-b4.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/releases/1.0/ComponentFramework.js"&gt;&lt;/script&gt;<br>
		&lt;script type="text/javascript" src="HelloWorld.js"&gt;&lt;/script&gt;<br>
	&lt;/head&gt;<br>
	&lt;body&gt;<br>
		&lt;button id="greetWorldButton" type="button"&gt;greet world&lt;/button&gt;<br>
		&lt;div id="helloWorldComponentId" title="HelloWorldComponent" class="cf_component_marker"&gt;<br>
			&lt;input type="hidden" name="loadedCallback" value="helloWorldComponentLoaded" /&gt;<br>
		&lt;/div&gt;<br>
	&lt;/body&gt;<br>
&lt;/html&gt;<br>
</code></pre>

<h3>JavaScript</h3>
The following JavaScript (<code>HelloWorld.js</code>) describes the web page's functionality:<br>
<pre><code>jQuery(window).load(function()<br>
{<br>
	ComponentFramework.loadAndRender();<br>
	jQuery('#greetWorldButton').click(greetWorld);<br>
});<br>
<br>
function helloWorldComponentLoaded()<br>
{<br>
	ComponentFramework.getComponent('helloWorldComponentId').addEventListener("greetingHidden", greetingHidden);<br>
}<br>
<br>
function greetWorld()<br>
{<br>
	jQuery('#greetWorldButton').hide();<br>
	ComponentFramework.getComponent('helloWorldComponentId').fireEvent('greetWorld');<br>
}<br>
<br>
function greetingHidden()<br>
{<br>
	jQuery('#greetWorldButton').show();<br>
}<br>
</code></pre>

<h1>Banacek Website</h1>
<a href='http://www.banacek.org'>http://www.banacek.org</a>

An example of a site that uses the framework. It contains the entire recorded catalogue of the band Banacek.<br>
<br>
<h1>Audio Player</h1>
The following example isolates the audio player from the Banacek site: <a href='http://htmlcomponentframework.googlecode.com/svn/examples/audio-player/AudioPlayer.html'>http://htmlcomponentframework.googlecode.com/svn/examples/audio-player/AudioPlayer.html</a>

This also demonstrates the cross-domain application of components, as the Banacek component is hosted in a different location to the example.<br>
<br>
<h2>HTML</h2>
The following HTML (<code>AudioPlayer.html</code>) places the audio player component, from the Banacek site, on the page.<br>
It also sets up some input fields for data to send to the component when an "add track" button is pressed.<br>
<pre><code>&lt;html&gt;<br>
	&lt;head&gt;<br>
		&lt;meta name="eventUrl" content="http://htmlcomponentframework.googlecode.com/svn/examples/Event.html"/&gt;<br>
		&lt;meta scheme="JSON" name="includeComponent" content='{"name":"AudioPlayerComponent","url":"http://www.banacek.org/components/musicPlayer/MusicPlayer.html"}' /&gt;<br>
		&lt;link rel="stylesheet" type="text/css" href="http://htmlcomponentframework.googlecode.com/svn/releases/1.0/ComponentFramework.css"/&gt;<br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jquery-1.3.2.min.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/json2.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/3rdpartylibs/jsonschema-b4.js"&gt;&lt;/script&gt; <br>
		&lt;script type="text/javascript" src="http://htmlcomponentframework.googlecode.com/svn/releases/1.0/ComponentFramework.js"&gt;&lt;/script&gt;<br>
		&lt;script type="text/javascript" src="AudioPlayer.js"&gt;&lt;/script&gt;<br>
	&lt;/head&gt;<br>
	&lt;body&gt;<br>
		Album image URL: &lt;input type="text" id="albumImgUrlId" value="http://www.banacek.org/albumImgs/Banacek/Thumb.png"/ size="100"&gt;&lt;br/&gt;<br>
		Album name: &lt;input type="text" id="albumNameId" value="Banacek"/&gt;&lt;br/&gt;<br>
		Track number: &lt;input type="text" id="trackNumberId" value="4" size="2"/&gt;&lt;br/&gt;<br>
		Track name: &lt;input type="text" id="trackNameId" value="Queen Bee"/&gt;&lt;br/&gt;<br>
		Track URL: &lt;input type="text" id="trackUrlId" value="http://www.banacek.org/GetTrackUrl?trackId=banacek4" size="100"/&gt;&lt;br/&gt;<br>
		&lt;button id="addTrackButton" type="button"&gt;add track&lt;/button&gt;<br>
		&lt;div id="audioPlayerComponentId" title="AudioPlayerComponent" class="cf_component_marker"&gt;&lt;/div&gt;<br>
	&lt;/body&gt;<br>
&lt;/html&gt;<br>
</code></pre>

<h2>JavaScript</h2>
The following JavaScript (<code>AudioPlayer.js</code>) binds a function to the "add track" button; this function reads the data from the input fields into an object and sends it with an <code>add</code> event to the audio player component.<br>
<pre><code>jQuery(window).load(function()<br>
{<br>
	ComponentFramework.loadAndRender();<br>
	jQuery('#addTrackButton').click(addTrack);<br>
});<br>
<br>
function addTrack()<br>
{<br>
	var eventProperties = new Object();<br>
	eventProperties.albumImgUrl = jQuery('#albumImgUrlId').val();<br>
	eventProperties.albumName = jQuery('#albumNameId').val();<br>
	eventProperties.trackNumber = jQuery('#trackNumberId').val();<br>
	eventProperties.trackName = jQuery('#trackNameId').val();<br>
	eventProperties.trackUrl = jQuery('#trackUrlId').val();<br>
	ComponentFramework.getComponent('audioPlayerComponentId').fireEvent('add', eventProperties);<br>
}<br>
</code></pre>

<h1>Citroën 2CV Information</h1>
The following example uses the carousel component from the Banacek site to create a pictorial history of the 2CV. Clicking on an image displays some information about that particular model:<br>
<a href='http://htmlcomponentframework.googlecode.com/svn/examples/2cv-info/2cvInfo.html'>http://htmlcomponentframework.googlecode.com/svn/examples/2cv-info/2cvInfo.html</a>

This also demonstrates the cross-domain application of components, as the Banacek component is hosted in a different location to the example.