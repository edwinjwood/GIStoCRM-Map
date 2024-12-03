// Function that takes data in to build rows for bulk upload table.
function buildTable(data, name, npanxxArry, aptarray) {
    var table = $('#tableAddRow');
    table.find("tr:gt(0)").remove();
    var num = 1;
    $.each(data, function (index, value) {
        var newRow = $('<tr id="tr_' + index + '"/>');
        newRow.append('<td id="index_' + index + '">' + index + '</td>');
        newRow.append('<td style="text-align:center"><input type="checkbox" class="checkAll"/></td>');
        if (name[index]) {
            console.log(name[index]);
            if (name[index].length > 38) {
                newRow.append('<td><input type="text" value="Z - ' + num + '"/></td>');
                num++;
            }
            else
                newRow.append('<td><input type="text" value="' + name[index] + '"/></td>');
        } else {
            newRow.append('<td><input type="text" value="Z - ' + num + '"/></td>');
            num++
        }
        newRow.append('<td><input  type="text" value="' + value['address'] + '"/></td>');
        newRow.append('<td><input  type="text" class="apart" value="' + aptarray[index] + '"/></td>');
        newRow.append('<td><input type="text" value="' + value['city'] + '"/></td>');
        newRow.append('<td><input type="text" value="' + value['region'] + '"/></td>');
        newRow.append('<td><input style="width:100px" type="text" value="' + value['postal'] + '"/></td>');
        newRow.append('<td><input style="width:75px" class="numeric" type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="6" value="' + npanxxArry[index] + '"/></td>');
        newRow.append('<td style="text-align:center"><input type="checkbox" class="fiberOnCheckAll" /></td>');
        newRow.append('<td style="text-align:center"><input type="checkbox" class="fiberOffCheckAll"/></td>');
        newRow.append('<td style="text-align:center"><input type="checkbox" class="eocCheckedAll"/></td>');
        newRow.append('<td style="text-align:center"><input type="checkbox" class="diversity" style="display:none" disabled/></td>');
        var diversitytypeSelect = $('<select>').attr('class', 'diversitytype_select').css('display', 'none');
        $.each(diversitytypeArray, function (index, value) {
            var option = $('<option>').attr('value', value).text(value);
            diversitytypeSelect.append(option);
        });
        newRow.append($('<td style="text-align:center">').html(diversitytypeSelect[0]));
        var regionSelect = $('<select>').attr('class', 'region_select').css('display', 'none');
        $.each(regionArray, function (index, value) {
            if (value == 'none') {
                var option = $('<option>');
            } else {
                var option = $('<option>').attr('value', value).text(value);
            }
            regionSelect.append(option);
        });
        var bandwidthSelect = $('<select>').attr('class', 'bandwidth_select');
        $.each(bandwidthArray, function (index, value) {
            var option = $('<option>').attr('value', value).text(index);
            bandwidthSelect.append(option);
        });
        var locationtypeSelect = $('<select>').attr('class', 'locationtype_select');
        $.each(locationtypeArray, function (index, value) {
            var option = $('<option>').attr('value', value).text(value);
            locationtypeSelect.append(option);
        });
        newRow.append($('<td class="region" style="text-align:center; display:none">').html(regionSelect[0]));
        newRow.append($('<td style="text-align:center">').html(bandwidthSelect[0]));
        newRow.append($('<td style="text-align:center">').html(locationtypeSelect[0]));
        newRow.append('<td style=""><input type="text" class="longbulk" value="' + value['longitude'] + '"/></td>');
        newRow.append('<td style=""><input type="text" class="latbulk" value="' + value['latitude'] + '"/></td>');
        var classofservicetypeSelect = $('<select>').attr('class', 'classofservice_select').css('display', 'none');
        $.each(classofservicetypearray, function (index, value) {
            var option = $('<option>').attr('value', value).text(value);
            classofservicetypeSelect.append(option);
        });
        newRow.append($('<td style="text-align:center; ">').html(classofservicetypeSelect[0]));
        var interfacespeedtypeSelect = $('<select>').attr('class', 'interfacespeed_select').css('display', 'none');
        $.each(interfacespeedtypearray, function (index, value) {
            var option = $('<option>').attr('value', value).text(value);
            interfacespeedtypeSelect.append(option);
        });
        newRow.append($('<td style="text-align:center; ">').html(interfacespeedtypeSelect[0]));
        newRow.append('<td style="text-align:center"><textarea class="proposedsolution_bulk" rows="2" cols="30" maxlength="100" style="max-width: 100%; overflow: hidden;" placeholder="type propose solution here..."></textarea></td>');
        table.append(newRow);
    });
    setBulkUploadEvents();
    numericClickEvent();
}