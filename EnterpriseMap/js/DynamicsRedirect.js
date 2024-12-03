function redirectDynamcics() {
    //1402 cloud configuration
    //for Dynamics 365 Cloud  - transition from on prim to Dynamics 365 cloud
    //dynurl env variable


    async function getConfigAndSetSrc() {
        try {
            const dynurl = await fetchConfigValue('dynurl');
            const src = dynurl + 'etn=opportunity&pagetype=entityrecord&id=' + oppId;
            window.open(src, '_blank');
            $('#SuccessModal').modal('hide');
            // Now you can use src here
            console.log(src);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    getConfigAndSetSrc();
    //var dynurl = fetchConfigValue('dynurl');
    //var src = dynurl+'?etn=opportunity&pagetype=entityrecord&id=' + oppId;
    //var src = ConfigurationManager.AppSettings["redirectSrc"] + '?etn=opportunity&pagetype=entityrecord&id=' + oppId;
    fetchConfigValue('dynurl')
        .then(dynurl => {
            const src = dynurl + 'etn=opportunity&pagetype=entityrecord&id=' + oppId;
            // Now you can use src here
            console.log(src);
        })
        .catch(error => {
            console.error('Error:', error);
        });


}