function HelloWorldComponent()
{
	jQuery('#hideGreetingButton').click(hideGreeting);
	
	this.greetWorld = function()
	{
		jQuery('#togglePanel').show();
	}
	
	function hideGreeting()
	{
		jQuery('#togglePanel').hide();
		ComponentFramework.raiseEvent("greetingHidden");
	}
}