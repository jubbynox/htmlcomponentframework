function HelloWorldComponent()
{
	jQuery('#hideGreetingButton').click(function(){hideGreeting();});
	
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