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

// Create ComponentFactory static class members.
ComponentFactory();

/**
 * Component factory static class.
 */
function ComponentFactory()
{	
	// The component class friendly name map.
	var componentClassNameMap = new Object();
	
	// A map of page component IDs to page component objects.
	var pageComponentMap = new Object();
	
	// The last component ID number.
	var lastComponentIFrameIDNum = 0;
	
	/**
	 * Loads and renders all components on the page.
	 * 
	 * @param parentClassNames An array of parent component class names (if any).
	 */
	ComponentFactory.loadAndRender = function(parentClassNames)
	{
		// Load classes.
		loadClasses();
		
		// Render components.
		renderComponents(parentClassNames);
	};
	
	/**
	 * Gets the page component for the specified page component ID.
	 * 
	 * @param pageComponentId The page component ID.
	 */
	ComponentFactory.getPageComponent = function(pageComponentId)
	{
		return pageComponentMap[pageComponentId];
	};
	
	/**
	 * Gets the component class meta for the specified page component friendly class name.
	 * 
	 * @param pageComponentFriendlyClassName The page component friendly class name.
	 */
	ComponentFactory.getComponentClassMeta = function(pageComponentFriendlyClassName)
	{
		return componentClassNameMap[pageComponentFriendlyClassName];
	};
	
	/**
	 * Creates a new component.
	 * 
	 * @param componentId The new component ID.
	 * @param friendlyClassName The page component friendly class name.
	 * @param parameters A map of constructor parameter names to values.
	 * @param loadedCallback A function to call when the component has loaded.
	 * 
	 * @return The component, or null if the componentId is already in use.
	 */
	ComponentFactory.newComponent = function(componentId, friendlyClassName, parameters, loadedCallback)
	{
		// Test that componentId has not already been used and the component class meta is valid.
		var componentClassMeta = componentClassNameMap[friendlyClassName];
		if (typeof(pageComponentMap[componentId]) == 'undefined' && typeof(componentClassMeta) != 'undefined')
		{
			return createComponent(componentId, friendlyClassName, componentClassMeta, parameters, new Array(), loadedCallback);
		}
		else
		{
			// Component ID already used.
			return null;
		}
	};
	
	/**
	 * Loads component class meta.
	 * 
	 * @param friendlyClassName The friendly class name to use.
	 * @param url The URL of the component class.
	 */
	ComponentFactory.loadComponentClassMeta = function(friendlyClassName, url)
	{
		addClassMeta(friendlyClassName, url);
	};
	
	/**
	 * Removes the specified component.
	 * 
	 * @param componentId The component ID.
	 */
	ComponentFactory.removeComponent = function(componentId)
	{
		var pageComponent = pageComponentMap[componentId];
		delete pageComponentMap[componentId];
		delete pageComponent;
	};
	
	/**
     * Loads all the component classes on the page.
     */
    function loadClasses()
    {
    	// Iterate over each include statement.
    	jQuery('meta[name="includeComponent"]').each(
            function()
            {
            	// Get the include class definition.
            	var definition = JSON.parse(this.content);
            	
            	// Create the class meta.
            	addClassMeta(definition.name, definition.url);
            });
    }
    
    /**
     * Adds class meta to componentClassNameMap.
     * 
     * @param name The friendly name of the class.
     * @param url The component class URL.
     */
    function addClassMeta(name, url)
    {
    	var classMeta = new Object();
        classMeta.friendlyName = name;
        classMeta.url = url;
        var originSearch = /(http(s)?:\/\/.*?)\//.exec(url);
    	classMeta.origin = originSearch != null ? originSearch[1] : location.protocol + '//' + location.host;
        
        // Store class meta, if not already done so.
        if (typeof(componentClassNameMap[classMeta.friendlyName]) == 'undefined')
        {
            componentClassNameMap[classMeta.friendlyName] = classMeta;
        }
    }
	
	/**
	 * Renders the components on the page.
	 * 
	 * @param parentClassNames An array of parent component class names (if any).
	 */
	function renderComponents(parentClassNames)
	{
		if (typeof(parentClassNames) == 'undefined')
		{
			// Make sure there is an array to hold the parent class names.
			parentClassNames = new Array();
		}
		
		// Iterate over each component to instantiate.
		jQuery('div.cf_component_marker').each(
            function(index)
            {
            	// Check that the friendly name has been defined.
            	var componentClass = componentClassNameMap[this.title];
            	if (typeof(componentClass) == 'undefined')
            	{
            		// Friendly name has not been defined.
            		// TODO: Update component with ? picture?
            		return;
            	}

            	// Convert the DOM element to a jQuery element.
                var componentElement = jQuery(this);
                			
                // Get the parameters.
                var parameters = new Object();
                var loadedCallback;
	            componentElement.find('input').each(
	                function()
	                {
	                	// Check for loaded callback.
	                	if (this.name == 'loadedCallback')
	                	{
	                		loadedCallback = eval(this.value);
	                	}
	                	else
	                	{
	                        // Add parameter and value.
	                        if (/^[{\[].*[}\]]$/.test(this.value))
	                        {
	                        	// The value is a JSON string.
	                        	parameters[this.name] = JSON.parse(this.value);
	                        }
	                        else
	                        {
	                        	// The value is a literal string.
	                            parameters[this.name] = this.value;
	                        }
	                	}
	                });
            
	            // Check for infinite recursion.
	            if (hierarchyCheck(componentClass, parentClassNames))
	            {
	                // Instantiate the component.
	            	componentElement.append(createComponent(this.id, this.title, componentClass, parameters, parentClassNames, loadedCallback).getElement());
	            }
	            else
	            {
	            	// Infinite recursion detected!
	            	componentElement.addClass('cf_error_infinite_recursion');
	            }
            });
	}
	
	/**
	 * Checks for infinite recursion.
	 * 
	 * @param componentClass The component class to look for.
	 * @param parentClassNames The parent component class names.
	 * 
	 * @return true if the hierarchy is OK.
	 */
	function hierarchyCheck(componentClass, parentClassNames)
	{
	    var retVal = true;
	    
	    // Get the full class name.
	    var className = /\/([^\/\.]+)\.[^\/]+$/.exec(componentClass.url)[1];
	    
	    // Iterate over the parent class names.
	    for (var index in parentClassNames)
	    {
	        if (className == parentClassNames[index])
	        {
	            // This class name has appeared before in the hierarchy. Continuing would cause infinite recursion.
	            retVal = false;
	            break;
	        }
	    }
	    
	    return retVal;
	}
	
	/**
	 * Creates the component.
	 * 
	 * @param componentId The component ID.
	 * @param friendlyClassName The friendly class name of the component.
	 * @param componentClassMeta The component class meta.
	 * @param parameters The constructor parameters (map of parameter name to value).
	 * @param parentClassNames Array of parent component class names.
	 * @param loadedCallback A function to call when the component has loaded.
	 * 
	 * @return The component.
	 */
	function createComponent(componentId, friendlyClassName, componentClassMeta, parameters, parentClassNames, loadedCallback)
	{
        // Instantiate the component.
        var iFrameName = 'cf_iframe' + lastComponentIFrameIDNum++;
        var newElement = document.createElement('iframe');
        newElement.id = iFrameName;
        newElement.src = componentClassMeta.url + '?parameters=' + escape(JSON.stringify(parameters)) + '&parentClassNames=' + escape(parentClassNames.join(',')) +
        	'&origin=' + escape(location.protocol) + '//' + escape(location.host) +
        	'&id=' + escape(componentId) +
        	(Event.getEventUrl() != undefined ? '&parentEventUrl=' + escape(Event.getEventUrl()) : '');
        newElement.frameBorder = '0';
        newElement.className = 'cf_iframe';
        newElement.allowTransparency = "true";
        
        // Setup pageComponent object. Update list of page components.
        var pageComponent = new Object();
        pageComponent.id = componentId;
        pageComponent.componentIFrame = newElement;
        pageComponent.friendlyClassName = friendlyClassName;
        pageComponent.loaded = false;
        pageComponent.getElement = function(self)
        	{
        		return function()
        		{
        			return self.componentIFrame;
        		};
        	}(pageComponent);
        pageComponentMap[componentId] = pageComponent;
        Event.registerFireEventFunctionality(pageComponent);	// Add event firing functionality to this component.
        Event.registerAddEventListenerFunctionality(pageComponent, loadedCallback);	// Add event listening functionality to this component.
        
        return pageComponent;
	}
};