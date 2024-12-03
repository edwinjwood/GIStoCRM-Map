// Function that gets the token needed for urls in getLocationData function
var url;
var urlclientid;
var urlclientsecret;
function fetchConfigValue(key) {

    const url = 'OpportunityCreationService.asmx/GetAllKeysAndValuesFromConfig';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body as your web method doesn't require any parameters
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            // Assuming your web method returns an object with key-value pairs
            const configValues = result.d;

            // Check if the key exists in the fetched configuration values
            if (configValues.hasOwnProperty(key)) {
                // Retrieve the value for the specified key
                const value = configValues[key];

                // Assign the value to a variable within this function scope
                let assignedValue = value;


                return assignedValue;
            } else {
                throw new Error(`Key ${key} not found in configuration values`);
            }
        })
        .catch(error => {
            console.error('Error fetching configuration value:', error);
        });
}
function getTokken() {
    var token = null;
    $.ajax({
        async: false,
        global: false,
        url: "https://www.arcgis.com/sharing/oauth2/token?client_id=YzVigbD9Tdj0bPfV&grant_type=client_credentials&client_secret=7250ba7746a9417889fd82b7ff271fbf&expiration=2880&f=pjson",
        dataType: 'json',
        data: {
            'request': "", 'target': 'arrange_url', 'method': 'method_target'
        },
        type: 'POST',
        success: function (data) {
            token = data.access_token;
        },
        error: function (e) {
            alert('Error: ' + e);
        }
    });
    return token;
}
//function getTokken(url, clientId, clientSecret) {
//    // Return a promise that resolves with the token
//    return new Promise((resolve, reject) => {
//        $.ajax({
//            url: url + "client_id=" + clientId + "&grant_type=client_credentials&client_secret=" + clientSecret + "&expiration=2880&f=pjson",
//            dataType: 'json',
//            data: {
//                'request': "", 'target': 'arrange_url', 'method': 'method_target'
//            },
//            type: 'POST',
//            success: function (data) {
//                resolve(data.access_token);
//            },
//            error: function (e) {
                
//                reject('Error: ' + e);
//            }
//        });
//    });
//}

var newLocationObj = [];



//}

// Function that takes in data objects to grab additional missing information if needed 
function getLocationData(completeObj, latlong) {
    // Fetch configuration values
    var token = getTokken();
    var response;
    //Promise.all([
    //    fetchConfigValue('url'),
    //    fetchConfigValue('urlclientsecret'),
    //    fetchConfigValue('urlclientid')
    //]).then(([url, urlclientsecret, urlclientid]) => {
    //    // Once you have all the configuration values, call getTokken
    //    getTokken(url, urlclientid, urlclientsecret).then(token => {
    //        // Use the token here or perform further operations
    //        token = token;
    //        console.log(token);
            if (completeObj) {
                if (completeObj.records) {
                    $.each(completeObj.records, function (index, value) {
                        var stringRecords = JSON.stringify(value);
                        var newUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses?addresses={records:[" + stringRecords + "]}&sourceCountry=USA&token=" + token + "&f=pjson";
                        console.log(newUrl);
                        var newencuri = encodeURI(newUrl);
                        console.log(newencuri);
                        $.ajax({
                            async: false,
                            global: false,
                            url: newencuri,
                            dataType: 'json',
                            data: {
                                'request': "", 'target': 'arrange_url', 'method': 'method_target'
                            },
                            type: 'POST',
                            success: function (data) {
                               
                                var arrayData = data.locations;
                                $.each(arrayData, function (index, value) {
                                    var indexID = value.attributes.ResultID;
                                    if (value && value.attributes['DisplayX'] && value.attributes['DisplayX'] != undefined)
                                        var displayX = value.attributes['DisplayX'];
                                    else
                                        var displayX = "";
                                    if (value && value.attributes['DisplayY'] && value.attributes['DisplayY'] != undefined)
                                        var displayY = value.attributes['DisplayY'];
                                    else
                                        var displayY = "";

                                    var addressArray = value.address.split(', ');
                                    var fullObj = {};
                                    if (addressArray.length > 0) {
                                        fullObj['index'] = parseInt(indexID);
                                        fullObj['address'] = addressArray[0];
                                        fullObj['city'] = addressArray[1];
                                        fullObj['region'] = addressArray[2];
                                        fullObj['postal'] = addressArray[3];
                                        fullObj['longitude'] = displayX;
                                        fullObj['latitude'] = displayY;
                                        newLocationObj.push(fullObj);
                                        
                                    }
                                    else {
                                        fullObj['index'] = parseInt(indexID);
                                        fullObj['address'] = "";
                                        fullObj['city'] = "";
                                        fullObj['region'] = "";
                                        fullObj['postal'] = "";
                                        fullObj['longitude'] = "";
                                        fullObj['latitude'] = "";
                                        newLocationObj.push(fullObj);
                                    }
                                });
                            },
                            error: function (e) {
                                alert('Error: ' + e.message);
                            }
                        });
                    });
                }
                else {
                    var inputList = {};
                    inputList = completeObj;
                    var stringRecords = JSON.stringify(inputList);
                    var newUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses?addresses={records:[{attributes:" + stringRecords + "}]}&sourceCountry=USA&token=" + token + "&f=pjson";
                    console.log(newUrl);
                    var newencuri = encodeURI(newUrl);
                    console.log(newencuri);
                    $.ajax({
                        async: false,
                        global: false,
                        url: newencuri,
                        dataType: 'json',
                        data: {
                            'request': "", 'target': 'arrange_url', 'method': 'method_target'
                        },
                        type: 'POST',
                        success: function (data) {
                            var arrayData = data.locations;
                            $.each(arrayData, function (index, value) {
                                var indexID = value.attributes.ResultID;
                                if (value && value.attributes['DisplayX'] && value.attributes['DisplayX'] != undefined)
                                    var displayX = value.attributes['DisplayX'];
                                else
                                    var displayX = "";
                                if (value && value.attributes['DisplayY'] && value.attributes['DisplayY'] != undefined)
                                    var displayY = value.attributes['DisplayY'];
                                else
                                    var displayY = "";

                                var addressArray = value.address.split(', ');
                                var fullObj = {};
                                if (addressArray.length > 0) {
                                    fullObj['index'] = parseInt(indexID);
                                    fullObj['address'] = addressArray[0];
                                    fullObj['city'] = addressArray[1];
                                    fullObj['region'] = addressArray[2];
                                    fullObj['postal'] = addressArray[3];
                                    fullObj['longitude'] = displayX;
                                    fullObj['latitude'] = displayY;
                                    newLocationObj.push(fullObj);
                                }
                                else {
                                    fullObj['index'] = parseInt(indexID);
                                    fullObj['address'] = "";
                                    fullObj['city'] = "";
                                    fullObj['region'] = "";
                                    fullObj['postal'] = "";
                                    fullObj['longitude'] = "";
                                    fullObj['latitude'] = "";
                                    newLocationObj.push(fullObj);
                                }
                            });
                        },
                        error: function (e) {
                            alert('Error: ' + e.message);
                        }
                    });
                }
                if (latlong) {
                    $.each(latlong, function (index, value) {
                        var reverseURL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=" + value;
                        var reverseNewURL = encodeURI(reverseURL);
                        console.log(reverseNewURL);
                        $.ajax({
                            async: false,
                            global: false,
                            url: reverseURL,
                            dataType: 'json',
                            data: {
                                'request': "", 'target': 'arrange_url', 'method': 'method_target'
                            },
                            type: 'GET',
                            success: function (data) {
                                var latlong = value.split(",");
                                var reverseObjs = {};
                                reverseObjs['index'] = parseInt(index);
                                if (data && data.address && data.address['Address'] && data.address['Address'] != undefined)
                                    reverseObjs['address'] = data.address['Address'];
                                else
                                    reverseObjs['address'] = "";
                                if (data && data.address && data.address['City'] && data.address['City'] != undefined)
                                    reverseObjs['city'] = data.address['City'];
                                else
                                    reverseObjs['city'] = "";
                                if (data && data.address && data.address['Region'] && data.address['Region'] != undefined)
                                    reverseObjs['region'] = data.address['Region'];
                                else
                                    reverseObjs['region'] = "";
                                if (data && data.address && data.address['Postal'] && data.address['Postal'] != undefined)
                                    reverseObjs['postal'] = data.address['Postal'];
                                else
                                    reverseObjs['postal'] = "";
                                reverseObjs['longitude'] = latlong[0];
                                reverseObjs['latitude'] = latlong[1];
                                newLocationObj.push(reverseObjs);
                            },
                            error: function (e) {
                                alert('Error: ' + e);
                            }
                        });
                    });
                }
                
            }
            
            // gridOptions.api.showLoadingOverlay();
    //    }).catch(error => {
    //        console.error('Error fetching token:', error);
    //    });
    //}).catch(error => {
    //    console.error('Error fetching configuration values:', error);
    //});
   
   
    var finalLocation = organizeLocations(newLocationObj);
    return finalLocation;
}

function getLatLong(completeObj) {
    // Fetch configuration values
    var token = getTokken();
    var response;
    var newLocationObj = [];
    var finalLocation = newLocationObj;

    //Promise.all([
    //    fetchConfigValue('url'),
    //    fetchConfigValue('urlclientsecret'),
    //    fetchConfigValue('urlclientid')
    //]).then(([url, urlclientsecret, urlclientid]) => {
    //    // Once you have all the configuration values, call getTokken
    //    getTokken(url, urlclientid, urlclientsecret).then(token => {
    //        // Use the token here or perform further operations
    //        token = token;
    //        console.log(token);
            if (completeObj) {
                    var inputList = {};
                    inputList = completeObj;
                    var stringRecords = JSON.stringify(inputList);
                    var newUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses?addresses={records:[{attributes:" + stringRecords + "}]}&sourceCountry=USA&token=" + token + "&f=pjson";
                    console.log(newUrl);
            var newencuri = encodeURI(newUrl);

                    console.log(newencuri);
                    $.ajax({
                        async: false,
                        global: false,
                        url: newencuri,
                        dataType: 'json',
                        data: {
                            'request': "", 'target': 'arrange_url', 'method': 'method_target'
                        },
                        type: 'POST',
                        success: function (data) {
                            var arrayData = data.locations;
                            $.each(arrayData, function (index, value) {
                                var indexID = value.attributes.ResultID;
                                if (value && value.attributes['DisplayX'] && value.attributes['DisplayX'] != undefined)
                                    var displayX = value.attributes['DisplayX'];
                                else
                                    var displayX = "";
                                if (value && value.attributes['DisplayY'] && value.attributes['DisplayY'] != undefined)
                                    var displayY = value.attributes['DisplayY'];
                                else
                                    var displayY = "";

                                var addressArray = value.address.split(', ');
                                var fullObj = {};
                                if (addressArray.length > 0) {
                                    fullObj['index'] = parseInt(indexID);
                                    fullObj['address'] = addressArray[0];
                                    fullObj['city'] = addressArray[1];
                                    fullObj['region'] = addressArray[2];
                                    fullObj['postal'] = addressArray[3];
                                    fullObj['longitude'] = displayX;
                                    fullObj['latitude'] = displayY;
                                    newLocationObj.push(fullObj);
                                }
                                else {
                                    fullObj['index'] = parseInt(indexID);
                                    fullObj['address'] = "";
                                    fullObj['city'] = "";
                                    fullObj['region'] = "";
                                    fullObj['postal'] = "";
                                    fullObj['longitude'] = "";
                                    fullObj['latitude'] = "";
                                    newLocationObj.push(fullObj);
                                }
                            });
                            return finalLocation;

                        },
                        error: function (e) {
                            alert('Error: ' + e.message);
                        }
                    });
            }
// ------------------------- End
            // gridOptions.api.showLoadingOverlay();
    //    }).catch(error => {
    //        console.error('Error fetching token:', error);
    //    });
    //}).catch(error => {
    //    console.error('Error fetching configuration values:', error);
    //});

//    var finalLocation = newLocationObj;
    return finalLocation;
}

function getAddress(latlong) {
    var token = getTokken();
    var response;
    var newLocationObj = [];
    var reverseURL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=" + latlong;
    var reverseNewURL = encodeURI(reverseURL);
    console.log(reverseURL);
    $.ajax({
        async: false,
        global: false,

        url: reverseURL,
        dataType: 'json',
        data: {
            'request': "", 'target': 'arrange_url', 'method': 'method_target'
        },
        type: 'GET',
        success: function (data) {
            var reverseObjs = {};
            if (data && data.address && data.address['Address'] && data.address['Address'] != undefined)
                reverseObjs['address'] = data.address['Address'];
            else
                reverseObjs['address'] = "";
            if (data && data.address && data.address['City'] && data.address['City'] != undefined)
                reverseObjs['city'] = data.address['City'];
            else
                reverseObjs['city'] = "";
            if (data && data.address && data.address['Region'] && data.address['Region'] != undefined)
                reverseObjs['region'] = data.address['Region'];
            else
                reverseObjs['region'] = "";
            if (data && data.address && data.address['Postal'] && data.address['Postal'] != undefined)
                reverseObjs['postal'] = data.address['Postal'];
            else
                reverseObjs['postal'] = "";
            newLocationObj.push(reverseObjs);
        },
        error: function (e) {
            alert('Error: ' + e);
        }
    });

    var finalLocation = newLocationObj;
    return finalLocation;
}
