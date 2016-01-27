var app = (function()
{
	var beacons = {};
	var listBeacons = {};
	var updateTimer = null;	
	var check = true;
	var beaconIDs = [];
	
	function onDeviceReady()
	{
		window.estimote = EstimoteBeacons;
		startScan();
		updateTimer = setInterval(displayBeaconList, 1000);
		setInterval(startScan2, 1000);
	}

	function startScan()
	{
		function onBeaconsRanged(beaconInfo)
		{
			for (var i in beaconInfo.beacons)
			{
				var beacon = beaconInfo.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
			}
		}

		function onError(errorMessage)
		{
			console.log('Ranging beacons did fail: ' + errorMessage);
		}		
		
		estimote.requestAlwaysAuthorization();
		estimote.startRangingBeaconsInRegion( {}, onBeaconsRanged, onError);		
	}
	
	function startScan2()
	{
		function onBeaconsRanged(beaconInfo)
		{
			console.log(beaconInfo.beacons[i].major);
			for (var i in beaconInfo.beacons)
			{
				var beacon = beaconInfo.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
			}
		}
	}

	function assignBeacon()
	{	
		$.each(beacons, function(key, beacon) 
		{
			if(!listBeacons.hasOwnProperty(beacon.major)){
				if(beacon.major) listBeacons[String(beacon.major)] = 0; 
			}
		});
	} 
	
	function displayBeaconList()
	{			
		assignBeacon();
	
		$.each(beacons, function(key, beacon) 
		{
			if (!beacon.distance) { return; }
		
			if (beacon.distance < 1 && beacon.distance > 0) { 
				if(listBeacons.hasOwnProperty(beacon.major)){
					listBeacons[beacon.major] = listBeacons[beacon.major] + 1;
				}
			}
			else if (beacon.distance > 1) { 
				if(listBeacons.hasOwnProperty(beacon.major)){
					listBeacons[beacon.major] = 0;
				}
			}
			else { ; }
			
			if (listBeacons[beacon.major]  == 5) {
				listBeacons[beacon.major]  = 0;
				//document.getElementById('sms').play();
				alert(messageBox(beacon.major));
			}
		});
		
		//function play_single_sound() { document.getElementById('sms').play(); }

		function messageBox(beaconMajor) {
			if (beaconMajor == '46983' && !$.inArray(beaconMajor, beaconIDs)) {	
					beaconIDs.push(beaconMajor);	
					return '20% discount for our new shoes!';
			}
			else if (beaconMajor == '41594' && !$.inArray(beaconMajor, beaconIDs)) {		
					beaconIDs.push(beaconMajor);	
					return 'Special promotion for this shirt: 5€ lower price';
			} 
			else if (beaconMajor == '31115' && !$.inArray(beaconMajor, beaconIDs)) {		
					beaconIDs.push(beaconMajor);	
					return '15% rabate for this pair of jeans!';
			}
			else {
					return 'New promotion';
			}			
		}		
	}
	
	return app;
})();