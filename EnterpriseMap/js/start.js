var salesUserBiiliongPointDict = {};
$(document).ready(function () {
    // Animate loader off screen
    //$('#initModal').modal('show');
    $(".loader").fadeIn("slow");
    $(".loader2").fadeIn("slow");
    $("#clickLink").trigger('click');
    //resetLocInfoModal();
    numericClickEvent();
    setupBulkButton();
    setupOpportunityTypeButton();
    $('.region').hide();
    (function () {
        var elem = document.createElement('input');
        elem.setAttribute('type', 'date');
        if (elem.type === 'text') {
            $('#date').datepicker();
        }
    })();

    $("#customLayerFilterModal .modal-dialog").draggable({
        handle: ".modal-header",

    });
    $("#customLayerFilterModal").on('shown.bs.modal', function () {
        $("body").removeClass("modal-open");
        $(".custom-modal").removeClass("modal");
    });

    $('.panel-collapse').on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('active');
    });

    $('.panel-collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('active');
    });



});

// Function that gets account information based on the user
function callBackEnd(name) {
    $.ajax({
        type: 'POST',
        url: 'UserAccountsInformatin.asmx/getUserAccounts?name=' + name,
        data: JSON.stringify({ name: name }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            var jsonData = jQuery.parseJSON(msg.d);
            salesUserBiiliongPointDict[name] = jsonData;
            for (var i = 0; i < jsonData.length; i++) {

                var select = $("#selectedAccount");
                var option = $("<option/>")
                option.text(jsonData[i].Name + ' - ' + jsonData[i].Number);
                option.val(jsonData[i].Name + "&&$$" + jsonData[i].Number + "&&$$" + jsonData[i].AID);
                select.append(option);
                console.log(jsonData[i].Name + ' - ' + jsonData[i].Number);
                var select2 = $("#BillingAccounts");
                var option2 = $("<option/>")
                option2.text(jsonData[i].Name + ' - ' + jsonData[i].Number);
                option2.val(jsonData[i].Number);
                select2.append(option2);
            }
            $(".loader2").hide();
            $(".loader").hide();

        }
    });

}

//Function to retrieve all the executives under director/manager
//function retrieveUserUnderManager(managerName) {
//    salesRepUnderManager = [];
//    $.ajax({
//        type: 'POST',
//        url: 'UserRetrievalUnderManagerService.asmx/retrieveSystemUserUnderManager?manageName=' + managerName,
//        data: JSON.stringify({ managerName: managerName }),
//        contentType: 'application/json; charset=utf-8',
//        dataType: 'json',
//        success: function (msg) {
//            if (msg.d == "No User Found") {
//                console.log("No User Found");
//                document.getElementById("displayAccountOwner").style.display = 'none';
//                customerUN.definitionExpression= "ACCOUNT_OWNER_USERNAME = '" + userName + "'"
//            }
//            else {
//                var jsonData = jQuery.parseJSON(msg.d);
//                for (var i = 0; i < jsonData.length; i++) {
//                    var userObj = JSON.parse(jsonData[i])
//                    console.log(userObj.FullName + ", " + userObj.DomainName);
//                    var select = $("#accountOwner");
//                    var option = $("<option/>");
//                    var splitDOmainName = userObj.DomainName.split("\\");
//                    option.text(userObj.FullName);                    
//                    option.val(splitDOmainName[1] + "@" + splitDOmainName[0]);
//                    select.append(option);
//                    salesRepUnderManager.push(splitDOmainName[1] + "@" + splitDOmainName[0]);
//                    customersUN.definitionExpression = "ACCOUNT_OWNER_USERNAME = 'deepak.begrajka@LUMOSNET'";
//                }
//                document.getElementById("displayAccountOwner").style.display = 'block';
//            }

//        }
//    });
//}

// Function that gets the full name of user based on their email name provided 
function getFullname(name1) {
    $.ajax({
        type: 'POST',
        url: 'UserInfo.asmx/getUsername?name1=' + name1,
        data: JSON.stringify({ name1: name1 }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            setAutoComplete();
            var jsonData = jQuery.parseJSON(msg.d);
            $("#fullNameHeader").text("Welcome   " + jsonData + "!");
            $('#cardDisplayContainer').show();
        }
    });
}

// Fucntion that makes specific fields numeric characters only
function numericClickEvent() {
    $('.numeric').off();
    $('.numeric').on('keypress', function (event) {
        var keyCode = (event.which) ? event.which : event.keyCode
        return !(keyCode > 31 && (keyCode < 48 || keyCode > 57));
    });
}

// Function that displays an error alert message for the UI
function showError(errorMessage, elementName, location) {
    $('#' + elementName).empty();
    $('#' + elementName).append('<div id="app-error-alert" class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + errorMessage);
    $(location).animate({ scrollTop: 0 }, 'slow');
}

