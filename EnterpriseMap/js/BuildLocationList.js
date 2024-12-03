// Function that builds the form data into a list to be displayed
function buildList(data) {
    var src = "img/imp1.png";
    var classlocbutton = 'ExistingLocButton';
    var flagExisitngLOC = false;
    var listData = {};
    var listItem;
    $.each(data, function (i, field) {
        if (field && field.name == 'sla')
            listData[field.name] = field.value;
        if (field && field.name == 'address')
            listData[field.name] = field.value;
        if (field && field.name == 'bandwidth' && field.value !== typeof 'undefined')
            listData[field.name] = field.value;

        if (field && field.name == 'apartment' && (field.value !== typeof 'undefined' || field.value !== typeof ''))
            listData[field.name] = field.value;
        if (field && field.name == 'locationAlreadyExist' && field.value == 'YES')
            flagExisitngLOC = true
    });
    if (flagExisitngLOC == true) {
        existing_location_counter++;
        var src = "img/Existing.png";
        var classlocbutton = 'ExistingLocButton';
    }
    else {
        src = "img/remove.png"
        classlocbutton = 'removeLocButton';
        new_location_counter++;
    }
    hiddenListData.push(data);
    var listLength = $('#list div').length;
    var add = listData.address;
    var split_address = add.split(', ');
    if (listData.apartment == undefined)
        listData.apartment = '';
    let split_street = '';
    let split_city = '';
    let split_state = '';
    let split_zip = '';
    if (split_address.length > 4) {
        split_street = split_address[0];
        split_city = split_address[4];
        split_state = split_address[5];
        // split_zip = split_address[6];
    }
    else if (split_address.length === 4) {
        split_street = split_address[0];
        split_city = split_address[1];
        split_state = split_address[2];
        split_zip = split_address[3];
    }
    else {
        split_street = split_address[0];
        split_city = split_address[1];
        split_state = split_address[2];/*+ ", " + split_address[3];*/
        //split_zip = split_address[3];
    }
    if (split_zip !== "" && split_zip !== undefined) {
        listItem = '<div class="cardDiv"><img class=' + classlocbutton + ' name="' + listData.sla + '" onclick="removeLocation(event)" src=' + src + ' /> ' + listData.sla + '<p style="font-size:11px; padding-left:30px;">' + split_street + ', ' + listData.apartment + '<br>' + split_city + ', ' + split_state + ', ' + split_zip + '</p>' + ' </div>';

    }
    else {
        listItem = '<div class="cardDiv"><img class=' + classlocbutton + ' name="' + listData.sla + '" onclick="removeLocation(event)" src=' + src + ' /> ' + listData.sla + '<p style="font-size:11px; padding-left:30px;">' + split_street + ', ' + listData.apartment + '<br>' + split_city + ', ' + split_state + '</p>' + ' </div>';

    }
    $('#list').append(listItem);
    $('#LocInfo').modal('hide');
    $('#cardDisplay').show();
}