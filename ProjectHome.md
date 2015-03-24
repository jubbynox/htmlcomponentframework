The HTML Component Framework enables web application developers to create and use custom HTML components in a simple, cross-browser, cross-domain and secure manner.

# Motivation #
The prevalence of the web proves the combined success of HTML, CSS and JavaScript for describing content, its style and behaviour. It is also apparent that web applications are capable of encapsulating a high level of sophistication such that they may be used in many areas that are traditionally the domain of desktop applications. Web applications could even become the preferred application container as they intrinsically work cross-device and cross-platform. In order to manage the complexity of an application the requirement arises to develop reusable modular GUI parts, i.e. in this context: HTML components. Furthermore, so that web applications can sit alongside their desktop counterparts and run offline (see HTML5 offline specification<sup>[1]</sup> and Google Gears<sup>[2]</sup>) it is important that they include all necessary functionality at the client and only use a backend server for accessing shared resources and communicating to other systems over the Internet - communication with a server is easily implemented with AJAX<sup>[3]</sup> using a REST<sup>[4]</sup> architecture and JSON<sup>[5]</sup> MIME type.

To this end many  JavaScript libraries<sup>[6]</sup> have been founded, often focused on providing advanced modular GUIs. Unfortunately, creating, extending and using these libraries is not standardised and so the developer has to use a variety of paradigms when functionality from more than one library is required. Additionally, the HTML content of the GUIs is often rolled into the JavaScript which makes them difficult to extend or re-style because the markup is not readily accessible.

The HTML Component Framework attempts to address all these requirements and issues; not by adding another library of GUIs and AJAX utilities, but by providing a framework which can be built on or used to wrap existing libraries in order to facilitate simple and standardised HTML component development.

# Features #
  * **Separation of content, style and behaviour** <br>Component content, style and behaviour are stored independently in files: .html, .css, .js. This frees the developer to use their preferred tools; also, components can be tested directly in a browser without a server or compilation stage.</li></ul>

<ul><li><b>Uses standard HTML elements</b> <br>Standard HTML elements are used to define components and include them in a web page.</li></ul>

  * **JavaScript API** <br>Components can be instantiated programmatically and added to web pages using JavaScript.</li></ul>

<ul><li><b>Secure, cross-domain component event model</b> <br>Inter-component communication is managed with a secure, cross-domain event model; optimised for HTML5 and also coded to work in older HTML versions. The cross-domain event model allows components to be hosted in one place by the component owner - thus enabling immediate roll-out of component fixes or updates and negating the need to make copies of files when using components in other domains. This also provides the ability to create component mashups, where data from different sources is manipulated and shown from within a single page.</li></ul>

  * **No constraints on component behaviour JavaScript code** <br>Framework automatically attaches component constructor and event handlers to component JavaScript code. The developer need only ensure that the HTML constructor and event handler definitions match the JavaScript constructor and relevant methods; therefore, no special requirements or constraints are placed on code.</li></ul>

<ul><li><b>Cross-browser</b> <br>Tested on browsers: IE7, IE8, Firefox, Chrome, Opera 10.62, Safari 5.0.2.</li></ul>

# References #
  1. [HTML5 offline specification](http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html#offline)
  1. [Google Gears](http://gears.google.com/)
  1. [AJAX programming](http://en.wikipedia.org/wiki/Ajax_(programming))
  1. [Representational State Transfer (REST)](http://en.wikipedia.org/wiki/Representational_State_Transfer)
  1. [JavaScript Object Notation (JSON)](http://en.wikipedia.org/wiki/JSON)
  1. [Comparison of JavaScript frameworks](http://en.wikipedia.org/wiki/Comparison_of_JavaScript_frameworks)