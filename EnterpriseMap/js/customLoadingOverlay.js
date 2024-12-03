function CustomLoadingOverlay() { }

CustomLoadingOverlay.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML =
        '<div class="ag-overlay-loading-center" style="background-color: lightsteelblue;">' +
        '   <span class="glyphicon glyphicon-hourglass gly-spin"></span> ' +
        params.loadingMessage +
        '</div>';
};

CustomLoadingOverlay.prototype.getGui = function () {
    return this.eGui;
};