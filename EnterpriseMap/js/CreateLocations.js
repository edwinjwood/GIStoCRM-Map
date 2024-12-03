function createLocationsObject(oppId, EOpportunityselectedTermArray, EmployeeName) {
    var listLoc = [];
    console.log(hiddenListData.length);
    console.log(hiddenListData);
    for (var i = 0; i < hiddenListData.length; i++) {
        if (hiddenListData[i][1].name == "locationAlreadyExist" && hiddenListData[i][1].value == "NO") {
            var sla = "";
            var address = "";
            var apartment = "";
            var locationtype = "";
            var bandwidth = "";
            var lat_long = "";
            var npanxx = "";
            var fiber = "false";
            var offnet = "false";
            var eoc = "false";
            var diversity = "false";
            var diversitytype = "";
            var cos = "";
            var interfacespeed = "";
            var proposedsol = "";
            var NearNetOnNetLocationIDval = "";
            let LocationType1 = "";
            let LocationSubType = "";
            let LocationMultiTenant = "";
            let LocationFloor = "";
            let LocationApartmentType = "";
            $.each(hiddenListData[i], function (i, field) {
                if (field.name == 'sla')
                    sla = field.value;
                if (field.name == 'address')
                    address = field.value;
                if (field.name == 'apartment' && (field.value !== ''))
                    apartment = field.value;
                if (field.name == 'locationtype')
                    locationtype = field.value;
                if (field.name == 'bandwidth')
                    bandwidth = field.value;
                if (field.name == 'lat_long')
                    lat_long = field.value;
                if (field.name == 'npanxx')
                    npanxx = field.value;
                if (field.name == 'fiber' && field.value == 'Fiber')
                    fiber = "true";
                if (field.name == 'offnet' && field.value == 'Offnet')
                    offnet = "true";
                if (field.name == 'eoc' && field.value == 'Eoc')
                    eoc = "true";
                if (field.name == 'diversity' && field.value == true)
                    diversity = "true";
                if (field.name == 'diversitytype' && field.value !== "")
                    diversitytype = field.value;
                if (field.name == 'cos' && field.value !== "")
                    cos = field.value;
                if (field.name == 'interfacespeed' && field.value !== "")
                    interfacespeed = field.value;
                if (field.name == 'proposedsolution' && field.value !== "")
                    proposedsol = field.value;
                if (field.name == "NearNetOnNetLocationID")
                    NearNetOnNetLocationIDval = field.value;
                if (field.name == "LocationType1")
                    LocationType1 = field.value;
                if (field.name == "LocationSubType")
                    LocationSubType = field.value;
                if (field.name == "Floor")
                    LocationFloor = field.value;
                if (field.name == "MultiTenant")
                    LocationMultiTenant = field.value;
                if (field.name == "ApartmentType")
                    LocationApartmentType = field.value;
            });
            var locObj = {
                'LocationName': sla,
                'LocationType': locationtype,
                'LocationAddress': address,
                'LocationApartment': apartment,
                'LocationLatLong': lat_long,
                'LocationBandwidth': bandwidth,
                'LocationFiber': fiber,
                'LocationOffnet': offnet,
                'LocationEoc': eoc,
                //'LocationNpanxx': npanxx,
                'LocationDiversity': diversity,
                'LocationDiversitytype': diversitytype,
                'LocationCos': cos,
                'LocationInterfaceSpeed': interfacespeed,
                'LocationProposedSol': proposedsol,
                'LocationNearNetOnNetLocationID': NearNetOnNetLocationIDval,
                'LocationsalesChannelForLocation': salesChannelForLocation,
                'LocationType1': LocationType1,
                'LocationSubType': LocationSubType,
                'LocationMultiTenant': LocationMultiTenant,
                'LocationFloor': LocationFloor,
                'LocationApartmentType': LocationApartmentType
            };
            listLoc.push(locObj);
        }
    }
    createLocations(oppId, EOpportunityselectedTermArray, EmployeeName, listLoc);
}

//function for creating all the locations
function createLocations(oppId, EOpportunityselectedTermArray, EmployeeName, listLoc) {
    console.log(EmployeeName);
    var lengthOfList = listLoc.length;
    console.log(lengthOfList);
    if (lengthOfList > 5) {
        var Location_global_counter = 0;
        console.log("Location length = " + listLoc.length);
        var counter = 0;
        var ajaxCalls = [];
        while (counter < listLoc.length) {
            var inner_list = [];
            for (var inner_counter = counter; inner_counter < counter + 5; inner_counter++) {
                if (inner_counter == listLoc.length)
                    break;
                else
                    inner_list.push(listLoc[inner_counter]);
            }
            counter = inner_counter;
            //create set of 15 locations
            var JsonLocValue = JSON.stringify(inner_list);
            var LocationObject = {
                'username': EmployeeName,
                'term': EOpportunityselectedTermArray,
                'OppID': oppId,
                'LocationData': JsonLocValue,
            };
            var jSon = JSON.stringify({ LocObj: LocationObject });
            ajaxCalls.push(
                $.ajax({
                    type: 'POST',
                    beforeSend: function () { showLoader(); },
                    url: 'LocationCreationService.asmx/createAllLocations',
                    ajaxI: counter,
                    contentType: 'application/json; charset=utf-8',
                    data: jSon,
                    dataType: 'json',
                    success: function (msg) {
                        if (msg.d == "Success") {
                            counter = this.ajaxI;
                            Location_global_counter = Location_global_counter + 1;
                            $("#ZLocCreatedNotification").show();
                            var counter_display = Location_global_counter * 5;
                            document.getElementById('changethelabel').innerHTML = "created " + counter_display + " locations";
                        }
                        else {
                            var errorMessage = "Opportunity was not created some of the input values were wrong please try again";
                            alert(msg.d);
                            showError(errorMessage, 'mainAlert', 'html,body');
                        }
                    },
                    error: function (request, status, error) {
                        alert(request.responseText);
                    }
                }));
        }
        $.when.apply(null, ajaxCalls).done(function () {
            console.log('all request completed');
            document.getElementById('changethelabel').innerHTML = "Locations created ";
            document.getElementById("showButtons").style.display = "block";
            hideLoader();
        });
    }
    else {
        console.log("Location length = " + listLoc.length);
        var JsonLocValue = JSON.stringify(listLoc);
        var LocationObject = {
            'username': EmployeeName,
            /*'term': EOpportunityselectedTermArray,*/
            'OppID': oppId,
            'LocationData': JsonLocValue,
        };
        var jSon = JSON.stringify({ LocObj: LocationObject });
        console.log(jSon);
        $.ajax({
            type: 'POST',
            beforeSend: function () { showLoader(); },
            url: 'LocationCreationService.asmx/createAllLocations',
            contentType: 'application/json; charset=utf-8',
            data: jSon,
            dataType: 'json',
            success: function (msg) {
                var output = msg.d;
                if (msg.d == "Success") {
                    console.log("location created");
                    console.log(msg.d);
                    $("#ZLocCreatedNotification").show();
                    document.getElementById("showButtons").style.display = "block";
                    hideLoader();
                }
                else {
                    var errorMessage = "Opportunity was not created some of the input values were wrong please try again";
                    alert(msg.d + " While creating a Location");
                    showError(errorMessage, 'mainAlert', 'html,body');
                }
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });
    }
}