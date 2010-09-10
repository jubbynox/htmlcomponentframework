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

// Create Component static class members.
Component();

/**
 * Component static class.
 */
function Component()
{
	// The constructor parameter types.
	var constructorDefinition = new Object();
	
	// The events that can be accepted (from parent component).
	var acceptableEvents = new Object();
	
	// The events that can be raised.
	var raisableEvents = new Object();
	
	// An object to store TRUE against event names that have listeners registered. 
	var listenersRegisteredForEvent = new Object();
	
	// Define scope of component object.
	var component;
	
	// The origin (creator) of this component.
	var origin;
	
	// The ID of this component.
	var componentId;
	
	/**
	 * Renders the component.
	 */
	Component.render = function()
	{
		// Indicate that the component is loading.
        jQuery('body').addClass('cf_loading');
        
		// Load the constructor parameter types.
        loadMetaData('constructor', constructorDefinition);

        // Validate the constructor parameters.
        var response = validateConstructorParameters();
        
        if (response.valid)
        {
        	// The constructor parameters were valid.
            // Load the events that can be accepted from a parent component.
            loadMetaData('acceptsEvent', acceptableEvents);
            
            // Load the events that can be raised up to a parent component.
            loadMetaData('raisesEvent', raisableEvents);
        	
            // Get the class name hierarchy.
            var classNameHierarchy = getClassNameHierarchy();

        	// Load and render any child components.
            ComponentFactory.loadAndRender(classNameHierarchy);

            // Create instance of this component.
            var constructorParameterString = createSignatureParamString('response.constructorParameters', constructorDefinition.properties);
            var className = classNameHierarchy[classNameHierarchy.length-1];
            eval('if (typeof(' + className + ') != "undefined") component = new ' + className + constructorParameterString + ';');
            if (typeof(component) != 'undefined')
            {
            	// Get the component origin and ID.
            	var originSearch = /.*origin=([^&]*)/.exec(location.search);
            	if (originSearch != null)
            	{
            		origin = unescape(originSearch[1]);
            	}
            	var componentIdSearch = /.*id=([^&]*)/.exec(location.search);
            	if (componentIdSearch != null)
            	{
            		componentId = unescape(componentIdSearch[1]);
            	}
            	
	            // Register the events against the component.
	            response = registerAcceptableEvents(component);
	            if (!response.success)
	            {
	            	// Some or all of the events were not defined on the component.
	            	logErrors(response.errors);
	            }
	            
	            // Inform parent of this component's event URL.
	            Event.informParentOfEventUrl(componentId);
            }
        }
        else
        {
        	// The constructor parameters were not valid.
        	logErrors(response.errors);
        }
        
        // Indicate that the component has finished loading.
        jQuery('body').removeClass('cf_loading');
	};
	
	/**
	 * Fires the event described in eventJSON.
	 * 
	 * @param eventOrigin The origin of the event.
	 * @param eventNameJSON The event name JSON.
	 * @param eventPropertiesJSON The event properties JSON.
	 */
	Component.fireEvent = function(eventOrigin, eventNameJSON, eventPropertiesJSON)
	{
		// Test that the message event origin matches the component origin.
		if (origin == eventOrigin)
		{
			// Convert JSON to object.
			var eventName = JSON.parse(eventNameJSON);
			var eventProperties = JSON.parse(eventPropertiesJSON);
			
			// Check event exists.
			if (typeof(acceptableEvents[eventName]) != 'undefined')
			{
				// Check event properties against schema.
				var response = JSONSchema.validate(eventProperties, acceptableEvents[eventName]);
				
				// Invoke method on object if properties are valid.
				if (response.valid)
				{
					acceptableEvents[eventName].componentReference(eventProperties);
				}
			}
		}
	};
	
	/**
	 * Informs the component of event listener registration. This is so that it needn't raise events for which listeners have not been added.
	 * 
	 * @param eventOrigin The origin of the event.
	 * @param eventNameJSON The event name JSON.
	 */
	Component.informOfListenerRegistration = function(eventOrigin, eventNameJSON)
	{
		// Test that the message event origin matches the component origin.
		if (origin == eventOrigin)
		{
			// Convert JSON to object.
			var eventName = JSON.parse(eventNameJSON);
			if (typeof(raisableEvents[eventName]) != 'undefined')
			{
				// This event is raisable by the component.
				listenersRegisteredForEvent[eventName] = true;
			}
		}
	};
	
	/**
	 * Raises an event.
	 * 
	 * @param eventName The event name.
	 * @param eventProperties The event properties.
	 */
	Component.raiseEvent = function(eventName, eventProperties)
	{
		// Check that event is allowed to be raised and that there are event handlers registered against it.
		if (typeof(raisableEvents[eventName]) != 'undefined' && listenersRegisteredForEvent[eventName])
		{
			// TODO Check event properties against schema.
			Event.raise(componentId, eventName, eventProperties);
		}
	};
	
	/**
	 * Loads meta data into the meta object for the specified meta name.
	 * 
	 * @param metaName The meta data name to load.
	 * @param metaObject The meta object to insert the data into.
	 */
	function loadMetaData(metaName, metaObject)
	{
		// Iterate over each relevant meta element.
		jQuery('meta[name="' + metaName + '"]').each(
            function()
            {
                var metaElement = JSON.parse(this.content);

            	for (var metaItemName in metaElement)
            	{
            		metaObject[metaItemName] = metaElement[metaItemName];
            	}
            });
	}
	
	/**
	 * Gets the component class name hierarchy (including this class).
	 * 
	 * @return An array of component class names.
	 */
	function getClassNameHierarchy()
	{
		// Get this class name.
        var className = /\/([^\/\.]+)\.[^\/]+$/.exec(location.pathname)[1];
        
        // Get the parent class names.
        var classNameHierarchy;
        var parentClassNamesMatch = /.*parentClassNames=([^&]*)/.exec(location.search);
        if (parentClassNamesMatch == null || parentClassNamesMatch.length < 2)
        {
            // This is the first component in a hierarchy.
            classNameHierarchy = new Array();
        }
        else
        {
            // This is a child of a component hierarchy.
            classNameHierarchy = unescape(parentClassNamesMatch[1]).split(',');
        }
        
        // Add this class name to the component class name hierarchy.
        classNameHierarchy[classNameHierarchy.length] = className;
        
        return classNameHierarchy;
	}
	
	/**
	 * Validates the constructor parameters.
	 * 
	 * @return Validated constructor parameters within a response object: object is response from JSONSchema.validate + .constructorParameters
	 */
	function validateConstructorParameters()
	{
		// Get the constructor parameters.
        var jsonConstructorParams;
        var constructorParametersMatch = /.*parameters=([^&]*)/.exec(location.search);
        if (constructorParametersMatch == null || constructorParametersMatch.length < 2
        		|| typeof(constructorDefinition.properties) == 'undefined')
        {
        	// There are no constructor parameters or a constructor has not been defined for this component.
    		return JSON.parse('{"valid": true, "constructorParameters": {}}');
        }
        else
        {
            jsonConstructorParams = unescape(constructorParametersMatch[1]);
        }
        var constructorParameters = JSON.parse(jsonConstructorParams);
        
        // Iterate through all the constructor parameters, building a list of those that are valid.
        for (var constructorParameterName in constructorParameters)
        {
        	// Get the required parameter info.
        	var paramInfo = constructorDefinition.properties[constructorParameterName];
        	if (typeof(paramInfo) == 'undefined')
        	{
        		// This parameter is not expected. Delete it.
        		delete constructorParameters[constructorParameterName];
        	}
        }
        
        // Parse against schema and add constructor parameters.
        var response = JSONSchema.validate(constructorParameters, constructorDefinition);
        response.constructorParameters = constructorParameters;
        return response;
	}
	
	/**
	 * Registers the acceptable events against the component object.
	 * 
	 * @param component The component object.
	 * 
	 * @return Response: {"success":{"type":"boolean"}, "error":{"type":"array", "items":{"type":"object","properties":{"property" ..... can't be bothered.
	 */
	function registerAcceptableEvents(component)
	{
		var response = new Object();
		response.success = true;
		response.errors = new Array();

		for (var eventName in acceptableEvents)
		{
			if (typeof(component[eventName]) != 'undefined')
			{
				// Link the component member to the event.
				var parameterString = createSignatureParamString('parameters', acceptableEvents[eventName].properties);
				var componentReference;
				eval('componentReference = function(parameters){component.' + eventName + parameterString + ';}');
				acceptableEvents[eventName].componentReference = componentReference;
			}
			else
			{
				// The event has not been setup on the component object.
				delete acceptableEvents[eventName];
				response.success = false;
				var error = new Object();
				error.property = eventName;
				error.message = "The event has not been defined on the component.";
				response.errors[response.errors.length] = error;
			}
		}
		
		return response;
	}
	
	/**
	 * Creates a signature (method or constructor) parameter string (to be used in an eval function).
	 * 
	 * @param signatureParametersObjectName The name of the object that points to the parameters to use.
	 * @param expectedParameters The name of the object that points to a JSON schema of the expected parameters.
	 * 
	 * @return The parameter signature as a string.
	 */
	function createSignatureParamString(signatureParametersObjectName, expectedParameters)
	{
		var paramString = '(';
		
		// Iterate through the defined parameters.
		for (var parameterName in expectedParameters)
		{
			paramString += signatureParametersObjectName + '.' + parameterName + ',';
		}
		if (paramString.length > 1)
		{
			paramString = paramString.substring(0, paramString.length-1);
		}
		paramString += ')';
		
		return paramString;
	}
	
	/**
	 * Logs an array of errors.
	 * 
	 * @param errors The array of errors: ["property":{"type":"string"},"message":{"type":"string"}]
	 */
	function logErrors(errors)
	{
		jQuery('body').html('');
    	jQuery('body').addClass('cf_error_construction');
    	var errorHtml = '<div class="cf_error_construction">';
    	for (var index=0; index<errors.length; index++)
    	{
    		errorHtml += '<div class="error">' + errors[index].property + ' ' + errors[index].message + '</div>';
    	}
    	errorHtml += '</div>';
    	jQuery('body').append(errorHtml);
	}
}


// Determine if this is a component.
var componentMeta = jQuery('meta[name="HTMLComponent"]')[0];
var isComponent = typeof(componentMeta) != 'undefined';

// If this is a component then render it and all its children using the "onload" event.
if (isComponent)
{
    // Append function to onload event to either instantiate the component or pass it to the container node's parent.
	window.onload = function()
	{
		// Setup this component.
		Component.render();
    }
}