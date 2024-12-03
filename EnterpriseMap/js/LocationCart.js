// Fucntion that validation for all the inputs that reside in the bulk upload table
function checkTableData(rows) {
    var message = "";
    let errorMap = {};
    $(rows).each(function (index, row) {
        //if (row.Latitude == "" || row.Latitude == undefined || checkLatLongSpecialCharacters(row.Latitude)) {
        //    errorMap = updateErrorMap(errorMap, row, "Latitude");
        //}
        //if (row.Longitude == "" || row.Longitude == undefined || checkLatLongSpecialCharacters(row.Longitude)) {
        //    errorMap = updateErrorMap(errorMap, row, "Longitude");
        //}
        if (row.LocationType1 == "") {
            errorMap = updateErrorMap(errorMap, row, "Location Type 1");
        }
        if (row.LocationSubType == "") {
            errorMap = updateErrorMap(errorMap, row, "Location Sub Type");
        }
        if (row.LocationType1 == "Building") {
            if (row.MultiTenant == "") {
                errorMap = updateErrorMap(errorMap, row, "Multi Tenant");
            }
            if (row.Floor == "") {
                errorMap = updateErrorMap(errorMap, row, "Floor");
            }
        }
        if (row.Location_Type == "") {
            errorMap = updateErrorMap(errorMap, row, "Location Type");
        }
        //if (row.Bandwidth == "") {
        //    errorMap = updateErrorMap(errorMap, row, "Bandwidth");
        //}
        if (row.OnNet == true || row.OffNet == true) {
            if (row.Class_of_Service == '') {
                errorMap = updateErrorMap(errorMap, row, "Class of Service");
            }
            if (row.Proposed_Solution == '') {
                errorMap = updateErrorMap(errorMap, row, "Proposed Solution");
            }
        }
        if (row.OffNet == true) {
            if (row.Interface_Speed == '') {
                errorMap = updateErrorMap(errorMap, row, "Interface Speed");
            }
        }
        if (row.Diversity == true) {
            if (row.Diversity_Type == "") {
                errorMap = updateErrorMap(errorMap, row, "Diversity Type");
            }
        }
        if (row.Name == "" || row.Name == undefined || checkSpecialCharacter(row.Name)) {
            errorMap = updateErrorMap(errorMap, row, "Name");
        }
        if (row.Street == "" || row.Street == undefined || checkSpecialCharacter(row.Street)) {
            errorMap = updateErrorMap(errorMap, row, "Street");
        }
        if (row.Ste_Bldg_Flr != "" && row.Ste_Bldg_Flr_num == "") {
            errorMap = updateErrorMap(errorMap, row, "STE/APT/RM#");
        }
        if (row.City == "" || row.City == undefined || checkSpecialCharacter(row.City)) {
            errorMap = updateErrorMap(errorMap, row, "City");
        }
        if (row.State == "" || row.State == undefined || checkSpecialCharacter(row.State)) {
            errorMap = updateErrorMap(errorMap, row, "State");
        }
        if (row.Zip == "" || row.Zip == undefined || checkSpecialCharacter(row.Zip)) {
            errorMap = updateErrorMap(errorMap, row, "Zip");
        }
        //if (row.Npanxx == "" || row.Npanxx == undefined || row.Npanxx.length > 6 || checkSpecialCharacter(row.Npanxx)) {
        //    errorMap = updateErrorMap(errorMap, row, "Npanxx");
        //}
        //if (row.Ste_Bldg_Flr == undefined || checkSpecialCharacter(row.Ste_Bldg_Flr)) {
        //    errorMap = updateErrorMap(errorMap, row, "Ste / Bldg / Flr");
        //}
    });
    console.log(errorMap);
    return errorMap;
}

function checkSpecialCharacter(value) {
    if (String(value).match("^[a-zA-Z0-9 -]*$")) {
        return false
    }
    return true;
}

function checkLatLongSpecialCharacters(value) {
    console.log(value);
    if ((String(value)).trim().match("^[a-zA-Z0-9 -\.]*$")) {
        return false;
    }
    return true;
}

function updateErrorMap(errorMap, row, message) {
    if (message in errorMap) {
        errorMap[message] += ", " + row.Index;
    }
    else {
        errorMap[message] = "<b> Missing / Wrong " + message + " - Row </b>" + row.Index;
    }
    return errorMap;
}


// Function that adds location data from the bulk upload table to the location card
function addAllLocationFromTableToCart() {
    var rowData = getRowData();
    if (rowData.length > 0) {
        var selectedRows = gridOptions.api.getSelectedRows();
        //console.log(selectedRows);
        //checkTableData(selectedRows);
        if (selectedRows && selectedRows.length > 0) {
            var errorMessage = checkTableData(selectedRows);
            if (jQuery.isEmptyObject(errorMessage)) {
                $(selectedRows).each(function (index, row) {
                    var locationArray = [];
                    $('#bulkUploadAlert').empty();
                    //console.log(row.Name);
                    var locationAlreadyExistobj = parseLocationData('locationAlreadyExist', 'NO');
                    var sourcelocationobj = parseLocationData('IsSourceLocation', 'NO');
                    var nameObj = parseLocationData('sla', row.Name);
                    var addressString = row.Street + ', ' + row.City + ', ' + row.State + ', ' + row.Zip;
                    var addressObj = parseLocationData('address', addressString);
                    var lat_longString = row.Latitude + ', ' + row.Longitude;
                    //var npanxxObj = parseLocationData('npanxx', row.Npanxx);
                    var lat_longObj = parseLocationData('lat_long', lat_longString);
                    locationArray.push(sourcelocationobj, locationAlreadyExistobj, nameObj, addressObj, lat_longObj);
                    if (row.OnNet == true) {
                        var offnetObj = parseLocationData('fiber', 'Fiber');
                        locationArray.push(offnetObj);
                    }
                    if (row.OffNet == true) {
                        var fiberObj = parseLocationData('offnet', 'Offnet');
                        locationArray.push(fiberObj);
                    }
                    if (row.Eoc == true) {
                        var eocObj = parseLocationData('eoc', 'Eoc');
                        locationArray.push(eocObj);
                    }
                    if (row.Diversity == true) {
                        var diverseObj = parseLocationData('diversity', true);
                        locationArray.push(diverseObj);
                        var diversitytypeObj = parseLocationData('diversitytype', row.Diversity_Type);
                        locationArray.push(diversitytypeObj);
                    }
                    var bandwidthObj = parseLocationData('bandwidth', row.Bandwidth);
                    locationArray.push(bandwidthObj);
                    if (row.Location_Type !== "") {
                        var locationtypeObj = parseLocationData('locationtype', row.Location_Type);
                        locationArray.push(locationtypeObj);
                    }
                    if (row.Class_of_Service != "") {
                        var cos = parseLocationData('cos', row.Class_of_Service);
                        locationArray.push(cos);
                    }
                    if (row.Interface_Speed != "") {
                        var interfacespeed = parseLocationData('interfacespeed', row.Interface_Speed);
                        locationArray.push(interfacespeed);
                    }
                    if (row.Proposed_Solution != '' || row.Proposed_Solution != typeof 'undefined') {
                        var proposedsolution1 = parseLocationData('proposedsolution', row.Proposed_Solution);
                        locationArray.push(proposedsolution1);
                    }
                    if (row.LocationType1 != "") {
                        locationArray.push(parseLocationData('LocationType1', row.LocationType1));
                    }
                    if (row.LocationSubType != "") {
                        locationArray.push(parseLocationData('LocationSubType', row.LocationSubType));
                    }
                    if (row.LocationType1 == "Building" && row.Floor != "") {
                        locationArray.push(parseLocationData('Floor', row.Floor));
                        locationArray.push(parseLocationData('MultiTenant', row.MultiTenant == "Yes" ? "on" : "off"));
                    }
                    if (row.Ste_Bldg_Flr != "") {
                        locationArray.push(parseLocationData('ApartmentType', row.Ste_Bldg_Flr));
                        if (row.Ste_Bldg_Flr_num == typeof 'undefined' || row.Ste_Bldg_Flr_num == '') {
                            var apt = parseLocationData('apartment', "");
                            locationArray.push(apt);
                        }
                        else {
                            var apt = parseLocationData('apartment', row.Ste_Bldg_Flr_num);
                            locationArray.push(apt);
                        }
                    }
                    buildList(locationArray);
                    //console.log(locationArray);
                    $('#BulkUploadModel').modal('hide');
                    try
                    {
                        gridOptions.api.setRowData([]);
                    } 
                    catch { }
                    errorMessage = {};
                    $("#bulkUploadAlert").empty();
                    document.getElementById("csvfile").value = "";
                    $("#ErrorsDisplay").text("Errors");
                    $("#ErrorsDisplay").removeClass('btn-danger');
                    $("#ErrorsDisplay").addClass('btn-info');
                    $('#selectAllLocationType').val("");
                    $('#selectAllBandWidth').val("");
                    document.getElementById("onnetSelectAll").checked = false;
                    //document.getElementById("offnetSelectAll").checked = false;
                    //document.getElementById('eocSelectAll').checked = false;
                    document.getElementById('diversitySelectAll').checked = false;
                    $('#AllClassOfService').val("");
                    $('#AllDiversityType').val("");
                    $('#selectAllinterfacespeed').val("");
                    $('#proposedsolutionbulk').val("");
                    $('#proposedsolutionbulk').text("");
                });
                //if (errorMessage)
                //    showError(errorMessage, 'bulkUploadAlert', '#BulkUploadModel');
            } else {
                var msg = "";
                $("#ErrorsDisplay").text(Object.keys(errorMessage).length + " Errors");
                $("#ErrorsDisplay").removeClass('btn-info');
                $("#ErrorsDisplay").addClass('btn-danger');
                for (var err in errorMessage) {
                    msg = msg + errorMessage[err] + " </br>";
                    console.log(errorMessage[err]);
                }
                showError(msg, 'bulkUploadAlert', '#BulkUploadModel');
            }
        }
        else {
            $("#ErrorsDisplay").removeClass('btn-info');
            $("#ErrorsDisplay").addClass('btn-danger');
            showError("No Rows Selected", "bulkUploadAlert", "#BulkUploadModel");
            showError("No Location Present", "bulkUploadAlert", "#BulkUploadModel");
        }

    }
    else {
        //Display Error Message
        $("#ErrorsDisplay").removeClass('btn-info');
        $("#ErrorsDisplay").addClass('btn-danger');
        showError("No Rows Selected", "bulkUploadAlert", "#BulkUploadModel");
        showError("No Location selected", "bulkUploadAlert", "#BulkUploadModel");
    }
}

// This function validates that certain required fields are not empty and are the correct length in the add location form 
function addLocationToCard(event) {
    event.preventDefault();
    search.view.popup.close();
    serviceLocationName = $('#sla').val();
    //var npanxx = $('#npanxx').val();
    var diversitytype = $('#diversitytype').val();
    var locationtype = $('#locationtype').val();
    let locationtype1 = $('#locationtype1').val();
    let locationSubtype = $('#locationSubType').val();
    let apartmentType = $('#apartment_type').val();
    let multiTenant = $("input[name='muliTenant']:checked").val();
    let floor = $('#floor').val();
    var errorMessage = "";
    var proposedsolution = document.getElementById("proposedsolution").value;
    var cos = document.getElementById("cos").value;
    var interfacespeed = document.getElementById("interfacespeed").value;
    if (!serviceLocationName) {
        errorMessage += "Enter a value for the Service Location Name  field. <br>";
    }
    //if (!npanxx || npanxx.length < 6) {
    //    errorMessage += "Enter a value for NPA/NXX field, it should only be 6 digits. <br>";
    //}
    if (!locationtype1 || locationtype1 == "") {
        errorMessage += "Select Location Type. <br>";
    }
    if (!locationSubtype || locationSubtype == "") {
        errorMessage += "Select Primary Use Type. <br>";
    }
    if (locationtype1 == "Building" && (!floor || floor == "")) {
        errorMessage += "Select Floor. <br>";
    }

    if (multiTenant == "Yes" && apartmentType == "") {
        errorMessage += "Select STE/APT/RM. <br>";
    }

    if (apartmentType != "" && $('#apartment').val() == "") {
        errorMessage += "Please provide " + apartmentType + "#. <br>";
    }
    if ($('#fiber').prop('checked') == true || $('#offnet').prop('checked') == true) {
        if (cos == "")
            errorMessage += "Select a Class of service. <br>";
        if (cos == "Ethernet" && $('#offnet').prop('checked') == true) {
            if (interfacespeed == "")
                errorMessage += "Select Interface speed. <br>";
        }
        if (proposedsolution == "")
            errorMessage += "Proposed Solution field should not remain empty. <br>";
    }
    if (locationtype == "")
        errorMessage += "Select a value for Location Type. <br>";
    if (($('#diversity').prop('checked') == true) && diversitytype == "")
        errorMessage += "Select value for Diversity Type";
    if (!errorMessage) {
        if ($('#hqAddress').prop('checked') == true) {
            document.getElementById("hqAddressDiv").style.display = 'none';
            headQuartersAddress = $('#address').val();
            console.log("headQuartersAddress == " + headQuartersAddress);
            $("#hqAddress").prop("checked", false);
        }
        if ($('#primaryAddress').prop('checked') == true) {
            document.getElementById("primaryAddressDiv").style.display = 'none';
            primaryContactAddress = $('#address').val();
            console.log("primaryContactAddress == " + primaryContactAddress);
            $("#primaryAddress").prop("checked", false);
        }
        var formData = getFormData();

        buildList(formData);

    } else {
        elementName = 'buisnessAcountAlert';
        showError(errorMessage, elementName, '#LocInfo');
    }
}