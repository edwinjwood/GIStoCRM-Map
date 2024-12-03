function changeInterfaceSpeed() {
    var cosvalue = document.getElementById("cos").value;
    document.getElementById("showinterfacespeed").style.display = (cosvalue == "Ethernet" && $('#offnet').prop('checked') == true) ? "block" : "none";
}
function showRegion() {
    if ($('#fiber').prop('checked') == true || $('#offnet').prop('checked') == true) {
        document.getElementById("showclassofserviceandsolution").style.display = 'block';
        document.getElementById("diveryn").style.display = ($('#fiber').prop('checked') == true) ? 'block' : 'none';
    } else {
        document.getElementById("diveryn").style.display = 'none';
        document.getElementById("showclassofserviceandsolution").style.display = 'none';
        document.getElementById("cos").value = "";
    }
    if ($('#offnet').prop('checked') == false) {
        document.getElementById("showinterfacespeed").style.display = 'none';
        document.getElementById("interfacespeed").value = "";
        document.getElementById("cos").value = "";
    }
    if ($('#offnet').prop('checked') == true && document.getElementById("cos").value == "Ethernet") {
        document.getElementById("showinterfacespeed").style.display = 'block';
        document.getElementById("interfacespeed").value = "";
    }
}
// Function that opens location modal 
function openLocationModal() {
    resetLocInfoModal();
    view.popup.close();
    $('#lat_long').val(latitude + ', ' + longitude);
    $('#address').val(location_string);
    $('#LocInfo').modal('show');
}

function showDiversityType() {
    if ($('#diversity').prop('checked') == true)
        $("#divdiversityType").css("display", "block");
    else {
        $("#divdiversityType").css("display", "none");
        $("#diversitytype").val(" ");
    }
}

function displaySpecficBWs(x) {
    var select = $("#bandwidth");
    let i = 0;

    switch (x) {
        case 'Ethernet':
            var optLabels = new Array("", "20MB", "50MB", "100MB", "500MB", "1GB", "2GB", "3GB", "5GB", "10GB");
            var optValues = new Array("", "20Mb", "50Mb", "100Mb", "500Mb", "1000Mb", "2000Mb", "3000Mb", "5000Mb", "100000Mb");

            while (i < optValues.length) {
                var opt = "<option value='" + optValues[i] + "'>" + optLabels[i] + "</option>";
                select.append(opt); //add ethernet values to select list 
                i++;
            }
            break;

        case 'Wavelength Service':
            var optLabels = new Array("", "1GB", "10GB", "100GB", "200GB", "400GB");
            var optValues = new Array("", "1000Mb", "10000Mb", "100000Mb", "200000Mb", "400000Mb");

            while (i < optValues.length) {
                var opt = "<option value='" + optValues[i] + "'>" + optLabels[i] + "</option>";
                select.append(opt); //add wavelength service values to select list 
                i++;
            }
            break;

        case 'DarkFiber':
            var optValues = new Array("", "N/A");

            while (i < optValues.length) {
                var opt = "<option value='" + optValues[i] + "'>" + optValues[i] + "</option>";
                select.append(opt); //add darkfiber values to select list 
                i++;
            }
            break;
        case 'TDM':
            var optValues = new Array("", "DS0", "DS1", "DS3", "OC3", "OC12", "OC48", "OC192");

            while (i < optValues.length) {
                var opt = "<option value='" + optValues[i] + "'>" + optValues[i] + "</option>";
                select.append(opt); //add TDM values to select list 
                i++;
            }
            break;
        case 'Other':
            var optValues = new Array("", "Cross Connect", "Other");

            while (i < optValues.length) {
                var opt = "<option value='" + optValues[i] + "'>" + optValues[i] + "</option>";
                select.append(opt); //add Other values to select list 
                i++;
            }
            break;
        default:
            break;

    }
}

$('#bandwidth').change(function () {
    var bandwidthValue = $('#bandwidth').val();


    if (bandwidthValue.length != 0) {
        $('#showProposedSolution').show();

    } else {
        $('#showProposedSolution').hide();
    }
});

$('#apartment_type').change(function () {
    var apartmentValue = $('#apartment_type').val();
    var labelText = "";
    var label = "";

    $('#apartmentValueLabel').remove();

    switch (apartmentValue) {
        case "APT":
            labelText = "Enter Apartment Number:";
            label = "<Label id='apartmentValueLabel'><span class='smaller' style='color: red'>* </span>" + labelText + "</Label>";
            $('#showApartmentNumber').before(label);
            break;
        case "STE":
            labelText = "Enter Suite Number:";
            label = "<Label id='apartmentValueLabel'><span class='smaller' style='color: red'>* </span>" + labelText + "</Label>";
            $('#showApartmentNumber').before(label);
            break;
        case "RM":
            labelText = "Enter Room Number:";
            label = "<Label id='apartmentValueLabel'><span class='smaller' style='color: red'>* </span>" + labelText + "</Label>";
            $('#showApartmentNumber').before(label);
            break;
        case "DEPT":
            labelText = "Enter Department Number:";
            label = "<Label id='apartmentValueLabel'><span class='smaller' style='color: red'>* </span>" + labelText + "</Label>";
            $('#showApartmentNumber').before(label);
            break;
        case "BLDG":
            labelText = "Enter Building Number:";
            label = "<Label id='apartmentValueLabel'><span class='smaller' style='color: red'>* </span>" + labelText + "</Label>";
            $('#showApartmentNumber').before(label);
            break;
        case "UNIT":
            labelText = "Enter Unit Number:";
            label = "<Label id='apartmentValueLabel'><span class='smaller' style='color: red'>* </span>" + labelText + "</Label>";
            $('#showApartmentNumber').before(label);
            break;
    }
    $('#showApartmentNumber').show();

    if (ApartmentTypeValue.length < 1) {
        $('#showApartmentNumber').hide();
    }

    //    if (apartmentValue.length != 0) {
    //        $('#showApartmentNumber').show();
    //    } else {
    //        $('#showApartmentNumber').hide();
    // }
});

$("#cos").change(function () {

    var cosEval = $("#cos").val();


    if (cosEval.length != 0) { // CoS = Ethernet
        $('#showBandwidth').show();
        $("#bandwidth").empty();

        displaySpecficBWs(cosEval);

    }
    else {
        $('#showBandwidth').val('');
        $('#showBandwidth').hide();
        $('#showProposedSolution').val('');
        $('#showProposedSolution').hide();

    }


});


$("#locationtype1").change(function () {
    console.log("I am here - locationtype1 on change function");
    $("#locationSubType").val("");
    var Value = $('#locationtype1').val();
    var floorValue = $('#floor').val();
    if (Value == "Building") {
        $("#displayFloor").show();
        $("#displayMultiTenant").show();
        if (floorValue == "") {
            $('#floor').val(1);
        }
    }
    else {
        $("#displayFloor").hide();
        $("#displayMultiTenant").hide();
    }
    if (Value == "Building" || Value == "Campus Building") {
        $(".displayForBuilding").show();
        $(".displayForTower").hide();
        $(".displayForSplicePoint").hide();
        $(".displayForCarrierBuilding").hide();
    }
    else if (Value == "Tower") {
        $(".displayForBuilding").hide();
        $(".displayForTower").show();
        $(".displayForSplicePoint").hide();
        $(".displayForCarrierBuilding").hide();
    }
    else if (Value == "Small Cell" || Value == "Splice Point") {
        $(".displayForBuilding").hide();
        $(".displayForTower").hide();
        $(".displayForCarrierBuilding").hide();
        $(".displayForSplicePoint").show();
    }
    else {
        $(".displayForBuilding").hide();
        $(".displayForTower").hide();
        $(".displayForSplicePoint").hide();
        $(".displayForCarrierBuilding").show();
    }

});
