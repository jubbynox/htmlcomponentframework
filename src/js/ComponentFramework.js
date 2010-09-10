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

// Initialise the component framework.
ComponentFramework();

function ComponentFramework()
{
	/**
	 * Loads and renders all components on the page.
	 */
	ComponentFramework.loadAndRender = function()
	{
		ComponentFactory.loadAndRender();
	};
	
	/**
	 * Includes a component.
	 * 
	 * @param friendlyClassName The friendly class name to use.
	 * @param url The URL of the component class.
	 */
	ComponentFramework.includeComponent = function(friendlyClassName, url)
	{
		ComponentFactory.loadComponentClassMeta(friendlyClassName, url);
	};
	
	/**
	 * Gets the component for the specified component ID.
	 * 
	 * @param componentId The component ID.
	 * 
	 * @return The component.
	 */
	ComponentFramework.getComponent = function(componentId)
	{
		return ComponentFactory.getPageComponent(componentId);
	};
	
	/**
	 * Creates a new component.
	 * 
	 * @param componentId The new component ID.
	 * @param friendlyClassName The page component friendly class name.
	 * @param parameters A map of constructor parameter names to values.
	 * @param loadedCallback A function to call when the component has loaded.
	 * 
	 * @return The component or null if componentId is already in use.
	 */
	ComponentFramework.newComponent = function(componentId, friendlyClassName, parameters, loadedCallback)
	{
		return ComponentFactory.newComponent(componentId, friendlyClassName, parameters, loadedCallback);
	};
	
	/**
	 * Raises an event.
	 * The event bubbles up to the parent component.
	 * 
	 * @param eventName The event name.
	 * @param eventProperties The event properties.
	 */
	ComponentFramework.raiseEvent = function(eventName, eventProperties)
	{
		Component.raiseEvent(eventName, eventProperties);
	};
	
	/**
	 * Removes the specified component.
	 * 
	 * @param componentId The component ID.
	 */
	ComponentFramework.removeComponent = function(componentId)
	{
		ComponentFactory.removeComponent(componentId);
	};
}