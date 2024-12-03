// Funciton that takes the data from the CSV files and build objects to grab missing information 
function buildLocationObj(rows) {
    var errorMessage = "";
    var completeObj = [];
    var records = [];
    var locationName = [];
    var fullLocationData0 = [];
    $.each(rows, function (index, row) {
        var cellData = rows[index].split(",");

        if (cellData.length > 1) {

            var fullObj = {};
            locationName.push(cellData[1]);
            fullObj['index'] = index;
            fullObj['address'] = cellData[2];
            fullObj['city'] = cellData[3];
            fullObj['region'] = cellData[4];
            fullObj['postal'] = cellData[5];
            fullObj['longitude'] = cellData[7];
            fullObj['latitude'] = cellData[6];

            if (cellData[2] && cellData[3] && cellData[4] && cellData[5] && cellData[6] && cellData[7]) {
                fullObj['index'] = index;
                fullObj['address'] = cellData[2];
                fullObj['city'] = cellData[3];
                fullObj['region'] = cellData[4];
                fullObj['postal'] = cellData[5];
                fullObj['longitude'] = cellData[7];
                fullObj['latitude'] = cellData[6];
                fullLocationData0.push(fullObj);
            }
            else if (cellData[2] && cellData[4] && cellData[5] && cellData[3]) {
                fullObj['index'] = index;
                fullObj['address'] = cellData[2];
                fullObj['city'] = cellData[3];
                fullObj['region'] = cellData[4];
                fullObj['postal'] = cellData[5];
                fullObj['longitude'] = "";
                fullObj['latitude'] = "";
                //****************************get lat and long and update row
                var esriLatLong = {};
                esriLatLong = getLatLong(fullObj);
                    if (esriLatLong)//data returned from esri
                    {
                        //if (esriLatLong[0].address) { fullObj.address = esriLatLong[0].address; }
                        //if (esriLatLong[0].city) { fullObj.city = esriLatLong[0].city; }
                        //if (esriLatLong[0].region) { fullObj.region = esriLatLong[0].region; }
                        //if (esriLatLong[0].postal) { fullObj.postal = esriLatLong[0].postal; }
                        if (esriLatLong[0].longitude) { fullObj.longitude = esriLatLong[0].longitude; }
                        if (esriLatLong[0].latitude) { fullObj.latitude = esriLatLong[0].latitude; }

                    }

            }
            else if (cellData[7] && cellData[6]) {
                var esriAdrress = {};
                esriAdrress = getAddress(cellData[7] + ',' + cellData[6]);
                if (esriAdrress)//data returned from esri
                {
                    if (esriAdrress[0].address) { fullObj.address = esriAdrress[0].address; }
                    if (esriAdrress[0].city) { fullObj.city = esriAdrress[0].city; }
                    if (esriAdrress[0].region) { fullObj.region = esriAdrress[0].region; }
                    if (esriAdrress[0].postal) { fullObj.postal = esriAdrress[0].postal; }
                }
            }
            completeObj.push(fullObj);

        }
    });
    buildTableForGrid(completeObj, locationName /*npanxxArry, aptarray*/);
}