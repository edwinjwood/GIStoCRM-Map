var bandwidthArray = { '5Mb': '5Mb', '2Mb': '2Mb', '3Mb': '3Mb', '6Mb': '6Mb', '10Mb': '10Mb', '20Mb': '20Mb', '30Mb': '30Mb', '40Mb': '40Mb', '50Mb': '50Mb', '60Mb': '60Mb', '70Mb': '70Mb', '80Mb': '80Mb', '90Mb': '90Mb', '100Mb': '100Mb', '150Mb': '150Mb', '200Mb': '200Mb', '250Mb': '250Mb', '300Mb': '300Mb', '350Mb': '350Mb', '400Mb': '400Mb', '450Mb': '450Mb', '500Mb': '500Mb', '550Mb': '550Mb', '600Mb': '600Mb', '650Mb': '650Mb', '700Mb': '700Mb', '750Mb': '750Mb', '800Mb': '800Mb', '850Mb': '850Mb', '900Mb': '900Mb', '950Mb': '950Mb', '1Gb': '1000Mb', '2Gb': '2000Mb', '3Gb': '3000Mb', '4Gb': '4000Mb', '5Gb': '5000Mb', '6Gb': '6000Mb', '7Gb': '7000Mb', '8Gb': '8000Mb', '9Gb': '9000Mb', '10Gb': '10000Mb', '100Gb': '100000Mb', };
var bandwidthArray2 = ['20Mb', '50Mb', '100Mb', '200Mb', '500Mb', '1000Mb', '2000Mb', '5000Mb', '10000Mb', '100000Mb',];
var regionArray = ['none', 'Coastal TC', 'Midlands TC', 'Upstate TC', 'North Carolina TC', 'Wilmington TC'];
var locationtypeArray = ['', 'New', 'Existing', 'OnNet'];
var diversitytypeArray = ["Dedicated Physical Ring", "Dedicated Virtual Ring", "Dual Entrance Facility", "Non Collapsed Last Mile Lateral",
    "Non Collapsed Lateral & Dual Entrance", "POP Diversity with Router Diversity", "Redundant CPE Router/Switch 10G Port", "Redundant CPE Router/Switch 1G Port",
    "Single Pop with Router Diversity"];
var classofservicetypearray = ['', 'Cross Connect', 'DS0', 'DS1', 'DS3', 'DS3 (MUX)', 'Ethernet', 'OC12/622Mb', 'OC195/10Gb', 'OC3/10Mb', 'OC48/2.5Mb', 'Wavelength Service', 'Other'];
var interfacespeedtypearray = ['', '100Mb', '1Gb', '10Gb'];

var locationType1Array = ["", "Building", "Campus Building", "Tower", "Small Cell", "Splice Point", "Carrier Building/Data Center"];

var locationSubTypeAray = ["", "Hospitality", "Hospital", "Education", "Commercial Office", "Industrial", "Warehouse", "Retail - Single Tenant Building", "Retail - Multitenant Facility", "Military Facility", "Mixed Use", "Other", "Carrier Hut", "H-Frame", "Commercial Computing Data Center", "Carrier Hotel - Multitenant", "Wireless Carrier MSC", "Single Carrier CO/POP"];

var multiTenantArray = ["Yes", "No"];

var floorArray = ["", "LL3", "LL2", "LL1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "90", "100"];

var ste_aptArray = ["", "APT", "STE", "RM", "DEPT", "BLDG", "UNIT"];

var salesRepUnderManager = [];
var salesUserBiiliongPointDict = {};

var primaryContactAddress = "";
var headQuartersAddress = "";

var customerDataField = [
    {
        fieldName: "customer_id",
        label: "Customer Id"
    },
    {
        fieldName: "billing_account_id",
        label: "Billing Account Id"
    },
    {
        fieldName: "billing_account_name",
        label: "Billing Account Name"
    },
    {
        fieldName: "master_account_name",
        label: "Master Account Name"
    },
    {
        fieldName: "parent_company_name",
        label: "Parent Company Name"
    },
    {
        fieldName: "address_co",
        label: "Address Co"
    },
    {
        fieldName: "lat",
        label: "Latitude"
    },
    {
        fieldName: "long",
        label: "Longitude"
    },
    {
        fieldName: "account_owner_sales_rep",
        label: "Account Owner Sales Rep"
    },
    {
        fieldName: "invoice_month_name",
        label: "Invoice Month Name"
    },
    {
        fieldName: "address_co",
        label: "Address Co"
    },
    {
        fieldName: "contract_startdate",
        label: "Contract Startdate"
    },
    {
        fieldName: "contract_startdate",
        label: "Contract Startdate"
    },
    {
        fieldName: "contract_enddate",
        label: "Contract Enddate"
    },
    {
        fieldName: "contract_type",
        label: "Contract Type"
    },
    {
        fieldName: "current_status",
        label: "Current Status"
    },
    {
        fieldName: "onoffnet",
        label: "Onoffnet"
    },
    {
        fieldName: "business_class",
        label: "Business Class"
    },
    {
        fieldName: "charge_id",
        label: "Charge Id"
    },
    {
        fieldName: "charge_description",
        label: "Charge Description"
    },
    {
        fieldName: "billing_system_service_tracking",
        label: "Billing System Service Tracking"
    },
    {
        fieldName: "service_id",
        label: "Service Id"
    },
    {
        fieldName: "product_level_1",
        label: "Product Level 1"
    },
    {
        fieldName: "product_level_2",
        label: "Product Level 2"
    },
    {
        fieldName: "product_level_3",
        label: "Product Level 3"
    },
    {
        fieldName: "product_level_4",
        label: "Product Level 4"
    },
    {
        fieldName: "mrc___total",
        label: "MRC Total"
    },
    {
        fieldName: "mrc___core_connectivity",
        label: "MRC Core Connectivity"
    },
    {
        fieldName: "mrc___networking_and_extended_c",
        label: "MRC Networking And Extended C"
    },
    {
        fieldName: "mrc___communication___collabora",
        label: "MRC Communication Collabora"
    },
    {
        fieldName: "mrc___storage_and_computing",
        label: "MRC Storage and Computing"
    },
    {
        fieldName: "mrc___security",
        label: "MRC Security"
    },
    {
        fieldName: "mrc___other",
        label: "MRC Other"
    },
    {
        fieldName: "ACCOUNT_OWNER_USERNAME",
        label: "ACCOUNT OWNER USERNAME"
    },
    {
        fieldName: "Sales_Person_Names_for_ESRI",
        label: "Sales Person Names for ESRI"
    },
    {
        fieldName: "FULL_NAME_1",
        label: "Full Name"
    },
    {
        fieldName: "OBJECTID",
        label: "OBJECTID"
    }

];

var segraLeadsField = [
    {
        fieldName: "loc_name",
        label: "Loc Name"
    },
    {
        fieldName: "status",
        label: "Status"
    },
    {
        fieldName: "score",
        label: "Score"
    },
    {
        fieldName: "match_type",
        label: "Match Type"
    },
    {
        fieldName: "match_addr",
        label: "Match Address"
    },
    {
        fieldName: "longlabel",
        label: "Longlabel"
    },
    {
        fieldName: "shortlabel",
        label: "Shortlabel"
    },
    {
        fieldName: "addr_type",
        label: "Addr Type"
    },
    {
        fieldName: "type",
        label: "Type"
    },
    {
        fieldName: "placename",
        label: "Placename"
    },
    {
        fieldName: "place_addr",
        label: "Place Addr"
    },
    {
        fieldName: "phone",
        label: "Phone"
    },
    {
        fieldName: "url",
        label: "Url"
    },
    {
        fieldName: "rank",
        label: "Rank"
    },
    {
        fieldName: "addbldg",
        label: "Addbldg"
    },
    {
        fieldName: "addnum",
        label: "Addnum"
    },
    {
        fieldName: "addnumfrom",
        label: "Addnumfrom"
    },
    {
        fieldName: "addnumto",
        label: "Addnumto"
    },
    {
        fieldName: "addrange",
        label: "Add Range"
    },
    {
        fieldName: "side",
        label: "Side"
    },
    {
        fieldName: "stpredir",
        label: "Stpredir"
    },
    {
        fieldName: "stpretype",
        label: "Stpretype"
    },
    {
        fieldName: "stname",
        label: "Stname"
    },
    {
        fieldName: "sttype",
        label: "Sttype"
    },
    {
        fieldName: "stdir",
        label: "stdir"
    },
    {
        fieldName: "bldgtype",
        label: "Bldgtype"
    },
    {
        fieldName: "bldgname",
        label: "Bldgname"
    },
    {
        fieldName: "leveltype",
        label: "Level Type"
    },
    {
        fieldName: "levelname",
        label: "Level Name"
    },
    {
        fieldName: "unittype",
        label: "Unit Type"
    },
    {
        fieldName: "unitname",
        label: "Unit Name"
    },
    {
        fieldName: "subaddr",
        label: "Sub Addr"
    },
    {
        fieldName: "staddr",
        label: "St Addr"
    },
    {
        fieldName: "block",
        label: "Block"
    },
    {
        fieldName: "sector",
        label: "Sector"
    },
    {
        fieldName: "nbrhd",
        label: "nbrhd"
    },
    {
        fieldName: "district",
        label: "District"
    },
    {
        fieldName: "city",
        label: "City"
    },
    {
        fieldName: "metroarea",
        label: "Metroarea"
    },
    {
        fieldName: "subregion",
        label: "Sub Region"
    },
    {
        fieldName: "region",
        label: "Region"
    },
    {
        fieldName: "regionabbr",
        label: "Regionabbr"
    },
    {
        fieldName: "territory",
        label: "Territory"
    },
    {
        fieldName: "zone",
        label: "Zone"
    },
    {
        fieldName: "postal",
        label: "Postal"
    },
    {
        fieldName: "postalext",
        label: "Postalext"
    },
    {
        fieldName: "country",
        label: "Country"
    },
    {
        fieldName: "langcode",
        label: "Langcode"
    },
    {
        fieldName: "distance",
        label: "Distance"
    },
    {
        fieldName: "x",
        label: "X"
    },
    {
        fieldName: "y",
        label: "Y"
    },
    {
        fieldName: "displayx",
        label: "Displayx"
    },
    {
        fieldName: "displayy",
        label: "Displayy"
    },
    {
        fieldName: "xmin_",
        label: "xmin_"
    },
    {
        fieldName: "xmax_",
        label: "xmax_"
    },
    {
        fieldName: "ymin",
        label: "ymin"
    },
    {
        fieldName: "ymax",
        label: "ymax"
    },
    {
        fieldName: "exinfo",
        label: "exinfo"
    },
    {
        fieldName: "arc_addres",
        label: "arc_addres"
    },
    {
        fieldName: "arc_addr_1",
        label: "arc_addr_1"
    },
    {
        fieldName: "arc_addr_2",
        label: "arc_addr_2"
    },
    {
        fieldName: "arc_neighb",
        label: "arc_neighb"
    },
    {
        fieldName: "arc_city",
        label: "arc_city"
    },
    {
        fieldName: "arc_subreg",
        label: "arc_subreg"
    },
    {
        fieldName: "arc_region",
        label: "arc_region"
    },
    {
        fieldName: "arc_postal",
        label: "arc_postal"
    },
    {
        fieldName: "arc_post_1",
        label: "arc_post_1"
    },
    {
        fieldName: "arc_countr",
        label: "arc_countr"
    },
    {
        fieldName: "name",
        label: "name"
    },
    {
        fieldName: "middle_nam",
        label: "middle_nam"
    },
    {
        fieldName: "first_name",
        label: "first_name"
    },
    {
        fieldName: "last_name",
        label: "last_name"
    },
    {
        fieldName: "topic",
        label: "topic"
    },
    {
        fieldName: "owner",
        label: "owner"
    },
    {
        fieldName: "manager__o",
        label: "manager__o"
    },
    {
        fieldName: "company_na",
        label: "company_na"
    },
    {
        fieldName: "status_rea",
        label: "status_rea"
    },
    {
        fieldName: "source_cam",
        label: "source_cam"
    },
    {
        fieldName: "segra_terr",
        label: "segra_terr"
    },
    {
        fieldName: "created_on",
        label: "created_on"
    },
    {
        fieldName: "parent_acc",
        label: "parent_acc"
    },
    {
        fieldName: "parent_con",
        label: "parent_con"
    },
    {
        fieldName: "parent_com",
        label: "parent_com"
    },
    {
        fieldName: "parent_c_1",
        label: "parent_c_1"
    },
    {
        fieldName: "hq_in_segr",
        label: "hq_in_segr"
    },
    {
        fieldName: "full_poten",
        label: "full_poten"
    },
    {
        fieldName: "total_dome",
        label: "total_dome"
    },
    {
        fieldName: "total_us_l",
        label: "total_us_l"
    },
    {
        fieldName: "percent_of",
        label: "percent_of"
    },
    {
        fieldName: "onnet___of",
        label: "onnet___of"
    },
    {
        fieldName: "nearnet___",
        label: "nearnet___"
    },
    {
        fieldName: "nearnet__1",
        label: "nearnet__1"
    },
    {
        fieldName: "street_1",
        label: "street_1"
    },
    {
        fieldName: "city_1",
        label: "city_1"
    },
    {
        fieldName: "state_prov",
        label: "state_prov"
    },
    {
        fieldName: "ID",
        label: "ID"
    },
    {
        fieldName: "CanonicalName",
        label: "CanonicalName"
    },
    {
        fieldName: "DomainName",
        label: "DomainName"
    },
    {
        fieldName: "sAMAccountName",
        label: "sAMAccountName"
    },
    {
        fieldName: "USERNAME",
        label: "USERNAME"
    },
    {
        fieldName: "fme_rejection_code",
        label: "fme_rejection_code"
    },

];