// Change event for main select bandwidth,
// Changes all values of other bandwidths to its current value
// Disables specific checkboxes based on bandwidth value
$('#selectAllBandWidth').on('change', function () {
    var setValue = $('#selectAllBandWidth').val();
    $("#tableAddRow tr:gt(0)").each(function () {
        var $tds = $(this).find('td').children();
        $tds.eq(14).val(setValue);
        var bandwidth = $tds.eq(14).val();
        var eocDisabledFalseArray = ['2Mb', '3Mb', '5Mb', '6Mb', '10Mb', '20Mb', '30Mb'];
        var checkBandwidth = eocDisabledFalseArray.indexOf(bandwidth);
        if (checkBandwidth > -1) {
            $tds.eq(10).prop('disabled', false);
        } else {
            $tds.eq(10).prop('disabled', true);
            $tds.eq(10).prop('checked', false);
            $tds.eq(11).prop('disabled', true);
            $tds.eq(11).prop('checked', false);
            $tds.eq(12).css('display', 'none');
        }
        if (bandwidth == "3Mb" || bandwidth == "2Mb") {
            $tds.eq(8).prop('disabled', true);
            $tds.eq(11).prop('disabled', true);
            $tds.eq(8).prop('checked', false);
            $tds.eq(11).prop('checked', false);
            $tds.eq(12).css('display', 'none');
            if ($tds.eq(8).prop('checked') == false && $tds.eq(9).prop('checked') == false) {
                //$tds.eq(12).css('display', 'none');
            }
        } else {
            $tds.eq(8).prop('disabled', false);
            $tds.eq(11).prop('disabled', false);
            $tds.eq(11).prop('checked', false);
        }
    });
});

// Function that checks all eoc checkboxes under bulk upload section
$('#selectAllEoc').on('click', function () {
    var disabled = $('.eocCheckedAll').is(':disabled');
    if (!disabled) {
        if ($('#selectAllEoc').prop('checked') == true)
            $('.eocCheckedAll').prop('checked', true);
        else
            $('.eocCheckedAll').prop('checked', false);
    }
});

// Function that checks all offnet checkboxes under bulk upload section 
$('#selectAllOffNet').on('click', function () {
    var disabled = $('.fiberOffCheckAll').is(':disabled');
    var tableLength = $('#tableAddRow > tbody > tr').length;
    if (!disabled && tableLength > 0) {
        if ($('#selectAllOffNet').prop('checked') == true) {
            $('.fiberOffCheckAll').prop('checked', true);
            document.getElementById("selectcos").style.display = 'block';
            $("#tableAddRow tr:gt(0)").each(function () {
                var $tds = $(this).find('td').children();
                $tds.eq(18).show();
                $tds.eq(20).show();
                if (($('#selectAllOffNet').prop('checked') == true) && (document.getElementById('selectcos').value == "Ethernet")) {
                    document.getElementById('selectinterfacespeed').style.display = 'block';
                    $tds.eq(19).show();
                }
                else {
                    document.getElementById('selectinterfacespeed').style.display = 'none';
                    document.getElementById('selectinterfacespeed').value = '';
                    $tds.eq(19).hide();
                    $tds.eq(20).val('');
                }
            });
        } else {
            $('.fiberOffCheckAll').prop('checked', false);
            if ($('#selectAllOnNet').prop('checked') == false) {
                document.getElementById("selectcos").style.display = 'none';
                document.getElementById("selectcos").value = '';
                $("#tableAddRow tr:gt(0)").each(function () {
                    var $tds = $(this).find('td').children();
                    $tds.eq(18).hide();
                    $tds.eq(20).hide();
                    $tds.eq(18).val("");
                    $tds.eq(19).val("");
                    $tds.eq(20).val("");
                });
            }
        }
    }
});

// Function that checks all checkboxes under bulk upload section 
$('#selectAll').on('click', function () {
    if ($('#selectAll').prop('checked') == true)
        $('.checkAll').prop('checked', true);
    else
        $('.checkAll').prop('checked', false);
});

// Function that checks all fiber checkboxes under bulk upload section 
$('#selectAllOnNet').on('click', function () {
    var disabled = $('.fiberOnCheckAll').is(':disabled');
    var tableLength = $('#tableAddRow > tbody > tr').length;
    if ($('#selectAllOnNet').prop('checked') == true) {
        //document.getElementById("diverseAll").style.display = 'block';
        document.getElementById("selectcos").style.display = 'block';
        $("#tableAddRow tr:gt(0)").each(function () {
            var $tds = $(this).find('td').children();
            $tds.eq(11).show();
            $tds.eq(18).show();
            $tds.eq(20).show();
        });
    }
    else {
        document.getElementById("AllDiversityType").style.display = 'none';
        document.getElementById("diverseAll").checked = false;
        $("#tableAddRow tr:gt(0)").each(function () {
            var $tds = $(this).find('td').children();
            $tds.eq(12).hide();
            $tds.eq(11).hide();
            $tds.eq(11).prop('checked', false);
            if ($('#selectAllOffNet').prop('checked') == false) {
                document.getElementById("selectcos").style.display = 'none';
                document.getElementById("selectcos").value = '';
                $tds.eq(18).hide();
                $tds.eq(20).hide();
                $tds.eq(18).val("");
                $tds.eq(20).val("");
            }
        });
    }
    if (!disabled && tableLength > 0) {
        if ($('#selectAllOnNet').prop('checked') == true) {
            $('.fiberOnCheckAll').prop('checked', true);
            $("#tableAddRow tr:gt(0)").each(function () {
                var $tds = $(this).find('td').children();
                $tds.eq(11).show();
                $tds.eq(18).show();
                $tds.eq(20).show();
            });
        } else {
            $('.fiberOnCheckAll').prop('checked', false);
            if ($('#selectAllOffNet').prop('checked') == false) {
                $("#tableAddRow tr:gt(0)").each(function () {
                    var $tds = $(this).find('td').children();
                    $tds.eq(12).hide();
                    $tds.eq(11).hide();
                    $tds.eq(11).prop('checked', false);
                    $tds.eq(18).hide();
                    $tds.eq(20).hide();
                    $tds.eq(18).val("");
                    $tds.eq(20).val("");
                });
            }
        }
    }
});

// Function that checks all diversity checkboxes under bulk upload section
$('#diverseAll').on('click', function () {
    var bandwidth = $('#selectAllBandWidth').val();
    if ($('#diverseAll').prop('checked') == true) {
        if ($('#selectAllOnNet').prop('checked') == true) {
            if (bandwidth == "2Mb" || bandwidth == "3Mb") {
                document.getElementById("AllDiversityType").style.display = "none";
                $('.diversity').prop('checked', false);
                $("#tableAddRow tr:gt(0)").each(function () {
                    var $tds = $(this).find('td').children();
                    $tds.eq(12).hide();
                });
            }
            else {
                document.getElementById("AllDiversityType").style.display = "block";
                $('.diversity').prop('checked', true);
                $("#tableAddRow tr:gt(0)").each(function () {
                    var $tds = $(this).find('td').children();
                    $tds.eq(12).show();
                });
            }
        }
        else {
            document.getElementById("AllDiversityType").style.display = "none";
            $('.diversity').prop('checked', false);
            $("#tableAddRow tr:gt(0)").each(function () {
                var $tds = $(this).find('td').children();
                $tds.eq(12).hide();
            });
        }
    } else {
        document.getElementById("AllDiversityType").style.display = "none";
        $('.diversity').prop('checked', false);
        $("#tableAddRow tr:gt(0)").each(function () {
            var $tds = $(this).find('td').children();
            $tds.eq(12).hide();
        });
    }
});

$('#selectLocationType').on('change', function () {
    var setValue = $('#selectLocationType').val();
    $("#tableAddRow tr:gt(0)").each(function () {
        var $tds = $(this).find('td').children();
        $tds.eq(15).val(setValue);
    });
});

$('#selectcos').on('change', function () {
    var setValue = $('#selectcos').val();
    $("#tableAddRow tr:gt(0)").each(function () {
        var $tds = $(this).find('td').children();
        $tds.eq(18).val(setValue);
    });
    if (($('#selectAllOffNet').prop('checked') == true) && (document.getElementById('selectcos').value == "Ethernet")) {
        document.getElementById('selectinterfacespeed').style.display = 'block';
        $("#tableAddRow tr:gt(0)").each(function () {
            var $tds = $(this).find('td').children();
            $tds.eq(19).show();
        });
    }
    else {
        document.getElementById('selectinterfacespeed').style.display = 'none';
        document.getElementById('selectinterfacespeed').value = '';
        $("#tableAddRow tr:gt(0)").each(function () {
            var $tds = $(this).find('td').children();
            $tds.eq(19).hide();
            $tds.eq(19).val('');
        });
    }
});

$('#selectinterfacespeed').on('change', function () {
    var setValue = $('#selectinterfacespeed').val();
    $("#tableAddRow tr:gt(0)").each(function () {
        var $tds = $(this).find('td').children();
        $tds.eq(19).val(setValue);
    });
});

$('#AllDiversityType').on('change', function () {
    var setValue = $('#AllDiversityType').val();
    $("#tableAddRow tr:gt(0)").each(function () {
        var $tds = $(this).find('td').children();
        $tds.eq(12).val(setValue);
    });
});
$('#proposedsolutionbulk').on('change', function () {
    var setValue = $('#proposedsolutionbulk').val();
    var settext = $('#proposedsolutionbulk').text();
    $('.proposedsolution_bulk').val(setValue);
});

