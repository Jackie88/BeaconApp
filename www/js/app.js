/**
 * Created by rober on 04.04.2015.
 */
var app = (function () {
  // Application object.
  var app = {}

  // History of enter/exit events.
  var mRegionEvents = []

  // Nearest ranged beacon.
  var mNearestBeacon = null

  mNearestBeacon = {
    uuid: 1,
    major: 11,
    proximity: 2,
    accuracy: 99,
    rssi: 1
  }
  // Timer that displays nearby beacons.
  var mNearestBeaconDisplayTimer = null

  // Background flag.
  var mAppInBackground = false

  // Background notification id counter.
  var mNotificationId = 0

  // Mapping of region event state names.
  // These are used in the event display string.
  var mRegionStateNames = {
    'CLRegionStateInside': 'Enter',
    'CLRegionStateOutside': 'Exit'
  }

  // Here monitored regions are defined.
  // TODO: Update with uuid/major/minor for your beacons.
  // You can add as many beacons as you want to use.
  var mRegions = [
    {
      id: 'region1',
      uuid: 'b9407f30-f5f8-466e-aff9-25556b57fe6d',
      major: 2510,
      minor: 30783
    },
    {
      id: 'region2',
      uuid: 'b9407f30-f5f8-466e-aff9-25556b57fe6d',
      major: 42572,
      minor: 35852
    },
    {
      id: 'region3',
      uuid: 'b9407f30-f5f8-466e-aff9-25556b57fe6d',
      major: 6679,
      minor: 57467
    }
  ]

  // Region data is defined here. Mapping used is from
  // region id to a string. You can adapt this to your
  // own needs, and add other data to be displayed.
  // TODO: Update with major/minor for your own beacons.
  var mRegionData = {
    'region1': 'Region One',
    'region2': 'Region Two',
    'region3': 'Region Three'
  }

  app.initialize = function () {

    document.addEventListener('deviceready', onDeviceReady, false)
    document.addEventListener('pause', onAppToBackground, false)
    document.addEventListener('resume', onAppToForeground, false)
  }

  function onDeviceReady () {
    startMonitoringAndRanging()
    startNearestBeaconDisplayTimer()
  }

  function onAppToBackground () {
    mAppInBackground = true
    stopNearestBeaconDisplayTimer()
  }

  function onAppToForeground () {
    mAppInBackground = false
    startNearestBeaconDisplayTimer()
  }

  function startNearestBeaconDisplayTimer () {
    // display nearest beeacon every 5 sec
    mNearestBeaconDisplayTimer = setInterval(displayNearestBeacon, 5000)
  }

  function stopNearestBeaconDisplayTimer () {
    clearInterval(mNearestBeaconDisplayTimer)
    mNearestBeaconDisplayTimer = null
  }

  function startMonitoringAndRanging () {
    function onDidDetermineStateForRegion (result) {
      saveRegionEvent(result.state, result.region.identifier)
      displayRecentRegionEvent()
    }

    function onDidRangeBeaconsInRegion (result) {
      updateNearestBeacon(result.beacons)
    }

    function onError (errorMessage) {
      console.log('Monitoring beacons did fail: ' + errorMessage)
    }

    // Request permission from user to access location info.
    cordova.plugins.locationManager.requestAlwaysAuthorization()

    // Create delegate object that holds beacon callback functions.
    var delegate = new cordova.plugins.locationManager.Delegate()
    cordova.plugins.locationManager.setDelegate(delegate)

    // Set delegate functions.
    delegate.didDetermineStateForRegion = onDidDetermineStateForRegion
    delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion

    // Start monitoring and ranging beacons.
    startMonitoringAndRangingRegions(mRegions, onError)
  }

  function startMonitoringAndRangingRegions (regions, errorCallback) {
    // Start monitoring and ranging regions.
    for (var i in regions) {
      startMonitoringAndRangingRegion(regions[i], errorCallback)
    }
  }

  function startMonitoringAndRangingRegion (region, errorCallback) {
    // Create a region object.
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
      region.id,
      region.uuid,
      region.major,
      region.minor)

    // Start ranging.
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
      .fail(errorCallback)
      .done()

    // Start monitoring.
    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
      .fail(errorCallback)
      .done()
  }

  function saveRegionEvent (eventType, regionId) {
    // Save event.
    mRegionEvents.push(
      {
        type: eventType,
        time: getTimeNow(),
        regionId: regionId
      })

    // Truncate if more than ten entries.
    if (mRegionEvents.length > 10) {
      mRegionEvents.shift()
    }
  }

  function getBeaconId (beacon) {
    return beacon.uuid + ':' + beacon.major + ':' + beacon.minor
  }

  function isSameBeacon (beacon1, beacon2) {
    return getBeaconId(beacon1) == getBeaconId(beacon2)
  }

  function isNearerThan (beacon1, beacon2) {
    return beacon1.accuracy > 0 &&
    beacon2.accuracy > 0 &&
    beacon1.accuracy < beacon2.accuracy
  }

  function updateNearestBeacon (beacons) {
    for (var i = 0; i < beacons.length; ++i) {
      var beacon = beacons[i]
      if (!mNearestBeacon) {
        mNearestBeacon = beacon
      } else {
        if (isSameBeacon(beacon, mNearestBeacon) ||
          isNearerThan(beacon, mNearestBeacon)) {
          mNearestBeacon = beacon
        }
      }
    }
  }

  function displayNearestBeacon () {
    if (!mNearestBeacon) { return }

    // Update element.
    var element = 'Nearest Beacon: ' +
      'UUID: ' + mNearestBeacon.uuid + ' ' +
      'Major: ' + mNearestBeacon.major + ' ' +
      'Minor: ' + mNearestBeacon.minor + ' ' +
      'Proximity: ' + mNearestBeacon.proximity + ' ' +
      'Distance: ' + mNearestBeacon.accuracy + ' ' +
      'RSSI: ' + mNearestBeacon.rssi + ' ' +
      alert(element)
  }
  app.getNearestBeacon = function(){
    return mNearestBeacon;
  }

  function displayRecentRegionEvent () {
    if (mAppInBackground) {
      // Set notification title.
      var event = mRegionEvents[mRegionEvents.length - 1]
      if (!event) { return }
      var title = getEventDisplayString(event)

      // Create notification.
      cordova.plugins.notification.local.schedule({
        id: ++mNotificationId,
        title: title })
    }
  }

  function getEventDisplayString (event) {
    return event.time + ': ' +
    mRegionStateNames[event.type] + ' ' +
    mRegionData[event.regionId]
  }

  function getTimeNow () {
    function pad (n) {
      return (n < 10) ? '0' + n : n
    }

    function format (h, m, s) {
      return pad(h) + ':' + pad(m) + ':' + pad(s)
    }

    var d = new Date()
    return format(d.getHours(), d.getMinutes(), d.getSeconds())
  }

  return app
})()

app.initialize()
