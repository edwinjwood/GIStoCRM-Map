var oppId = "";
var oppName = "";

var opportunityTypeCheck = false;


function setOppEvent() {
    opportunityTypeCheck = true;
}
function ExistingOppEvent() {
    opportunityTypeCheck = true;
    view.ui.remove(opportunity);
    document.getElementById('NewOppbutton').style.display = 'none';
    document.getElementById('ExistingOppbutton').style.display = 'none';
    document.getElementById('oppIdfornew').style.display = 'block';
    $("#hqAddressDiv").hide();
    $("#primaryAddressDiv").hide();
    primaryContactAddress = "";
    headQuartersAddress = "";
}

function NewOppEvent() {
    $("#hqAddressDiv").show();
    $("#primaryAddressDiv").show();
    primaryContactAddress = "";
    headQuartersAddress = "";
    opportunityTypeCheck = true;
    view.ui.remove(opportunity);
    NewOpp = true;
    document.getElementById('NewOppbutton').style.display = 'none';
    document.getElementById('ExistingOppbutton').style.display = 'none';
    $('#selectedAccount').val('');
    document.getElementById("notification").style.display = 'block';
    setTimeout(function () {
        $('#initModal').modal('hide');
        document.getElementById('viewDiv').style.opacity = 1;
    }, 3000);

}

function searchOpp() {
    setOppEvent();
    var existingoppid = document.getElementById('oppID').value;
    console.log(existingoppid);
    NewOpp = false;
    $.ajax({
        type: 'POST',
        beforeSend: function () { showLoader(); },
        url: 'ExistingOpportunityService.asmx/getExistingOpportunity?existingoppid=' + existingoppid,
        data: JSON.stringify({ existingoppid: existingoppid }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            if (msg.d.length == 0) {
                hideLoader();
                alert("No Opportunity exist with the provided ID");
                //document.getElementById('NewOppbutton').style.display = 'none';
                //document.getElementById('ExistingOppbutton').style.display = 'none';
                //document.getElementById("notification").style.display = 'block';
                //document.getElementById("oppIdfornew").style.display = 'none';
                //    opportunity = $('#opportunityType');
                //    opportunity.attr('data-toggle', 'modal');
                //    opportunity.attr('data-target', '.opportunity-type');
                //    setTimeout(function () {
                //        $('#initModal').modal('hide');
                //        document.getElementById('viewDiv').style.opacity = 1;
                //    }, 3000);
            }
            else {
                hideLoader();
                $("#selectedAccount").val("Other");
                $("#o_account_name").val("Other");
                $("#o_account_number").val("None");
                $("#o_account_id").val("None");
                //$(".custom-combobox-input").val("New Logo");
                $(".custom-combobox-input").prop("readonly", true);
                $(".custom-combobox-button").hide();
                $(".custom-combobox-input").attr("placeholder", "Account Not Required...");
                var ExistingLocations = jQuery.parseJSON(msg.d);
                var innerattributes = {}, records1 = [];
                var outAttribute = {};
                oppId = ExistingLocations[ExistingLocations.length - 1].id;
                var accountname_opp = ExistingLocations[ExistingLocations.length - 1].accountname;
                console.log(accountname_opp);
                if (accountname_opp == "") {
                    //$(".custom-combobox-input").val("New Logo");
                }
                else {
                    $(".custom-combobox-input").val(accountname_opp);
                }
                //$(".custom-combobox-input").val(accountname_opp);
                oppName = ExistingLocations[ExistingLocations.length - 1].name;
                salesChannelForLocation = ExistingLocations[ExistingLocations.length - 1].salesChannel;
                console.log("salesChannelForLocation = " + salesChannelForLocation);
                for (var i = 0; i < ExistingLocations.length - 1; i++) {
                    var add = ExistingLocations[i].locAddress;
                    var addressArray = add.split(', ');
                    innerattributes.Address = addressArray[0];
                    innerattributes.City = addressArray[1];
                    innerattributes.Region = addressArray[2];
                    innerattributes.Postal = addressArray[3];
                    outAttribute.attributes = innerattributes;
                    records1.push(outAttribute);
                    outAttribute = {};
                    innerattributes = {};
                }
                var completerecords = {};
                completerecords.records = records1;
                var stringRecords = JSON.stringify(completerecords);
                //var locations = getLatLong(completerecords);
                var locations = getLocationData(completerecords);
                console.log("testing locations");
                console.log(locations);

                for (var i = 0; i < ExistingLocations.length - 1; i++) {
                    var array_existing_loc = [];
                    if (locations.length > 0) {
                        ExistingLocations[i].Latitude = locations[i].latitude;
                        ExistingLocations[i].Longitude = locations[i].longitude;
                        var lat_longobj = parseLocationData('lat_long', locations[i].latitude + ', ' + locations[i].longitude);

                    }

                    ExistingLocations[i].LocationsAlreadyThere = "YES";
                    var locnameobj = parseLocationData('sla', ExistingLocations[i].name);
                    var addressobj = parseLocationData('address', ExistingLocations[i].locAddress);
                    var idobj = parseLocationData('id', ExistingLocations[i].id);
                    var locationtypeobj = parseLocationData('locationtype', ExistingLocations[i].locationtype);
                    var locationAlreadyExistobj = parseLocationData('locationAlreadyExist', 'YES');
                    var source = ExistingLocations[i].isSourecLoc;
                    if (source == true) {
                        var sourcelocationobj = parseLocationData('IsSourceLocation', 'YES');
                        array_existing_loc.push(sourcelocationobj);
                    }
                    else {
                        var sourcelocationobj = parseLocationData('IsSourceLocation', 'NO');
                        array_existing_loc.push(sourcelocationobj);
                    }
                    array_existing_loc.push(locationAlreadyExistobj, idobj, locnameobj, addressobj, locationtypeobj, lat_longobj);
                    console.log(array_existing_loc);
                    buildList(array_existing_loc);
                }


                document.getElementById('NewOppbutton').style.display = 'none';
                document.getElementById('ExistingOppbutton').style.display = 'none';
                document.getElementById("notification").style.display = 'block';
                document.getElementById("oppIdfornew").style.display = 'none';
                setTimeout(function () {
                    $('#initModal').modal('hide');
                    document.getElementById('viewDiv').style.opacity = 1;
                }, 3000);
            }
        },
        error: function (e) {
            alert('Error: ' + e.message);
        }
    });
}