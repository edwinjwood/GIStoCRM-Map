$('#locationtype').on('change', function () {
    var Value = $('#locationtype').val();
    if (Value == "New")
        checkIfLocationNearNet(latitude, longitude, location_string);
    else {
        $('#locationtype').prop('disabled', false);
        document.getElementById("displayOnNet").style.display = 'none';
        $("#fiber").prop("checked", false);
        $("#fiber").prop("disabled", false);
        $("#offnet").prop("disabled", false);
        $("#offnet").prop("checked", false);
        $("#eoc").prop("disabled", false);
        $("#eoc").prop("checked", false);
        document.getElementById("diveryn").style.display = 'none';
        document.getElementById("showclassofserviceandsolution").style.display = 'none';
        $("#displayOnNetRules").hide();
        $("#cos").val("");
        $("#showinterfacespeed").hide();
        $("#interfacespeed").val("");
        $("#proposedsolution").val("");
        $("#bandwidth").val("");
        $('#bandwidth').attr("disabled", false);

    }
});

function checkIfLocationNearNet(lat, long, location_string) {
    var ObjLatLong = {
        'Lat': lat,
        'Long': long,
        'Address': location_string,
    };
    var jSon = JSON.stringify({ latlongObj: ObjLatLong });
    $.ajax({
        type: 'POST',
        url: 'NearNetLocationCheckService.asmx/checkIfLocationNearNet',
        data: jSon,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            // Do something interesting here.
            console.log(msg.d);
            var obj = JSON.parse(msg.d);
            if (obj.LocationType == 241870002) {
                document.getElementById("displayOnNet").style.display = 'block';
                document.getElementById("locationtype").value = "OnNet";
                $('#locationtype').prop('disabled', true);
                $("#fiber").prop("checked", true);
                $("#fiber").prop("disabled", true);
                $("#offnet").prop("disabled", true);
                $("#offnet").prop("checked", false);
                $("#eoc").prop("disabled", true);
                $("#eoc").prop("checked", false);
                document.getElementById("diveryn").style.display = 'block';
                document.getElementById("showclassofserviceandsolution").style.display = 'block';
                $("#displayOnNetRules").show();
                $("#NearNetOnNetLocationID").val(obj.LocationID);
                $("#cos").val("");
                $("#showinterfacespeed").hide();
                $("#interfacespeed").val("");
                $("#proposedsolution").val("");
                $("#bandwidth").val("");
                $('#bandwidth').attr("disabled", false);
                $("#bandwidthethernet").val("");
                $('#bandwidthethernet').attr("disabled", false);
            }
            else {
                //document.getElementById("locationtype").value = "New";
                $('#locationtype').prop('disabled', false);
                document.getElementById("displayOnNet").style.display = 'none';
                $("#fiber").prop("checked", false);
                $("#fiber").prop("disabled", false);
                $("#offnet").prop("disabled", false);
                $("#offnet").prop("checked", false);
                $("#eoc").prop("disabled", false);
                $("#eoc").prop("checked", false);
                document.getElementById("diveryn").style.display = 'none';
                document.getElementById("showclassofserviceandsolution").style.display = 'none';
                $("#displayOnNetRules").hide();
                $("#cos").val("");
                $("#showinterfacespeed").hide();
                $("#interfacespeed").val("");
                $("#proposedsolution").val("");
                $("#bandwidth").val("");
                $("#NearNetOnNetLocationID").val(obj.LocationID);
                $('#bandwidth').attr("disabled", false);


            }
        }
    });
}