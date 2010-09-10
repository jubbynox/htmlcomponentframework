/**
 * HTML Component Framework.
 *
 * Copyright (c) 2010, Joel Laird
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Joel Laird nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Create Event static class members.
Event();

/**
 * Event static class.
 */
function Event()
{
	/**
	 * This page's event URL (used to send events if HTML5 postMessage not implemented).
	 */
	var eventUrl = null;
	
	/**
	 * The parent's event URL (if any).
	 */
	var parentEventUrl = null;
	
	/**
	 * A pointer to the function to raise events.
	 */
	var raiseEventFn;
	
	/**
	 * A map of component IDs to event listener registration queues (in case of registration before component has loaded).
	 */
	var eventListenerRegistrationQueue = new Object();
	
	/**
	 * Static string to hold the register child event URL event name (used by non HTML5 browser to pass child component Event.html location to parent; and also to indicate that the component has loaded).
	 */
	Event.REGISTER_CHILD_EVENT_URL = 'registerChildEventUrl';
	
	/**
	 * Static string to hold the add event listener event name (used to help child components decide if they need to raise events).
	 */
	Event.ADD_EVENT_LISTENER = 'addEventListener';
	
	/**
	 * Static string to hold the name of the event fired when a component has loaded.
	 */
	Event.COMPONENT_LOADED_EVENT_NAME = 'componentLoaded';
	
	/**
	 * Event types.
	 */
	Event.types = {FIRE:0, RAISE:1, INFORM_OF_LISTENER_REGISTRATION:2};
	
	/**
	 * Registers the fire event functionality on the page component.
	 * This helps to make event firing quicker.
	 * 
	 * @param pageComponent The page component.
	 */
	Event.registerFireEventFunctionality = function(pageComponent)
	{
		// Wrap 'fireEvent' function with a first time setup.
		pageComponent.fireEvent = function(eventName, eventProperties)
		{
			// Determine if HTML5 postMessage can be used.
			var oDoc = typeof(pageComponent.componentIFrame.contentWindow) == 'undefined' ? pageComponent.componentIFrame.contentDocument : pageComponent.componentIFrame.contentWindow;
			if (typeof(oDoc.postMessage) != 'undefined')
			{
				// Use HTML 5. Redefine 'fireEvent'.
				pageComponent.fireEvent = function(eventName, eventProperties)
					{
						oDoc.postMessage(createMessageString(Event.types.FIRE, eventName, eventProperties), '*');
					};
			}
			else
			{
				// Use iFrame proxy. Redefine 'fireEvent'.
				pageComponent.fireEvent = function(eventName, eventProperties)
					{
						fireEventViaIFrameProxy(pageComponent, eventName, eventProperties);
					};
			}
			
			// Call the redefined function.
			this.fireEvent(eventName, eventProperties);
		}
	};
	
	/**
	 * Registers the add event listener functionality on the page component.
	 * Also creates a function to invoke event listeners when the event is handled.
	 * 
	 * @param pageComponent The page component.
	 * @param loadedCallback A function to call when the component has loaded.
	 */
	Event.registerAddEventListenerFunctionality = function(pageComponent, loadedCallback)
	{
		pageComponent.eventToListenerFnsMap = new Object();
		pageComponent.addEventListener = function(eventName, listenerFn)
		{
			// Test if event already used.
			var listenerFns = pageComponent.eventToListenerFnsMap[eventName];
			if (typeof(listenerFns) == 'undefined')
			{
				// Create array to hold the listener functions.
				listenerFns = new Array();
				pageComponent.eventToListenerFnsMap[eventName] = listenerFns;
				
				// Inform the component that an event listener has been added.
				informComponentOfEventListenerRegistration(pageComponent, eventName);
			}
			
			// Register the listener function.
			listenerFns[listenerFns.length] = listenerFn;
		};
		pageComponent.invokeEventListeners = function(eventName, eventProperties)
		{
			// Get the listener functions.
			var listenerFns = pageComponent.eventToListenerFnsMap[eventName];
			if (typeof(listenerFns) != 'undefined')
			{
				// Invoke all the listener functions.
				for (var index in listenerFns)
				{
					listenerFns[index](eventProperties);
				}
			}
		};
		if (typeof(loadedCallback) != 'undefined')
		{
			var listenerFns = new Array();
			listenerFns[0] = loadedCallback;
			pageComponent.eventToListenerFnsMap[Event.COMPONENT_LOADED_EVENT_NAME] = listenerFns;
		}
	};
	
	/**
	 * Raises an event.
	 * 
	 * @param sourceId The ID of the component raising the event.
	 * @param eventName The event name.
	 * @param eventProperties The event properties.
	 */
	Event.raise = function(sourceId, eventName, eventProperties)
	{
		if (typeof(eventProperties) == 'undefined')
		{
			eventProperties = null;
		}
		raiseEventFn(sourceId, eventName, eventProperties);
	};
	
	/**
	 * Handles a received message event.
	 * 
	 * @param event The event.
	 */
	Event.onMessage = function(event)
	{
		// Get event JSON.
		var eventType = +(/.*eventType=([^&]*)/.exec(event.data)[1]);
        var eventNameJSON = unescape(/.*eventName=([^&]*)/.exec(event.data)[1]);
        var eventPropertiesJSON = unescape(/.*eventProperties=([^&]*)/.exec(event.data)[1]);
        
        var origin = event.origin;
        if (/:$/.test(origin))
		{
			origin += "//";	// Bloody IE.
		}

        // Invoke event.
        switch (eventType)
        {
        	case Event.types.FIRE:
        		Component.fireEvent(origin, eventNameJSON, eventPropertiesJSON);
        		break;
        	case Event.types.RAISE:
        		var eventSourceIdJSON = unescape(/.*eventSourceId=([^&]*)/.exec(event.data)[1]);
        		handleRaisedEvent(origin, eventSourceIdJSON, eventNameJSON, eventPropertiesJSON);
        		break;
        	case Event.types.INFORM_OF_LISTENER_REGISTRATION:
        		Component.informOfListenerRegistration(origin, eventNameJSON);
        		break;
        }
        
	};
	
	/**
	 * Gets the event URL.
	 * 
	 * @return The event URL.
	 */
	Event.getEventUrl = function()
	{
		if (eventUrl == null)
		{
			var eventUrlMeta = jQuery('meta[name="eventUrl"]')[0];
			if (typeof(eventUrlMeta) != 'undefined')
			{
				// The eventUrl meta exists. Ensure that it has the full domain.
				eventUrl = eventUrlMeta.content;
				var domainSearch = /(http(s)?:\/\/.*?)\//.exec(eventUrl);
				if (domainSearch == null)
				{
					eventUrl = location.protocol + '//' + location.host + eventUrl;
				}
			}
			else
			{
				eventUrl = undefined;
			}
		}
		
		return eventUrl;
	};
	
	/**
	 * Informs the parent of this page's event URL.
	 * 
	 * @param componentId The component ID from which the event is to be raised.
	 */
	Event.informParentOfEventUrl = function(componentId)
	{
		// Check that there is a parent.
		if (parent.location.pathname != location.pathname)
		{
			// Get parent eventUrl.
			var parentEventUrlSearch = /.*parentEventUrl=([^&]*)/.exec(location.search);
        	if (parentEventUrlSearch != null)
        	{
        		parentEventUrl = unescape(parentEventUrlSearch[1]);
        	}
			
        	// Raise the event (even if an event URL has not been defined - this will be used to indicate that the component has loaded).
        	var eventProperties = new Object();
        	eventProperties.eventUrl = Event.getEventUrl();
        	Event.raise(componentId, Event.REGISTER_CHILD_EVENT_URL, eventProperties);
		}
	};
	
	/**
	 * Fires the event using an iFrame proxy.
	 * 
	 * @param pageComponent The page component to send the event to.
	 * @param eventName The event name.
	 * @param eventProperties The event properties.
	 */
	function fireEventViaIFrameProxy(pageComponent, eventName, eventProperties)
	{
		// Get the page component iFrame ID and the event URL.
		var iFrameId = pageComponent.componentIFrame.id;
		var eventUrl = ComponentFactory.getComponentClassMeta(pageComponent.friendlyClassName).eventUrl;
		var src = eventUrl + '?componentIFrameId=' + escape(iFrameId) + '&' + createMessageString(Event.types.FIRE, eventName, eventProperties);

		// Create the iFrame element.
		var newElement = createIFrameElement(iFrameId, src);
		 
        // Place iFrame in DOM.
        jQuery('body').append(newElement);
	}
	
	/**
	 * Raises the event using an iFrame proxy.
	 * 
	 * @param sourceId The ID of the component raising the event.
	 * @param eventName The event name.
	 * @param eventProperties The event properties.
	 */
	function raiseEventViaIFrameProxy(sourceId, eventName, eventProperties)
	{
		// Get the page component iFrame ID and the event URL.
		var src = parentEventUrl + '?' + createMessageString(Event.types.RAISE, eventName, eventProperties, sourceId);
		
		// Create the iFrame element.
		var newElement = createIFrameElement('parent', src);
		 
        // Place iFrame in DOM.
        jQuery('body').append(newElement);
	}
	
	/**
	 * Registers the event listener on the page component.
	 * 
	 * @param pageComponent The page component.
	 * @param eventName The event name.
	 */
	function informComponentOfEventListenerRegistrationViaIFrameProxy(pageComponent, eventName)
	{
		// Get the page component iFrame ID and the event URL.
		var iFrameId = pageComponent.componentIFrame.id;
		var eventUrl = ComponentFactory.getComponentClassMeta(pageComponent.friendlyClassName).eventUrl;
		var src = eventUrl + '?componentIFrameId=' + escape(iFrameId) + '&' + createMessageString(Event.types.INFORM_OF_LISTENER_REGISTRATION, eventName, null);

		// Create the iFrame element.
		var newElement = createIFrameElement(iFrameId, src);

        // Place iFrame in DOM.
        jQuery('body').append(newElement);
	}
	
	/**
	 * Informs a page component that an event listener has been registered against it.
	 * 
	 * @param pageComponent The page component to inform.
	 * @param eventName The event name.
	 */
	function informComponentOfEventListenerRegistration(pageComponent, eventName)
	{
		// Determine if HTML5 postMessage can be used.
		var oDoc = (typeof(pageComponent.componentIFrame.contentWindow) == 'undefined' ||
				typeof(pageComponent.componentIFrame.contentWindow) == 'unknown') ?
						pageComponent.componentIFrame.contentDocument : pageComponent.componentIFrame.contentWindow;
		if (oDoc == null)
		{
			alert("Detected event listener registration (" + eventName + ") before component (" + pageComponent.id + ") was added to DOM.");
			return;
		}
		
		// If the page component has not yet been loaded then queue this task.
		if (!pageComponent.loaded)
		{
			// Page component is not yet ready (this event listener is being registered very soon after creation of page component?)
			var componentListenerRegistrationQueue = eventListenerRegistrationQueue[pageComponent.id];
			if (typeof(componentListenerRegistrationQueue) == 'undefined')
			{
				componentListenerRegistrationQueue = new Array();
				eventListenerRegistrationQueue[pageComponent.id] = componentListenerRegistrationQueue;
			}
			componentListenerRegistrationQueue[componentListenerRegistrationQueue.length] = eventName;
			return;
		}

		if (typeof(oDoc.postMessage) != 'undefined')
		{
			// Use HTML 5.
			oDoc.postMessage(createMessageString(Event.types.INFORM_OF_LISTENER_REGISTRATION, eventName, null), '*');
		}
		else
		{
			// Use iFrame proxy.
			informComponentOfEventListenerRegistrationViaIFrameProxy(pageComponent, eventName);
		}
	}
	
	/**
	 * Creates an iFrame element to carry the event.
	 * 
	 * @param iFrameId The ID of the iFrame for the component.
	 * @param src The src of the new iFrame.
	 * 
	 * @return The new iFrame element.
	 */
	function createIFrameElement(iFrameId, src)
	{
		// Instantiate the event iFrame.
        var iFrameName = 'event_iframe_' + iFrameId;
        var newElement = document.createElement('iframe');
        newElement.id = iFrameName;
        newElement.src = src
        newElement.style.display = 'none';
        
        // Create function to handle load event. This needs to unregister itself (to avoid memory leaks) and remove the iFrame element from the DOM.
        var onLoad = function()
        	{
	       	 	// Unregister this function.
	       	 	if (newElement.removeEventListener)
	       	 	{
	       	 		newElement.removeEventListener('load', arguments.callee, false);
	       	 	}
	       	 	else if (newElement.detachEvent)	// Bloody IE!
	       	 	{
	       	 		newElement.detachEvent('onload', arguments.callee);
	       	 	}
	       	 	
	 	    	// Remove the iFrame.
	     	 	document.body.removeChild(newElement)
	 		};
	 		 
	 	// Register load event.
        if (newElement.addEventListener)
        {
        	newElement.addEventListener('load', onLoad, false);
        }
        else if (newElement.attachEvent)	// Bloody IE!
        {
        	newElement.attachEvent('onload', onLoad);
        }
        
        return newElement;
	}
	
	/**
	 * Creates the message string.
	 * 
	 * @param eventType The event type.
	 * @param eventName The event name.
	 * @param eventProperties The event properties.
	 * @param sourceId The ID of the component raising the event.
	 * 
	 * @return The message string.
	 */
	function createMessageString(eventType, eventName, eventProperties, sourceId)
	{
		return 'eventType=' + JSON.stringify(eventType) + '&eventName=' + escape(JSON.stringify(eventName)) +
			'&eventProperties=' + escape((typeof(eventProperties) != 'undefined' ? JSON.stringify(eventProperties) : JSON.stringify(null))) +
			(typeof(sourceId) != 'undefined' ? '&eventSourceId=' + escape(JSON.stringify(sourceId)) : '');
	}
	
	/**
	 * Handles raised events.
	 * 
	 * @param origin The origin of the event.
	 * @param eventSourceIdJSON The ID JSON of the event source.
	 * @param eventNameJSON The event name JSON.
	 * @param eventPropertiesJSON
	 * @return
	 */
	function handleRaisedEvent(origin, eventSourceIdJSON, eventNameJSON, eventPropertiesJSON)
	{
		// Convert JSON to object.
		var eventSourceId = JSON.parse(eventSourceIdJSON);
		var eventName = JSON.parse(eventNameJSON);
		var eventProperties = JSON.parse(eventPropertiesJSON);
		
		// Get the page component and check that the event origin matches the component origin.
		var pageComponent = ComponentFactory.getPageComponent(eventSourceId);
		var classMeta = ComponentFactory.getComponentClassMeta(pageComponent.friendlyClassName);
		var originAccordingToSourceId = classMeta.origin;
		
		if (origin == originAccordingToSourceId)
		{
			if (eventName == Event.REGISTER_CHILD_EVENT_URL)
			{
				// This is a register child event URL event.
				classMeta.eventUrl = eventProperties.eventUrl;
				pageComponent.loaded = true;	// Indicate that the component has been loaded.

				// Register any queued event listeners.
				if (typeof(eventListenerRegistrationQueue[pageComponent.id]) != 'undefined')
				{
					var componentListenerRegistrationQueue = eventListenerRegistrationQueue[pageComponent.id];
					for (var index=0; index < componentListenerRegistrationQueue.length; index++)
					{
						informComponentOfEventListenerRegistration(pageComponent, componentListenerRegistrationQueue[index]);
					}
					eventListenerRegistrationQueue[pageComponent.id] = new Array();	// Reset.
				}
				
				// Inform registered listeners that component has loaded.
				var componentLoadedEventProperties = new Object();
				componentLoadedEventProperties.pageComponentId = pageComponent.id;
				pageComponent.invokeEventListeners(Event.COMPONENT_LOADED_EVENT_NAME, componentLoadedEventProperties);
			}
			else
			{
				// This event is to be sent to all registered listeners.
				pageComponent.invokeEventListeners(eventName, eventProperties);
			}
		}
	}
	
	/**
	 * Determine if HTML5 postMessage can be used to raise events and set suitable function on raiseEventFn.
	 * This helps to make event firing quicker.
	 */
	var oDoc = parent.postMessage ? parent : parent.document;
	if (typeof(oDoc.postMessage) != 'undefined')
	{
		// Use HTML 5.
		raiseEventFn = function(sourceId, eventName, eventProperties)
			{
				oDoc.postMessage(createMessageString(Event.types.RAISE, eventName, eventProperties, sourceId), '*');
			};
	}
	else
	{
		// Use iFrame proxy.
		raiseEventFn = function(sourceId, eventName, eventProperties)
			{
				raiseEventViaIFrameProxy(sourceId, eventName, eventProperties);
			}
	}
	delete oDoc;
	
	/**
	 * Attach the HTML5 message receive event handler.
	 */ 
    if (window.addEventListener)
    {
    	window.addEventListener('message', Event.onMessage, false);
    }
    else if (window.attachEvent)	// Bloody IE!
    {
    	window.attachEvent('onmessage', Event.onMessage);
    }
}
