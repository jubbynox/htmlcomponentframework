jQuery(window).load(function()
{
	ComponentFramework.loadAndRender();
	jQuery('#greetWorldButton').click(greetWorld);
});

function helloWorldComponentLoaded()
{
	ComponentFramework.getComponent('helloWorldComponentId').addEventListener("greetingHidden", greetingHidden);
}

function greetWorld()
{
	jQuery('#greetWorldButton').hide();
	ComponentFramework.getComponent('helloWorldComponentId').fireEvent('greetWorld');
}

function greetingHidden()
{
	jQuery('#greetWorldButton').show();
}