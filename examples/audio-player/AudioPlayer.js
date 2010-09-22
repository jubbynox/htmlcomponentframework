jQuery(window).load(function()
{
	ComponentFramework.loadAndRender();
	jQuery('#addTrackButton').click(addTrack);
});

function addTrack()
{
	var eventProperties = new Object();
	eventProperties.albumImgUrl = jQuery('#albumImgUrlId').val();
	eventProperties.albumName = jQuery('#albumNameId').val();
	eventProperties.trackNumber = jQuery('#trackNumberId').val();
	eventProperties.trackName = jQuery('#trackNameId').val();
	eventProperties.trackUrl = jQuery('#trackUrlId').val();
	ComponentFramework.getComponent('audioPlayerComponentId').fireEvent('add', eventProperties);
}