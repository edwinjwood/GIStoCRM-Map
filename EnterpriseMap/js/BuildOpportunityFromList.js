// Fucntion that builds a list item to be displayed in the create an oportuniy form 
function GoToForm() {
    var acc = $("#selectedAccount").val();
    if (acc !== "") {
        if (acc == "Other") {
            $("#o_account_name").val("");
            $("#o_account_number").val("None");
            $("#o_account_id").val("None");
            $(".accountDivs").show();
            $(".contactInfo").show();
            $(".ifNewLogo").show();
            $(".accountDivsNumber").hide();
            $("#o_account_name").attr("readonly", false);
            if (primaryContactAddress !== "") {
                var primaryContactAddressSplit = primaryContactAddress.split(",");
                $("#c_street").val(primaryContactAddressSplit[0]);
                $("#c_city").val(primaryContactAddressSplit[1]);
                $("#c_state").val(primaryContactAddressSplit[2]);
                $("#c_zip").val(primaryContactAddressSplit[3]);
                $("#c_street").attr("readonly", true);
                $("#c_city").attr("readonly", true);
                $("#c_state").attr("readonly", true);
                $("#c_zip").attr("readonly", true);
            }
            else {
                $("#c_street").attr("readonly", false);
                $("#c_city").attr("readonly", false);
                $("#c_state").attr("readonly", false);
                $("#c_zip").attr("readonly", false);
            }
            if (headQuartersAddress !== "") {
                var headQuartersAddressSplit = headQuartersAddress.split(",");
                $("#o_account_hq_street").val(headQuartersAddressSplit[0]);
                $("#o_account_hq_city").val(headQuartersAddressSplit[1]);
                $("#o_account_hq_state").val(headQuartersAddressSplit[2]);
                $("#o_account_hq_zip").val(headQuartersAddressSplit[3]);
                $("#o_account_hq_street").attr("readonly", true);
                $("#o_account_hq_city").attr("readonly", true);
                $("#o_account_hq_state").attr("readonly", true);
                $("#o_account_hq_zip").attr("readonly", true);
            }
            else {
                $("#o_account_hq_street").attr("readonly", false);
                $("#o_account_hq_city").attr("readonly", false);
                $("#o_account_hq_state").attr("readonly", false);
                $("#o_account_hq_zip").attr("readonly", false);
            }
        }
        else {

            var jsonData = $("#selectedAccount").val();
            var xyz = jsonData.split("&&$$");
            $(".accountDivsNumber").show();
            $(".ifNewLogo").hide();
            $("#o_account_name").val(xyz[0]);
            $("#o_account_name").attr("readonly", true);
            $("#o_account_number").val(xyz[1]);
            $("#o_account_id").val(xyz[2]);
            $(".accountDivs").show();
            $(".contactInfo").hide();
        }
        if (NewOpp == false) {
            $(".accountHide").hide();
            $("#opportunity_name").val(oppName);
            $("#opportunity_name").prop("readonly", true);
            $(".contactInfo").hide();
            document.getElementById("display_newOppInfo").style.display = "none";
            //document.getElementById("opportunity_industry").value = "";
            $("#channel").val("enterprise");
            $("#opportunity_contract").val("New");
            $("#date").val("");
            $("#note").val("");
            $(".accountDivs").hide();
        }
        else {
            $("#opportunity_name").val("");
            document.getElementById("display_newOppInfo").style.display = "block";
            //document.getElementById("opportunity_industry").value = "";
            $("#channel").val("enterprise");
            $("#opportunity_contract").val("New");
            $("#date").val("");
            $("#note").val("");
        }
        if (hiddenListData && (new_location_counter != 0)) {
            var username = userName.split('@');
            $("#employee_username").val(username[0]);
            var ul = document.getElementById("serviceLocations");
            var lis;
            while ((lis = ul.getElementsByTagName("li")).length > 0) {
                ul.removeChild(lis[0]);
            }
            for (var i = 0; i < hiddenListData.length; i++) {
                var location_display = "";
                var location_num = i;
                location_display = location_display + i.toString() + " - ";
                console.log(hiddenListData[i]);
                $.each(hiddenListData[i], function (i, field) {
                    if (field && field.name == 'sla')
                        location_display = location_display + field.value;
                    if (field && field.name == 'address')
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'apartment' && (field.value !== ''))
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'locationtype')
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'bandwidth' && field.value !== "")
                        location_display = location_display + ", " + field.value;

                    if (field && field.name == 'lat_long')
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'fiber' && field.value == 'Fiber')
                        location_display = location_display + ", fiber - true";
                    if (field && field.name == 'offnet' && field.value == 'Offnet')
                        location_display = location_display + ", offnet - true";
                    if (field && field.name == 'eoc' && field.value == 'Eoc')
                        location_display = location_display + ", eoc - true";
                    if (field && field.name == 'diversity' && field.value == true)
                        location_display = location_display + ", diversity - true";
                    if (field && field.name == 'diversitytype' && field.value !== "")
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'cos' && field.value !== "")
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'interfacespeed' && field.value !== "")
                        location_display = location_display + ", " + field.value;
                    if (field && field.name == 'proposedsolution' && field.value !== "")
                        location_display = location_display + ", " + field.value;
                });
                var li = document.createElement("li");
                var text = document.createTextNode(location_display);
                li.appendChild(text);
                ul.appendChild(li);
            }
            $('#ConnectToDynamcis').modal('show');
        } else {
            alert('Please add at least 1 location to proceed');
            errorMessage = 'Please add at least 1 location to proceed';
            elementName = 'mainAlert';
            showError(errorMessage, elementName);
        }
    } else {
        errorMessage = 'Please select an account, if an account is not present please talk to your manager';
        elementName = 'mainAlert';
        showError(errorMessage, elementName, 'html,body');
        alert("Please select an account, if an account is not present please talk to your manager")
    }
}