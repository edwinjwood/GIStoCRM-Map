// Function that checks all checkboxes under on-net section 
$('#onnetSelectAll').on('click', function () {
    rowData = getRowData();
    if ($('#onnetSelectAll').prop('checked') == true) {
        $.each(rowData, function (index, value) {
            value[columns['N']] = true;
        });
        gridOptions.api.setRowData(rowData);
    }
    else {
        $.each(rowData, function (index, value) {
            value[columns['N']] = false;
        });
        gridOptions.api.setRowData(rowData);
    }
    console.log(rowData);
});
// Function that checks all checkboxes under off-net section 
$('#offnetSelectAll').on('click', function () {
    rowData = getRowData();
    if ($('#offnetSelectAll').prop('checked') == true) {
        $.each(rowData, function (index, value) {
            value[columns['O']] = true;
        });
        gridOptions.api.setRowData(rowData);
    }
    else {
        $.each(rowData, function (index, value) {
            value[columns['O']] = false;
        });
        gridOptions.api.setRowData(rowData);
    }
});

// Function that checks all checkboxes under EOC section 
//$('#eocSelectAll').on('click', function () {
//    rowData = getRowData();
//    console.log(rowData);
//    if ($('#eocSelectAll').prop('checked') == true) {
//        $.each(rowData, function (index, value) {
//            value[columns['L']] = true;
//        });
//        gridOptions.api.setRowData(rowData);
//    }
//    else {
//        $.each(rowData, function (index, value) {
//            value[columns['L']] = false;
//        });
//        gridOptions.api.setRowData(rowData);
//    }
//    rowData = getRowData();
//    console.log(rowData);
//});

// Function that checks all checkboxes under EOC section 
$('#diversitySelectAll').on('click', function () {
    rowData = getRowData();
    if ($('#diversitySelectAll').prop('checked') == true) {
        $.each(rowData, function (index, value) {
            value[columns['P']] = true;
        });
        gridOptions.api.setRowData(rowData);
    }
    else {
        $.each(rowData, function (index, value) {
            value[columns['P']] = false;
        });
        gridOptions.api.setRowData(rowData);
    }
});

$('#selectAllLocationType').on('change', function () {
    rowData = getRowData();
    var setValue = $('#selectAllLocationType').val();
    console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['S']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllALocationType1').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllALocationType1').val();
    //console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['D']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllLocationSubType').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllLocationSubType').val();
    //console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['E']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllMultiTenant').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllMultiTenant').val();
    //console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['F']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllFloor').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllFloor').val();
    //console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['H']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllSTEAPTRM').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllSTEAPTRM').val();
    //console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['I']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllSTEAPTRM_Num').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllSTEAPTRM_Num').val();
    //console.log("Here == " + setValue);
    $.each(rowData, function (index, value) {
        value[columns['J']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllDiversityType').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllDiversityType').val();
    $.each(rowData, function (index, value) {
        value[columns['Q']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#AllClassOfService').on('change', function () {
    rowData = getRowData();
    var setValue = $('#AllClassOfService').val();
    $.each(rowData, function (index, value) {
        value[columns['T']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#selectAllBandWidth').on('change', function () {
    rowData = getRowData();
    var setValue = $('#selectAllBandWidth').val();
    $.each(rowData, function (index, value) {
        value[columns['R']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#selectAllinterfacespeed').on('change', function () {
    rowData = getRowData();
    var setValue = $('#selectAllinterfacespeed').val();
    $.each(rowData, function (index, value) {
        value[columns['U']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

$('#proposedsolutionbulk').on('change', function () {
    rowData = getRowData();
    var setValue = $('#proposedsolutionbulk').val();
    //var settext = $('#proposedsolutionbulk').text();
    $.each(rowData, function (index, value) {
        value[columns['V']] = setValue;
    });
    gridOptions.api.setRowData(rowData);
});

function getRowData() {
    var rowArray = [];
    gridOptions.api.forEachNode(function (node) {
        rowArray.push(node.data);
    });
    return rowArray;
}