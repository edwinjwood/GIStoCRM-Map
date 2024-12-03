var webmap;
var view;
var search;
var popupTitle = "Location.";
var popupContent = "</br><button onclick='locationCheck()' type='button' class='btn btn-primary btn-md' id='ALoc' > Add Location </button>";
var longitude;
var latitude;
var opportunity;
var customersUN;
var segraLeadsLayer;
var customFilter;
var portalUrl;
var mapid;
// Builds Enterprise Map
require([
    "dojo/dom-construct",
    "dojo/dom-attr",
    "esri/config",
    "esri/portal/Portal",
    "esri/portal/PortalItem",
    "esri/portal/PortalUser",
    "esri/views/MapView",
    "esri/WebMap",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Compass",
    "esri/widgets/Home",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Search",
    "esri/widgets/LayerList",
    "esri/widgets/Popup",
    "esri/PopupTemplate",
    "esri/geometry/Point",
    "esri/tasks/Locator",
    "dojo/on",

    "dojo/dom",
    "dojo/domReady!"
], function (domConstruct, domAttr, esriConfig, Portal, PortalItem, PortalUser, MapView, WebMap, BasemapToggle, Compass, Home, Expand, BasemapGallery, Search, LayerList,
    Popup, Graphic, PopupTemplate, Point, Locator, on, /*domConstruct,*/ /*domStyle,*/ dom, domReady) {
    function fetchConfigValue(key) {

        const url = 'OpportunityCreationService.asmx/GetAllKeysAndValuesFromConfig';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty body as your web method doesn't require any parameters
        };

        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                // Assuming your web method returns an object with key-value pairs
                const configValues = result.d;

                // Check if the key exists in the fetched configuration values
                if (configValues.hasOwnProperty(key)) {
                    // Retrieve the value for the specified key
                    const value = configValues[key];

                    // Assign the value to a variable within this function scope
                    let assignedValue = value;


                    return assignedValue;
                } else {
                    throw new Error(`Key ${key} not found in configuration values`);
                }
            })
            .catch(error => {
                console.error('Error fetching configuration value:', error);
            });
    }
    fetchConfigValue('mapid').then((value) => { mapid = value });
    fetchConfigValue('portalUrl').then((value) => {
        portalUrl = value;
        esriConfig.portalUrl = portalUrl;
        sc_portal = new Portal(portalUrl);
        sc_portal.authMode = "immediate";
        sc_portal.load().then(function () {

            userName = sc_portal.credential.userId;
            //userName = 'edwinwood@LUMOSNET.com';
            //console.log("User role ===== " , sc_portal.user);
            $('#bulkButton').show();
            $('#opportunityType').show();
            /* $('#reportsLanding').show();*/
            callBackEnd(userName);
            //callBackEnd("Kirk.Hudgens@LUMOSNET.com");
            //userName = 'carl.wallin@LUMOSNET.com';
            //userName = 'Kirk.Hudgens@LUMOSNET.com';
            var x = userName.split("@")
            getFullname(x[0]);
            //getFullname('carl.wallin');
            //retrieveUserUnderManager("carl.wallin");
            //Pass a webmap instance to the map and specify the id for the webmap item

            webmap = new WebMap({
                portalItem: new PortalItem({
                    //mapid env variable
                    id: mapid
                })
            });

            view = new MapView({
                map: webmap,
                container: "viewDiv",
                zoom: 6,
                center: [-77, 37]
                //center: [-80, 34]
            });

            customFilter = domConstruct.create("button", {
                id: "customFilter",
                class: "esri-icon-filter esri-widget--button",
                //innerHTML: "Opportunity"
            });

            view.ui.add(customFilter, "bottom-right");
            domAttr.set(customFilter, 'data-toggle', 'modal');
            domAttr.set(customFilter, 'data-target', '#customLayerFilterModal');
            domAttr.set(customFilter, 'data-backdrop', 'false');
            domAttr.set(customFilter, 'data-keyboard', 'false');

            $.ajax({
                type: 'POST',
                url: 'UserRetrievalUnderManagerService.asmx/retrieveSystemUserUnderManager?manageName=' + x[0],
                data: JSON.stringify({ managerName: x[0] }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    var exp = "";
                    var leadsFilterExp = "";
                    if (msg.d == "No User Found") {
                        console.log("No User Found");
                        document.getElementById("displayAccountOwner").style.display = 'none';
                        document.getElementById("displayLeadsOwner").style.display = 'none';
                        exp = "ACCOUNT_OWNER_USERNAME = '" + userName + "'";
                        leadsFilterExp = "username = '" + userName + "'"
                    }
                    else {
                        var jsonData = jQuery.parseJSON(msg.d);
                        exp = "ACCOUNT_OWNER_USERNAME IN ('" + userName + "', ";
                        leadsFilterExp = "username IN ('" + userName + "', ";
                        for (var i = 0; i < jsonData.length; i++) {
                            var userObj = JSON.parse(jsonData[i])
                            console.log(userObj.FullName + ", " + userObj.DomainName);
                            var select = $("#accountOwner");
                            var option = $("<option/>");
                            var splitDOmainName = userObj.DomainName.split("\\");
                            option.text(userObj.FullName);
                            option.val(splitDOmainName[1] + "@" + splitDOmainName[0]);
                            select.append(option);
                            salesRepUnderManager.push(splitDOmainName[1] + "@" + splitDOmainName[0]);
                            var select2 = $("#leadOwner");
                            var option2 = $("<option/>");
                            option2.text(userObj.FullName);
                            option2.val(splitDOmainName[1] + "@" + splitDOmainName[0]);
                            select2.append(option2);
                        }

                        for (var i = 0; i < salesRepUnderManager.length - 1; i++) {
                            exp = exp + "'" + salesRepUnderManager[i] + "', "
                            leadsFilterExp = leadsFilterExp + "'" + salesRepUnderManager[i] + "', ";
                        }
                        exp = exp + "'" + salesRepUnderManager[salesRepUnderManager.length - 1] + "')";
                        leadsFilterExp = leadsFilterExp + "'" + salesRepUnderManager[salesRepUnderManager.length - 1] + "')";

                        //console.log(exp);
                        document.getElementById("displayAccountOwner").style.display = 'block';
                        document.getElementById("displayLeadsOwner").style.display = 'block';
                    }
                    console.log(exp);
                    //customersUN = new FeatureLayer({
                    //    //testsegra env variable

                    //    url: testsegra,
                    //    outFields: ["*"], // Return all fields so it can be queried client-side

                    //    definitionExpression: exp,
                    //    popupTemplate: {  // Enable a popup
                    //        title: "Customer Data UN",  // Show attribute value
                    //        content: [{
                    //            type: "fields",
                    //            fieldInfos: customerDataField
                    //        }]
                    //    },
                    //});
                    webmap.add(customersUN, 0);
                    //segraLeadsLayer = new FeatureLayer({
                    //    //outFields: ["*"], // Return all fields so it can be queried client-side
                    //    definitionExpression: leadsFilterExp,
                    //    popupTemplate: {  // Enable a popup
                    //        title: "Segra Leads", // Show attribute value
                    //        content: [{
                    //            type: "fields",
                    //            fieldInfos: segraLeadsField
                    //        }]
                    //    }
                    //});
                    webmap.add(segraLeadsLayer, 0);
                }
            });

            //var sqlExpressions = ["ACCOUNT_OWNER_USERNAME = 'morij@LUMOSNET'", "ACCOUNT_OWNER_USERNAME = 'brittanymcmickell@LUMOSNET'"];

            //var selectFilter = document.createElement("select");
            //selectFilter.setAttribute("class", "esri-widget esri-select");
            //selectFilter.setAttribute("style", "width: 275px; font-family: Avenir Next W00; font-size: 1em;");
            //selectFilter.addEventListener('change', function (event) {
            //    //setFeatureLayerFilter(event.target.value);
            //    setFeatureLayerViewFilter(event.target.value);
            //});

            //sqlExpressions.forEach(function (sql) {
            //    var option = document.createElement("option");
            //    option.value = sql;
            //    option.innerHTML = sql;
            //    selectFilter.appendChild(option);
            //});

            //view.ui.add(selectFilter, "bottom-left");


            $('input[name=customerAccountDataFilter]').change(function () {
                let expressionCustomerData = "";
                if ($(this).is(':checked')) {
                    //console.log($("#contractEndDateIsOnOrBefore").val());
                    expressionCustomerData = AddQueryForManager();
                    if ($("#BillingAccounts").val() != "" && $("#contractEndDateIsOnOrBefore").val() != "") {
                        var datum = Date.parse($("#contractEndDateIsOnOrBefore").val());
                        expressionCustomerData += " AND (billing_account_id like '" + $("#BillingAccounts").val() + "') AND (contract_enddate <= '" + datum + "')";
                    }
                    else if ($("#BillingAccounts").val() != "") {
                        expressionCustomerData += " AND (billing_account_id like '" + $("#BillingAccounts").val() + "')";
                    }
                    else if ($("#contractEndDateIsOnOrBefore").val() != "") {
                        var datum = Date.parse($("#contractEndDateIsOnOrBefore").val());
                        expressionCustomerData += " AND (contract_enddate <= '" + datum + "')";
                    }
                    console.log(expressionCustomerData);
                    setFeatureLayerViewFilter(expressionCustomerData, customersUN);
                } else {
                    expressionCustomerData = AddQueryForManager()
                    //expressionCustomerData = AddQueryForManager("ACCOUNT_OWNER_USERNAME", );
                    $("#BillingAccounts").val("");
                    $("#contractEndDateIsOnOrBefore").val("");
                    $("#accountOwner").val("");
                    var userAcc = (salesUserBiiliongPointDict[userName]);
                    $('#BillingAccounts').children().remove().end().append('<option value=""></option>');
                    for (var i = 0; i < userAcc.length; i++) {
                        var select2 = $("#BillingAccounts");
                        var option2 = $("<option/>")
                        option2.text(userAcc[i].Name + ' - ' + userAcc[i].Number);
                        option2.val(userAcc[i].Number);
                        select2.append(option2);
                    }
                    console.log(expressionCustomerData);
                    setFeatureLayerViewFilter(expressionCustomerData, customersUN);
                }
            });

            $('input[name=segraLeadsFilter]').change(function () {
                let expressionSegraLeads = "";
                if ($(this).is(':checked')) {
                    //expressionSegraLeads = "username = '" + userName + "'";
                    expressionSegraLeads = AddQueryForManagerForLeads();
                    if ($("#leadsStatus").val() != "") {
                        expressionSegraLeads += " AND status_rea = '" + $("#leadsStatus").val() + "'";
                    }
                    if ($("#campaign").val() != "") {
                        expressionSegraLeads += " AND (UPPER(source_cam) IN ('" + $("#campaign").val() + "'))";
                    }
                    if ($("#HQInSegraFiber").val() != "") {
                        expressionSegraLeads += " AND hq_in_segr = '" + $("#HQInSegraFiber").val() + "'";
                    }
                    if ($("#fullPotentialMRC").val() != "") {
                        expressionSegraLeads += " AND full_poten > '" + $("#fullPotentialMRC").val() + "'";
                    }
                    console.log(expressionSegraLeads);
                    setFeatureLayerViewFilter(expressionSegraLeads, segraLeadsLayer);
                }
                else {
                    //expressionSegraLeads = "username = '" + userName + "'";
                    expressionSegraLeads = AddQueryForManagerForLeads();
                    $("#leadsStatus").val("");
                    $("#campaign").val("");
                    $("#HQInSegraFiber").val("");
                    $("#fullPotentialMRC").val("");
                    $("#leadOwner").val("");
                    setFeatureLayerViewFilter(expressionSegraLeads, segraLeadsLayer);
                }
            });

            //function setFeatureLayerFilter(expression) {
            //    console.log(expression);
            //    customersUN.definitionExpression = expression;
            //}

            function setFeatureLayerViewFilter(expression, Layer) {
                //console.log(Layer);
                view.whenLayerView(Layer).then(function (featureLayerView) {
                    featureLayerView.filter = {
                        where: expression
                    };
                });
            }

            $("#accountOwner").change(function () {
                $("#customSwitches").prop("checked", false);
                if ($("#accountOwner").val() == "") {
                    var userAcc = (salesUserBiiliongPointDict[userName]);
                    $('#BillingAccounts').children().remove().end().append('<option value=""></option>');
                    for (var i = 0; i < userAcc.length; i++) {
                        var select2 = $("#BillingAccounts");
                        var option2 = $("<option/>")
                        option2.text(userAcc[i].Name + ' - ' + userAcc[i].Number);
                        option2.val(userAcc[i].Number);
                        select2.append(option2);
                    }
                }
                else {
                    var userAcc = (salesUserBiiliongPointDict[$("#accountOwner").val()]);
                    $('#BillingAccounts').children().remove().end().append('<option value=""></option>');
                    for (var i = 0; i < userAcc.length; i++) {
                        var select2 = $("#BillingAccounts");
                        var option2 = $("<option/>")
                        option2.text(userAcc[i].Name + ' - ' + userAcc[i].Number);
                        option2.val(userAcc[i].Number);
                        select2.append(option2);
                    }
                }
            });

            $("#BillingAccounts").change(function () {
                $("#customSwitches").prop("checked", false);
            });

            $("#contractEndDateIsOnOrBefore").change(function () {
                $("#customSwitches").prop("checked", false);
            });

            $("#leadsStatus").change(function () {
                $("#segraLeads").prop("checked", false);
            });

            $("#campaign").change(function () {
                $("#segraLeads").prop("checked", false);
            });

            $("#HQInSegraFiber").change(function () {
                $("#segraLeads").prop("checked", false);
            });

            $("#fullPotentialMRC").change(function () {
                $("#segraLeads").prop("checked", false);
            });

            $("#leadOwner").change(function () {
                $("#segraLeads").prop("checked", false);
            });
            var basemapToggle = new BasemapToggle({
                view: view,  // The view that provides access to the map's "streets" basemap
                nextBasemap: "streets"  // Allows for toggling to the "hybrid" basemap
            });
            //view.ui.add(basemapToggle, "bottom-right");
            basemapToggle.on('toggle', function (event) {
                console.log("current basemap title: ", event.current.title);
                console.log("previous basemap title: ", event.previous.title);
            });
            var compass = new Compass({
                view: view
            });

            // adds the compass to the top left corner of the MapView
            view.ui.add(compass, "top-left");

            var homeBtn = new Home({
                view: view
            });

            // Add the home button to the top left corner of the view
            view.ui.add(homeBtn, "top-left");

            var basemapGallery = new BasemapGallery({
                view: view,
                container: document.createElement("div")
            });

            // Create an Expand instance and set the content property to the DOM node of the basemap gallery widget
            // Use an Esri icon font to represent the content inside of the Expand widget
            var bgExpand = new Expand({
                view: view,
                content: basemapGallery.container,
                expandIconClass: "esri-icon-basemap"
            });

            // Add the expand instance to the ui
            view.ui.add(bgExpand, "top-left");

            // Creates Bulk Upload Button
            var bulkUpload = domConstruct.create("button", {
                id: "bulkButton",
                class: "btn btn-sm btn-primary",
                innerHTML: "Bulk Upload"
            });

            //Creates Power BI Reporting Button
            //var powerBiReporting = domConstruct.create("button", {
            //    id: "reportsLanding",
            //    class: "btn btn-sm btn-primary",
            //    innerHTML: "Power BI Reporting",
            //    onclick: "window.open('https://mssql-r1-as05.lumosnet.com/reports/browse/Dynamics');"
            //});

            var locationBox = domConstruct.toDom('<div id="cardDisplayContainer" class="card pull-left" style="width:300px;"><div id="LocHeader" class="card-header primary-color white-text"><h6 id="fullNameHeader">Welcome!</h6><select class="form-control " id="selectedAccount"><option value="">New Logo</option><option style="" value="Other">New Logo</option></select></div><div id="cardDisplay" style="display:none;"><div class="card-body" style="min-height:50px; max-height:250px; overflow:auto;" id="addLocationsCard"><div id="locationAlert"></div><div id="list" style="font-size:1.0rem;"></div></div><div class="card-footer" style="text-align:center;"><a class="btn btn-primary" onclick="GoToForm()">Confirm Locations</a></div></div></div>');
            //var locationBox = domConstruct.toDom('<div id="cardDisplayContainer" class="card pull-left" style="width:300px;"><div id="LocHeader" class="card-header primary-color white-text"><h6 id="fullNameHeader">Welcome!</h6><select class="form-control " id="selectedAccount"><option value=""></option></select></div><div id="cardDisplay" style="display:none;"><div class="card-body" style="min-height:50px; max-height:250px; overflow:auto;" id="addLocationsCard"><div id="locationAlert"></div><div id="list" style="font-size:1.0rem;"></div></div><div class="card-footer" style="text-align:center;"><a class="btn btn-primary" onclick="GoToForm()">Confirm Locations </a></div></div></div>');

            view.ui.add(locationBox, "top-left");

            domAttr.set(bulkUpload, 'data-toggle', 'modal');
            domAttr.set(bulkUpload, 'data-target', '.bd-example');

            // Adds the search widget to the top right corner of the view Search widget
            search = new Search({
                view: view,
                //popupOpenOnSelect: false,
                id: "searchLoc",

            });

            // Limit search to visible map area only
            search.defaultSources.withinViewEnabled = true;

            //Add Location button
            const customLocationAddAction = {
                title: "Add Location",
                id: "location-add-action",
                className: "esri-icon-plus-circled"
            };

            // Add to the view
            view.ui.add(search,
                { position: "top-right", index: 2, });
            view.ui.add(bulkUpload, "top-right");
            var location_address = "";
            search.on("select-result", function (searchevent) {
                var template = {
                    outFields: ["*"],
                    content: function (feature) {
                        var id = "test";
                        var div = document.createElement("div");
                        div.className = "myClass";
                        div.innerHTML = "<h4>${id}</h4><input id='buttonId' class='btn btn-primary btn-block' type='button' onclick=runCode(${id}) value='Click Me' title='Clickable button in popup'>";
                        return div;
                    },
                };

                //var Displaylat = searchevent.result.feature.geometry
                //console.log("Search Event result = " + searchevent.result.feature.geometry.Point.latitude);
                latitude = searchevent.result.feature.geometry.latitude;
                longitude = searchevent.result.feature.geometry.longitude;
                location_string = searchevent.result.name;

                view.popup.title = popupTitle;
                //view.popup.actions.pop(customLocationAddAction);
                if (view.popup.actions.length == 1 && view.popup.actions[1] != customLocationAddAction) {
                    view.popup.actions.push(customLocationAddAction);
                }

                //view.popup.title.font
                view.popup.content = "<br><label> Location: </label>" + searchevent.result.name +
                    "<br> <label> X: </label> " + searchevent.result.feature.geometry.latitude + "<label> ,  Y: </label> " + searchevent.result.feature.geometry.longitude +
                    popupContent;
                view.popup.open({
                    location: searchevent.result.feature.geometry
                });
                search.clear();
            });

            // Add widget to the top right corner of the view
            var layerList = new LayerList({
                view: view,
                container: document.createElement("div"),
                listItemCreatedFunction: function (event) {
                    const item = event.item;
                    item.panel = {
                        content: "legend",
                        open: false
                    };
                }
            });
            var bgExpand2 = new Expand({
                view: view,
                content: layerList.container,
                expandIconClass: "esri-icon-layer-list"
            });


            //add widget to substitute Location card

            //var locationCardIcon = new Expand({
            //    view: view,
            //    content: locationBox.cardDisplayContainer,
            //    expandIconClass: "esri-icon-documentation"
            //});
            //view.ui.add(locationCardIcon, "top-left");

            //New Button for Opportunity

            // Creates Bulk Upload Button
            opportunity = domConstruct.create("button", {
                id: "opportunityType",
                class: "btn btn-sm btn-primary",
                innerHTML: "Connect Opportunity"
            });

            domAttr.set(opportunity, 'data-toggle', 'modal');
            domAttr.set(opportunity, 'data-target', '.opportunity-type');
            view.ui.add(opportunity, "top-right");
            //view.ui.add(powerBiReporting, "top-right");
            view.ui.add(bgExpand2, "top-right");

            //const customTableAddAction = {
            //    title: "Table",
            //    id: "table-action",
            //    className: "esri-icon-table"
            //};

            //view.popup.actions.push(customTableAddAction);

            var fullscreen = new Fullscreen({
                view: view
            });
            view.ui.add(fullscreen, "top-right");


            view.popup.on("trigger-action", function (event) {
                if (event.action.id === "table-action") {
                    openTable(event);
                    view.popup.close();
                }
                if (event.action.id === "location-add-action") {
                    locationCheck();
                    view.popup.actions.pop(customLocationAddAction);
                }
            });

            function AddQueryForManager() {
                if (salesRepUnderManager.length == 0) {
                    return "(ACCOUNT_OWNER_USERNAME = '" + userName + "')";
                }
                else {
                    if ($("#accountOwner").val() != "" && $('#customSwitches').is(':checked')) {
                        var exp = "ACCOUNT_OWNER_USERNAME = '" + $("#accountOwner").val() + "'";
                        return exp;
                    }
                    else {
                        var exp = "ACCOUNT_OWNER_USERNAME IN ('" + userName + "', ";
                        for (var i = 0; i < salesRepUnderManager.length - 1; i++) {
                            exp = exp + "'" + salesRepUnderManager[i] + "', "
                        }
                        exp = exp + "'" + salesRepUnderManager[salesRepUnderManager.length - 1] + "')";
                        return exp;
                    }
                }
            }
            function AddQueryForManagerForLeads() {
                if (salesRepUnderManager.length == 0) {
                    return "(username = '" + userName + "')";
                }
                else {
                    if ($("#leadOwner").val() != "" && $('#segraLeads').is(':checked')) {
                        var exp = "username = '" + $("#leadOwner").val() + "'";
                        return exp;
                    }
                    else {
                        var exp = "username IN ('" + userName + "', ";
                        for (var i = 0; i < salesRepUnderManager.length - 1; i++) {
                            exp = exp + "'" + salesRepUnderManager[i] + "', "
                        }
                        exp = exp + "'" + salesRepUnderManager[salesRepUnderManager.length - 1] + "')";
                        return exp;
                    }
                }
            }



            // Usage example


            //function powerBIReportPage() {
            //	console.log("Button is working!");
            //}

            //function openTable(event) {
            //    const layer = event.target.selectedFeature.layer;
            //    const featureTable = new FeatureTable({
            //        layer
            //    });
            //    view.ui.add(featureTable, "manual");
            //}
            //// Set up a locator task using the world geocoding service
            //view.popup.autoOpenEnabled = false;
            /*
            //view.popup.autoOpenEnabled = false;
            view.on("click", function (event) {
                //view.popup.close();
                // Get the coordinates of the click on the view
                latitude = event.mapPoint.latitude;
                longitude = event.mapPoint.longitude;
                console.log(latitude + " " + longitude);
                 view.popup.title = "WARNING !!! You have moved the popup from it's initial location!!!";
                 view.popup.content = "<div><br><label> Location:&nbsp; </label>" + location_string + 
                "<br> <label> X: </label> " + longitude + "<label> ,  Y: </label> " + latitude +
                 popupContent + "</div>";
                view.popup.open({
                    // Set the popup's title to the coordinates of the location
                    //title: "Reverse geocode: [" + lon + ", " + lat + "]",
                    location: event.mapPoint // Set the location of the popup to the clicked location
                });
            });
           */
        });
    });

    // Setting authMode to immediate signs the user in once loaded

    // Once portal is loaded, user signed in

});



