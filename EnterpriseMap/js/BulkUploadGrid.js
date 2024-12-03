var gridOptions = {
    columnDefs: [
        { field: "Index", minWidth: 100 },
        {
            field: "Select", headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, minWidth: 100,
        },
        {
            field: "Name", minWidth: 100, editable: true,
        },
        {
            field: "Street", minWidth: 140, editable: true,
        },
        { field: "City", minWidth: 80, editable: true },
        { field: "State", minWidth: 90, editable: true },
        { field: "Zip", editable: true, filter: 'agNumberColumnFilter' },
        { headerName: "Lat", minWidth: 90, field: "Latitude" },
        { headerName: "Long", minWidth: 90, field: "Longitude" },

        {
            headerName: "Location Type 1", field: "LocationType1", minWidth: 150, cellRenderer: function (params) {
                return createDropDown(params, "LocationType1", locationType1Array, "invalid-cell", true);
            },
        },
        {
            headerName: "Primary Use Type", field: "LocationSubType", minWidth: 150, cellRenderer: function (params) {
                return createDropDown(params, "LocationSubType", locationSubTypeAray, "invalid-cell");
            },
        },
        {
            headerName: "Multi Tenant", field: "MultiTenant", minWidth: 150, cellRenderer: function (params) {

                return params.data.LocationType1 == "Building" ? createDropDown(params, "MultiTenant", multiTenantArray, "invalid-cell") : createDropDown(params, "MultiTenant", multiTenantArray);
            }
        },
        {
            field: "Floor", minWidth: 90, cellRenderer: function (params) {

                return params.data.LocationType1 == "Building" ? createDropDown(params, "Floor", floorArray, "invalid-cell") : createDropDown(params, "Floor", floorArray);
            }
        },
        {
            headerName: "STE/APT/RM", field: "Ste_Bldg_Flr", minWidth: 140, cellRenderer: function (params) {
                return createDropDown(params, "Ste_Bldg_Flr", ste_aptArray, false, true);
            }
        },
        {
            headerName: "STE/APT/RM#", field: "Ste_Bldg_Flr_num", minWidth: 140, cellRenderer: function (params) {
                return params.data.Ste_Bldg_Flr != "" ? createInputBox(params, "Ste_Bldg_Flr_num", "invalid-cell") : createInputBox(params, "Ste_Bldg_Flr_num");
            }
        },
        //{ field: "Npanxx", minWidth: 100, editable: true, maxLength: 6 },
        {
            headerName: "Submit FSR", field: "OnNet", minWidth: 130,
            cellRenderer: function (params) {
                return createCheckBox(params, "OnNet", true);
            }
        },
        {
            headerName: "Submit ONR", field: "OffNet", hide: true, minWidth: 130, cellRenderer: function (params) {
                return createCheckBox(params, "OffNet", true);
            }
        },
        //{
        //    headerName: "Submit EOC", field: "Eoc", minWidth: 130, cellRenderer: function (params) {
        //        return createCheckBox(params, "Eoc");
        //    }
        //},
        {
            field: "Diversity", minWidth: 120, cellRenderer: function (params) {
                return createCheckBox(params, "Diversity", true);
            }
        },
        {
            headerName: "Diversity Type", field: "Diversity_Type", minWidth: 145, cellRenderer: function (params) {
                if (params.data.Diversity == true)
                    return createDropDown(params, "Diversity_Type", diversitytypeArray, "invalid-cell");
                else
                    return createDropDown(params, "Diversity_Type", diversitytypeArray);
            }
        },
        {
            field: "Bandwidth", minWidth: 120, cellRenderer: function (params) {
                //return createDropDown(params, "Bandwidth", bandwidthArray2);
                return params.data.LocationType1 == "OnNet" ? createDropDown(params, "Bandwidth", bandwidthArray2, "invalid-cell") : createDropDown(params, "Bandwidth", bandwidthArray2);

            },
        },
        {
            headerName: "Location Type", field: "Location_Type", minWidth: 145, cellRenderer: function (params) {
                return createDropDown(params, "Location_Type", locationtypeArray, "invalid-cell");
            }
        },
        {
            headerName: "Class of Service", field: "Class_of_Service", minWidth: 150, cellRenderer: function (params) {
                if (params.data.OnNet == true || params.data.OffNet == true)
                    return createDropDown(params, "Class_of_Service", classofservicetypearray, "invalid-cell");
                else
                    return createDropDown(params, "Class_of_Service", classofservicetypearray);
            }
        },
        {
            headerName: "Interface Speed", field: "Interface_Speed", minWidth: 150, cellRenderer: function (params) {
                if (params.data.OffNet == true)
                    return createDropDown(params, "Interface_Speed", interfacespeedtypearray, "invalid-cell");
                else
                    return createDropDown(params, "Interface_Speed", interfacespeedtypearray);
            }
        },
        {
            headerName: "Proposed Solution", field: "Proposed_Solution", minWidth: 250, cellRenderer: function (params) {
                if (params.data.OnNet == true || params.data.OffNet == true)
                    return createTextArea(params, "Proposed_Solution", "invalid-cell");
                else
                    return createTextArea(params, "Proposed_Solution");
            }
        },
    ],
    defaultColDef: {
        resizable: true,
        minWidth: 80,
        flex: 1,
        filter: true
        //enablePivot: true,
    },
    pagination: true,
    paginationPageSize: 10,
    paginationNumberFormatter: function (params) {
        return '[' + params.value.toLocaleString() + ']';
    },
    rowSelection: 'multiple',
    rowMultiSelectWithClick: true,
    components: {
        customLoadingOverlay: CustomLoadingOverlay,
    },
    loadingOverlayComponent: 'customLoadingOverlay',
    loadingOverlayComponentParams: {
        loadingMessage: 'Loading Rows... Please Wait...',
    },
    animateRows: true,
    //domLayout:"autoHeight",
    //rowHeight: 80,
    rowData: [],

};

function onPageSizeChanged(newPageSize) {
    var value = document.getElementById('page-size').value;
    gridOptions.api.paginationSetPageSize(Number(value));
}

var rowData;
var columns;
var completeObj = {};
var records = [];
var latlong = {};
var locationName = {};
var fullLocationData0 = [];

function Upload() {
    if (opportunityTypeCheck == true) {
        $(".example-header").prependTo(".ag-paging-panel");
        $(".example-header").show();
        var fileUpload = $("#csvfile")[0];
        var regex = /^([a-zA-Z0-9\(\)\s_\\.\-:])+(.csv)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var rows = e.target.result.split("\n").slice(1);
                    rows.pop();
                    if (rows.length > 5000) {
                        rows = rows.slice(0, 5000);
                    }
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].value === "" ){
                            delete rows[i]
                        };
                        if (rows[i].split(',').length != 1 ) {
                        //    rowData = rows.map(function (row) {
                        //        var values = row.split(",");
                        //        var data = {};
                        //        columns = ["Index", "Name", "Street", "City", "State", "Zip", "Latitude", "Longitude", "Location_Type", "LocationType1", "LocationSubType", "MultiTenant", "Floor", "Ste_Bldg_Flr", "Ste_Bldg_Flr_num", "Attach_A_to_Z", "OnNet", "OffNet", "Bandwidth", "Class_of_Service", "Interface_Speed", "Proposed_Solution", "Diversity", "Diversity_Type", "NearNet_Distance", "NearNet_OSP_Cost", "NearNet_Equipment_Cost", "Request_Completion_Date"];
                        //        columns.forEach(function (col, index) {
                        //            data[col] = values[index];
                        //        });
                        //        return data;
                        //    });

                        //    gridOptions.api.applyTransaction({ add: rowData });
                        //    break;
                        }
                    }
                    setTimeout(function () { buildLocationObj(rows); }, 3000);

                }
                reader.readAsText(fileUpload.files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    }
    else {
        console.log("Please select opportunity type first");
        alert("Please select opportunity type first");
    }
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');
    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});

function buildTableForGrid(data, name/*, npanxxArry, aptarray*/) {
    var num = 1;
    rowData = [];
    columns = {
        'A': 'Index',
        'B': 'Select',
        'C': 'Name',
        'D': 'LocationType1',
        'E': 'LocationSubType',
        'F': 'MultiTenant',
        'G': 'Street',
        'H': 'Floor',
        'I': 'Ste_Bldg_Flr',
        'J': 'Ste_Bldg_Flr_num',
        'K': 'City',
        'L': 'State',
        'M': 'Zip',
        //'N': 'Npanxx',
        'N': 'OnNet',
        //'O': 'OffNet',
        //'L': 'Eoc',
        'P': 'Diversity',
        'Q': 'Diversity_Type',
        'R': 'Bandwidth',
        'S': 'Location_Type',
        'T': 'Class_of_Service',
        'U': 'Interface_Speed',
        'V': 'Proposed_Solution',
        'W': 'Latitude',
        'X': 'Longitude',
    };
    $.each(data, function (index, value) {
        var row = {};
        row[columns['A']] = index + 1;
        row[columns['B']];
        if (name[index]) {
            console.log(name[index]);
            if (name[index].length > 38) {
                row[columns['C']] = "Z - " + num;
                num++;
            }
            else {
                row[columns['C']] = name[index];
            }
        } else {
            row[columns['C']] = "Z - " + num;
            num++
        }
        row[columns['D']] = '';
        row[columns['E']] = '';
        row[columns['F']] = '';
        row[columns['G']] = value['address'];
        row[columns['H']] = '';
        row[columns['I']] = '';
        row[columns['J']] = '';
        row[columns['K']] = value['city'];
        row[columns['L']] = value['region'];
        row[columns['M']] = value['postal'];
        row[columns['N']];
        //row[columns['O']];
        row[columns['P']];
        //row[columns['L']];
        row[columns['Q']] = '';
        row[columns['R']] = '';
        row[columns['S']] = '';
        row[columns['T']] = '';
        row[columns['U']] = '';
        row[columns['V']] = '';
        row[columns['W']] = value['latitude'];
        row[columns['X']] = value['longitude'];
        rowData.push(row);
    });

    //hideLoader();
    gridOptions.api.applyTransaction({ add: rowData });

//    gridOptions.api.setRowData(rowData);
//    gridOptions.rowData = rowData;
      gridOptions.api.hideOverlay();
}
function modelOpen() {
    $('#myModal').modal('show');
}

function createCheckBox(params, fieldname, isRedraw) {
    var input = document.createElement('input');
    input.type = "checkbox";
    input.checked = params.value;
    input.addEventListener('click', function (event) {
        params.value = !params.value;
        params.node.data[fieldname] = params.value;
        if (isRedraw) {
            callRedraw(params.rowIndex);
        }
    });
    return input;
}

function createDropDown(params, fieldname, array, onInitClass, isRedraw) {
    var select = document.createElement("select");
    select.setAttribute("class", "form-control");
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        if (array[i] == "10000Mb") {
            option.text = "10Gb";
            option.value = array[i];
        }
        else if (array[i] == "5000Mb") {
            option.text = "5Gb";
            option.value = array[i];
        }
        else if (array[i] == "1000Mb") {
            option.text = "1Gb";
            option.value = array[i];
        }
        else if (array[i] == "2000Mb") {
            option.text = "2Gb";
            option.value = array[i];
        }
        else {
            option.text = array[i];
            option.value = array[i];
        }
        select.appendChild(option);
    }
    select.addEventListener("change", function (event) {
        if (event) {
            //console.log(event.target.value);
            params.node.data[fieldname] = event.target.value;
            params.value = event.target.value;
            if (onInitClass && onInitClass != null) {
                if (params.value == "")
                    select.classList.add('invalid-cell');
                else
                    select.classList.remove('invalid-cell');
            }
            if (isRedraw) {
                callRedraw(params.rowIndex);
            }
        }
    });
    select.value = params.value ? params.value : '';
    if (onInitClass && onInitClass != null) {
        if (select.value == "")
            select.classList.add('invalid-cell');
        else
            select.classList.remove('invalid-cell');
    }
    return select;
}

function createInputBox(params, fieldName, onInitClass) {
    var input = document.createElement('input');
    input.type = "text";
    input.setAttribute("class", "form-control");
    input.value = params.value;
    input.addEventListener("change", function (event) {
        if (event) {
            params.node.data[fieldName] = event.target.value;
            params.value = event.target.value;
            if (onInitClass && onInitClass != null) {
                if (params.value == "")
                    input.classList.add('invalid-cell');
                else
                    input.classList.remove('invalid-cell');
            }
            if (isRedraw) {
                callRedraw(params.rowIndex);
            }
        }
    });
    if (onInitClass && onInitClass != null) {
        if (input.value == "")
            input.classList.add('invalid-cell');
        else
            input.classList.remove('invalid-cell');
    }
    return input;
}

function createTextArea(params, fieldName, onInitClass) {
    var textArea = document.createElement("TEXTAREA");
    textArea.rows = 1;
    textArea.cols = 30;
    textArea.maxLength = 100;
    textArea.setAttribute("class", "form-control");
    textArea.addEventListener("change", function (event) {
        if (event) {
            params.node.data[fieldName] = event.target.value;
            params.value = event.target.value;
            if (onInitClass && onInitClass != null) {
                if (params.value == "")
                    textArea.classList.add('invalid-cell');
                else
                    textArea.classList.remove('invalid-cell');
            }

        }
    });
    textArea.textContent = params.value ? params.value : '';
    if (onInitClass && onInitClass != null) {
        if (textArea.textContent == "")
            textArea.classList.add('invalid-cell');
        else
            textArea.classList.remove('invalid-cell');
    }
    return textArea;
}

function callRedraw(index) {
    var row = gridOptions.api.getDisplayedRowAtIndex(index);
    gridOptions.api.redrawRows({ rowNodes: [row] });
}