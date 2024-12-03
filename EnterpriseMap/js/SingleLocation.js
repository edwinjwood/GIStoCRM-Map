// Function that gets Location form data from single search
function getFormData() {
    var array = [];
    var locationAlreadyExistobj = parseLocationData('locationAlreadyExist', 'NO');
    var sourcelocationobj = parseLocationData('IsSourceLocation', 'NO');
    var slaObj = parseLocationData('sla', $('#sla').val());
    var addressObj = parseLocationData('address', $('#address').val());
    var latLongObj = parseLocationData('lat_long', $('#lat_long').val());
    //var npanxxObj = parseLocationData('npanxx', $('#npanxx').val());
    var apartment = document.getElementById('apartment').value;

    array.push(sourcelocationobj, locationAlreadyExistobj, slaObj, addressObj, latLongObj);
    if ($('#fiber').prop('checked')) {
        var fiber = parseLocationData('fiber', 'Fiber');
        array.push(fiber);
    }
    if ($('#offnet').prop('checked')) {
        var offnet = parseLocationData('offnet', 'Offnet');
        array.push(offnet);
    }
    if ($('#eoc').prop('checked')) {
        var eoc = parseLocationData('eoc', 'Eoc');
        array.push(eoc);
    }
    if ($('#diversity').prop('checked')) {
        var diverse = parseLocationData('diversity', true);
        array.push(diverse);
        var diversetype = parseLocationData('diversitytype', $('#diversitytype').val());
        array.push(diversetype);
    } else {
        var diverse = parseLocationData('diversity', false);
        array.push(diverse);
        var diversetype = parseLocationData('diversitytype', $('#diversitytype').val());
        array.push(diversetype);
    }
    var bandwidth = parseLocationData('bandwidth', $('#bandwidth').val());
    array.push(bandwidth);
    if ($('#locationtype').val() !== "") {
        var locationtype = parseLocationData('locationtype', $('#locationtype').val());
        array.push(locationtype);
    }
    var cos = parseLocationData('cos', $('#cos').val());
    array.push(cos);
    var xyz = document.getElementById("proposedsolution").value;
    var proposedsolution = parseLocationData('proposedsolution', xyz);
    array.push(proposedsolution);
    var interfacespeed = parseLocationData('interfacespeed', $('#interfacespeed').val());
    array.push(interfacespeed);
    if (apartment == typeof 'undefined' || apartment == '')
        var apt = parseLocationData('apartment', "");
    else
        var apt = parseLocationData('apartment', apartment);
    array.push(apt);
    var NearNetOnNetLocationID = $("#NearNetOnNetLocationID").val();
    var NearNetOnNetLocationIDobj = parseLocationData('NearNetOnNetLocationID', NearNetOnNetLocationID);
    array.push(NearNetOnNetLocationIDobj);
    if ($('#locationtype1').val() != "") {
        array.push(parseLocationData('LocationType1', $('#locationtype1').val()));
    }
    if ($('#locationSubType').val() != "") {
        array.push(parseLocationData('LocationSubType', $('#locationSubType').val()));
    }
    if ($('#locationtype1').val() == "Building" && $('#floor').val() != "") {
        array.push(parseLocationData('Floor', $('#floor').val()));
        array.push(parseLocationData('MultiTenant', $("input[name='muliTenant']:checked").val()));
    }
    if ($('#apartment_type').val() != "") {
        array.push(parseLocationData('ApartmentType', $('#apartment_type').val()));
    }
    return array;
}
function openLocationModal() {
    resetLocInfoModal();
    view.popup.close();
    $('#lat_long').val(latitude + ', ' + longitude);
    $('#address').val(location_string);
    $('#LocInfo').modal('show');
}
// Function that clears out the location modal form
function resetLocInfoModal() {
    $('#LocInfo').find('input#sla').val('');
    $('#LocInfo').find('input#locationtype').val('');
    $('#LocInfo').find('input#npanxx').val('');
    $('#LocInfo').find('select#bandwidth').val('5Mb');
    $('#LocInfo').find('input#aLocation').prop('checked', false);
    $('#LocInfo').find('input#eoc').prop('checked', false);
    $('#LocInfo').find('input#fiber').prop('checked', false);
    $('#LocInfo').find('input#fiber').prop('disabled', false);
    $('#LocInfo').find('input#offnet').prop('checked', false);
    $('#LocInfo').find('input#diversity').prop('checked', false);
    document.getElementById("diversitytype").value = "";
    document.getElementById("locationtype").value = "";
    document.getElementById("cos").value = "";
    document.getElementById("proposedsolution").value = "";
    document.getElementById("apartment").value = "";
    $('#buisnessAcountAlert').empty();
    $('#diveryn').hide();
    $('#divdiversityType').hide();
    document.getElementById("interfacespeed").value = "";
    document.getElementById("showinterfacespeed").style.display = "none";
    document.getElementById("showclassofserviceandsolution").style.display = "none";
    $("#NearNetOnNetLocationID").val("");
    $('#locationtype').prop('disabled', false);
    $('#locationSubType').val('');
    $('#locationtype1').val('');
    if ($('#apartment_type').val().length > 0) {
        $('#apartmentValueLabel').remove();
        $('#showApartmentNumber').hide();
    }
    $('#apartment_type').val('');
    $('#bandwidth').val('');
    $('#floor').val('');
    document.getElementById("displayOnNet").style.display = 'none';
}
// Function that checks the location information on search
function locationCheck() {
    if (opportunityTypeCheck == true) {
        var SplitLocationByComma = location_string.split(',');
        var CheckfourthLocationIsZipCode = parseInt(SplitLocationByComma[3]);
        if (SplitLocationByComma.length != 4) {
            errorMessage = "Entered Location is Incorrect please input location in format of Street, City, State, Zipcode";
            showError(errorMessage, 'mainAlert');
            search.clear();
            search.focus();
            view.scale = 7109000;
            search.view.popup.close();
        }
        else if (isNaN(CheckfourthLocationIsZipCode) == true) {
            showError(errorMessage, 'mainAlert');
            errorMessage = "Entered Location is Incorrect please input location in format of Street, City, State, Zipcode";
            showError(errorMessage, 'mainAlert');
            search.clear();
            search.focus();
            view.scale = 7109000;
            search.view.popup.close();
        }
        else {
            search.clear();
            view.scale = 7109000;
            search.view.popup.close();
            openLocationModal();
        }
    }
    else {
        alert("Please select opportunity type before adding location");
        search.clear();
        search.focus();
        view.scale = 7109000;
        search.view.popup.close();
    }
}