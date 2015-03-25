jQuery(window).load(function()
{
	ComponentFramework.loadAndRender();
});

var data =
{
	car1:
	{
		id: "car1",
		name: "Pre-war prototype",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Citroen2CV_prototype.JPG/220px-Citroen2CV_prototype.JPG",
		imgHeightToWidthRatio: 220/165,
		description: "1939: TPV (Toute Petite Voiture—\"Very Small Car\")<br> Design brief: low-priced, rugged \"umbrella on four wheels\" that would enable two peasants to drive 100 kg (220 lb) of farm goods to market at 60 km/h (37 mph), in clogs and across muddy unpaved roads if necessary; 3 L of gasoline to travel 100 km (78 MPG); able to drive across a ploughed field without breaking carried eggs."
	},
	car2:
	{
		id: "car2",
		name: "First generation \"Ripple Bonnet\"",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Citroen2cvtff.jpg/220px-Citroen2cvtff.jpg",
		imgHeightToWidthRatio: 220/149,
		description: "1949-1960: \"Ripple Bonnet\""
	},
	car3:
	{
		id: "car3",
		name: "Sahara",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Citro%C3%ABn_2CV-4x4.JPG/220px-Citro%C3%ABn_2CV-4x4.JPG",
		imgHeightToWidthRatio: 220/165,
		description: "1960-1971: Sahara. Built for very difficult off-road driving.<br>Extra engine mounted in the rear compartment and both front and rear wheel traction."
	},
	car4:
	{
		id: "car4",
		name: "1967 Export Model",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Export_67.jpg/220px-Export_67.jpg",
		imgHeightToWidthRatio: 220/165,
		description: "1967: Export Model with 1960-on bonnet and many period accessories."
	},
	car5:
	{
		id: "car5",
		name: "1970 Model",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/9/98/2cv-red.jpg/220px-2cv-red.jpg",
		imgHeightToWidthRatio: 220/165,
		description: "1970: the flat-2 engine size was increased to 602 cc (36.7 cu in) and the car gained rear light units.<br>Standardised a third side window in the rear pillar on 2CV6 (602 cc) models.<br>All 2CVs from this date can run on unleaded fuel. 1970s cars featured rectangular headlights."
	},
	car6:
	{
		id: "car6",
		name: "Charleston",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/2cv_charleston_helios_noir.jpg/220px-2cv_charleston_helios_noir.jpg",
		imgHeightToWidthRatio: 220/147,
		description: "1981: The Charleston - inspired by Art-Deco style 1920s Citroën model colour schemes."
	},
	car7:
	{
		id: "car7",
		name: "007",
		imgUrl: "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/2cv_007.jpg/220px-2cv_007.jpg",
		imgHeightToWidthRatio: 220/156,
		description: "1981: 007 - in association with the James Bond film <a href=\"http://www.youtube.com/watch?v=CvJp1X3qiog\">For Your Eyes Only</a>"
	}
};

function carouselComponentLoaded()
{
	var carousel = ComponentFramework.getComponent('carouselId');
	carousel.addEventListener("itemSelected", itemSelected);
	
	for (car in data)
	{
		var eventProperties = new Object();
		eventProperties.id = data[car].id;
		eventProperties.name = data[car].name;
		eventProperties.imgUrl = data[car].imgUrl;
		eventProperties.imgHeightToWidthRatio = data[car].imgHeightToWidthRatio;
		carousel.fireEvent('addItem', eventProperties);
	}
	
}

function itemSelected(eventProperties)
{
	jQuery('#descriptionId').html(data[eventProperties.id].description);
}