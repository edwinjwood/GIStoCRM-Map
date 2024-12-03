var userName;
var salesChannelForLocation;
var NewOpp = true;
var EmployeeName;
var serviceLocationName;
var location_string = "";
var loc_string = " ";
var checkboxList = 0;
var hiddenListData = [];
var JSONLocArrayCSV = {};
var LocCart = [];
var AllTheLocations = [];
var new_location_counter = 0;
var existing_location_counter = 0;

// Fucntion that corrects order of locations from csv file
function organizeLocations(newLocationObj) {
    newLocationObj.sort(function (a, b) {
        return a.index - b.index;
    });
    return newLocationObj;
}

// Fucntion that parses location object data
function parseJsonData(completeObj) {
    var result = [];
    var arrayData = completeObj.records;
    $.each(arrayData, function (index, value) {
        var dataObj = {};
        dataObj['index'] = value.attributes['OBJECTID'];
        dataObj['address'] = value.attributes['Address'];
        dataObj['city'] = value.attributes['City'];
        dataObj['region'] = value.attributes['Region'];
        dataObj['postal'] = value.attributes['Postal'];
        result.push(dataObj);
    });
    return result;
}

// Function that parses bulk upload into a parsable object for the buidList fucntion
function parseLocationData(name, value) {
    var rowObj = {};
    rowObj['name'] = name;
    rowObj['value'] = value;
    return rowObj;
}

// Function that adds index ID to each of the location list objects
function addIndexId(list) {
    $.each(list, function (index, value) {
        value['ID'] = index;
    });
}

// Function that reloads page 
function reloadPage() {
    $('#SuccessModal').modal('hide');
    location.reload();
}

// Function that shows loaders  
function showLoader() {
    $("#loaderModal").modal('show');
}

// Function that hides loaders 
function hideLoader() {
    $("#loaderModal").modal('hide');
}

// Function that empty's main alert when an account is selected 
$('#selectedAccount').on('change', function () {
    $('#mainAlert').empty();
});

// Function that will disable checkboxes based on bandwidth value
function setBulkUploadEvents() {
    $('.bandwidth_select').off();
    $('.fiberOnCheckAll').off();
    $('.fiberOffCheckAll').off();
    $('.bandwidth_select').on('change', function () {
        var bandwidth = $(this).val();
        var eocDisabledFalseArray = ['2Mb', '3Mb', '5Mb', '6Mb', '10Mb', '20Mb', '30Mb'];
        var checkBandwidth = eocDisabledFalseArray.indexOf(bandwidth);
        if (checkBandwidth > -1) {
            $(this).closest('tr').find('input.eocCheckedAll').prop('disabled', false);
        } else {
            $(this).closest('tr').find('input.eocCheckedAll').prop('disabled', true);
            $(this).closest('tr').find('input.eocCheckedAll').prop('checked', false);
        }
        if (bandwidth == "3Mb" || bandwidth == "2Mb") {
            $(this).closest('tr').find('input.fiberOnCheckAll').prop('disabled', true);
            $(this).closest('tr').find('input.fiberOnCheckAll').prop('checked', false);
            if ($(this).closest('tr').find('input.fiberOnCheckAll').prop('checked') == false && $(this).closest('tr').find('input.fiberOffCheckAll').prop('checked') == false) {
            }
        } else {
            $(this).closest('tr').find('input.fiberOnCheckAll').prop('disabled', false);
        }

    });
}

// Function that disables specific checkboxes when other check boxes are selected 
function check() {

    var bandwidth = $('#bandwidth').val();
    var sel = document.getElementById('bandwidth');

    var eocDisabledFalseArray = ['2Mb', '3Mb', '5Mb', '6Mb', '10Mb', '20Mb', '30Mb'];
    var checkBandwidth = eocDisabledFalseArray.indexOf(bandwidth);
    var opt = sel.options[sel.selectedIndex];
    var currentIndex = opt.index;
    if (currentIndex <= 13) {
        document.getElementById("interfacespeed").value = "";
        document.getElementById("is100").style.display = 'block';
        document.getElementById("is1").style.display = 'block';
        document.getElementById("is10").style.display = 'block';
    }
    if (currentIndex > 13 && currentIndex <= 31) {
        document.getElementById("is100").style.display = 'none';
        document.getElementById("is1").style.display = 'block';
        document.getElementById("is10").style.display = 'block';
        document.getElementById("interfacespeed").value = "";
    }
    if (currentIndex > 31 && currentIndex < 42) {
        document.getElementById("is100").style.display = 'none';
        document.getElementById("is1").style.display = 'none';
        document.getElementById("interfacespeed").value = "";
        document.getElementById("is10").style.display = 'block';
    }
}

// Function that sets up the click event to remove added location 
function removeLocation(event) {
    var errorMessage = "";
    var locationDiv = $(event.target).parent();
    var locationName = $(event.target).attr('name');
    var locationClass = $(event.target).attr('class');
    var locationCount = $('#list').children().length;
    if (locationClass == "ExistingLocButton")
        errorMessage = "Cannot Delete Exisiting Location";
    if (errorMessage != "") {
        var elementName = 'locationAlert';
        showError(errorMessage, elementName, '#cardDisplayContainer');
        errorMessage = "";
    }
    else {
        errorMessage = "";
        for (var i = 0; i < hiddenListData.length; i++) {
            $.each(hiddenListData[i], function (index, field) {
                try
                {
                    if (field.name == 'sla' && field.value == locationName) {
                        hiddenListData.splice(i, 1);
                        return false;
                    }

                } catch { console.log("function removeLocation(event)"+hiddenListData[i]) }
            });
            locationDiv.remove();
            if (locationCount < 2)
                $('#cardDisplay').hide();
        }
        new_location_counter--;
    }
}

// Function that adds appropriate attributes to the bulk upload button
function setupBulkButton() {
    bulkButton = $('#bulkButton');
    bulkButton.attr('data-toggle', 'modal');
    bulkButton.attr('data-target', '.bd-example');
}

function setupOpportunityTypeButton() {
    opportunity = $('#opportunityType');
    opportunity.attr('data-toggle', 'modal');
    opportunity.attr('data-target', '.opportunity-type');
}
