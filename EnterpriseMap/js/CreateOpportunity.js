// Function that connects to Dynamics and sends opportunity
function ConnectToDynamics() {
    var errorMessage = "";
    EmployeeName = $("#employee_username").val();
    if (NewOpp == true) {
        if (hiddenListData[0][3].name == "address")
            var EContactAddress = hiddenListData[0][3].value;
        var EAccountName = $("#o_account_name").val();
        var EAccountNumber = $("#o_account_number").val();
        let EAccountPhone = $("#o_account_hq__num").val();
        let EAccountStreet = $("#o_account_hq_street").val();
        let EAccountCity = $("#o_account_hq_city").val();
        let EAccountState = $("#o_account_hq_state").val();
        let EAccountZip = $("#o_account_hq_zip").val();
        let EAccountEmail = $("#o_account_hq__email").val();
        var EAccountID = $("#o_account_id").val();
        let EAccountUrl = $("#o_account_url").val() != "" || $("#o_account_url").val() != undefined ? $("#o_account_url").val() : "";
        var EOpportunityName = $("#opportunity_name").val();
        var EOpportunityContract = $("#opportunity_contract").val();
        var SalesChannel = $('#channel').val();
        var ContactName = $('#con_name').val();
        var ContactNumber = $('#c_num').val();
        var ContactEmail = $('#email').val();
        var ContactStreet = $('#c_street').val();
        var ContactCity = $('#c_city').val();
        var ContactState = $('#c_state').val();
        var ContactZip = $('#c_zip').val();
        //var AppointmentDate = $('#date').val();
        //var AppointmentDateNote = $('#note').val();
        /*   var EOpportunityselectedTermArray = [];*/
        //var EOpportunityIndustry = $('#opportunity_industry').val();
        //console.log(EOpportunityIndustry);

        var EEstimaedCloseDate = document.getElementById("EstimatedCloseDateOpp").value;
        var EEstimaedRevenue = document.getElementById("EstimatedRevenue").value;
        $('#checkboxes input:checked').each(function () {
            EOpportunityselectedTermArray.push($(this).attr('id'));
        });
        if (EOpportunityName.length == 0)
            errorMessage += "Opportunity Name missing. <br>"
        /*if (EOpportunityselectedTermArray.length == 0)
            errorMessage += "Select Term. <br>"*/
        if (EAccountNumber == "None") {
            if (EAccountName.length == 0) {
                errorMessage += "Account Name missing. <br>"
            }
            if (EAccountPhone.length == 0) {
                errorMessage += "Account Phone Number missing. <br>"
            }
            if (EAccountEmail.length == 0) {
                errorMessage += "Account Email missing. <br>"
            }
            if (EAccountStreet.length == 0) {
                errorMessage += "HQ Street missing. <br>"
            }
            if (EAccountCity.length == 0) {
                errorMessage += "HQ City missing. <br>"
            }
            if (EAccountState.length == 0) {
                errorMessage += "HQ State missing. <br>"
            }
            if (EAccountZip.length == 0) {
                errorMessage += "HQ Zip missing. <br>"
            }

            if (ContactName.length == 0)
                errorMessage += "Contact Name missing. <br>"
            if (ContactNumber.length == 0)
                errorMessage += "Phone number missing. <br>"
            if (ContactEmail.length == 0)
                errorMessage += "Email missing. <br>"
            if (ContactStreet.length == 0)
                errorMessage += "Primary Contact Street Ad missing. <br>"
            if (ContactCity.length == 0)
                errorMessage += "Primary Contact City missing. <br>"
            if (ContactState.length == 0)
                errorMessage += "Primary Contact State missing. <br>"
            if (ContactZip.length == 0)
                errorMessage += "Primary Contact Zip missing. <br>"

        }
        /*if (EOpportunityIndustry == "")
            errorMessage += "Industry not selected. <br>";*/ //Removing Industry
        //if (!AppointmentDate)
        //    errorMessage += "Appointment date not present. <br>";
        //if (AppointmentDateNote == "")
        //    errorMessage += "Appointment Note not present. <br>";
        if (EEstimaedCloseDate.length == 0) {
            errorMessage += "Estimated Close Date missing. <br>"
        }
        if (EEstimaedRevenue.length == 0) {
            errorMessage += "Estimated Revenue missing. <br>"
        }
        if (errorMessage == "") {
            salesChannelForLocation = SalesChannel;
            $('#ConnectToDynamcis').modal('hide');
            var ObjLoc = {
                'EmployeeName': EmployeeName,
                'EAccountName': EAccountName,
                'EAccountNumber': EAccountNumber,
                'EAccountID': EAccountID,
                'EAccountPhone': EAccountPhone,
                'EAccountEmail': EAccountEmail,
                'EAccountStreet': EAccountStreet,
                'EAccountCity': EAccountCity,
                'EAccountState': EAccountState,
                'EAccountZip': EAccountZip,
                'EAccountUrl': EAccountUrl,
                'EOpportunityName': EOpportunityName,
                'EOpportunityTerm': EOpportunityselectedTermArray,
                'EOpportunityContract': EOpportunityContract,
                'SalesChannel': SalesChannel,
                'ContactName': ContactName,
                'ContactNumber': ContactNumber,
                'ContactEmail': ContactEmail,
                'ContactStreet': ContactStreet,
                'ContactCity': ContactCity,
                'ContactState': ContactState,
                'ContactZip': ContactZip,
                //'AppointmentDate': AppointmentDate,
                //'AppointmentDateNote': AppointmentDateNote,
                //'Industry': EOpportunityIndustry,
                //'EContactAddress': EContactAddress,
                'EEstimaedCloseDate': EEstimaedCloseDate,
                'EEstimaedRevenue': EEstimaedRevenue,
            };
            var jSon = JSON.stringify({ obj: ObjLoc });
            $.ajax({
                type: 'POST',
                beforeSend: function () { showLoader(); },
                url: 'OpportunityCreationService.asmx/createTheOpportunity',
                contentType: 'application/json; charset=utf-8',
                data: jSon,
                dataType: 'json',
                success: function (msg) {
                    var op = (msg.d).split("&&&&");
                    if (op[0] == "Success") {
                        oppId = op[1];
                        $('#SuccessModal').modal('show');
                        var txt = "Opportunity " + op[2] + " is created";
                        $("#oppcreatedid").text(txt);
                        $("#oppCreatedNotification").show();
                        createLocationsObject(oppId, EOpportunityselectedTermArray, EmployeeName);
                    }
                    else {
                        hideLoader();
                        var errorMessage = "Opportunity was not created some of the input values were wrong please try again";
                        alert(msg.d);
                        showError(errorMessage, 'mainAlert', 'html,body');
                    }
                },
                error: function (request, status, error) {
                    alert(request.responseText);
                }
            });
        }
        else
            showError(errorMessage, 'dynamicsFormAlert', '#ConnectToDynamcis');
    }
    else {
        var EOpportunityselectedTermArray = [];
        $('#checkboxes input:checked').each(function () {
            EOpportunityselectedTermArray.push($(this).attr('id'));
        });
        /*if (EOpportunityselectedTermArray.length == 0)
            errorMessage += "Select Term. <br>"*/
        if (errorMessage == "") {
            $('#ConnectToDynamcis').modal('hide');
            $('#SuccessModal').modal('show');
            $("#oppExistingNotification").show();
            createLocationsObject(oppId, EOpportunityselectedTermArray, EmployeeName);
        }
        else
            showError(errorMessage, 'dynamicsFormAlert', '#ConnectToDynamcis');
    }
}
var expanded = false;

function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
        var selected = [];
        $('#checkboxes input:checked').each(function () {
            selected.push($(this).attr('id'));
        });
        console.log(selected);
        document.getElementById("selectMoreTerm").text = selected.length != 0 ? selected : "Select one or more term ";
    }
}
