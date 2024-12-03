using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Services;
using Microsoft.Xrm.Sdk;
using Spirit.Esrimap.Business;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace EnterpriseMap
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class WebService1 : System.Web.Services.WebService
    {
        [System.Web.Services.WebMethod]
        public string createAllLocations(ListLocation LocObj)
        {
            try
            {
                Guid LocationID = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
                List<String> Locterm = LocObj.term;
                String OppId = LocObj.OppID;
                Guid OppGuid = Guid.Parse(OppId);
                String LocData = LocObj.LocationData;
                List<FSRDetails> fsrclass = new List<FSRDetails>();
                JavaScriptSerializer js = new JavaScriptSerializer();
                LocationDetail[] Details = js.Deserialize<LocationDetail[]>(LocData);
                IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
                int hle_to_create_counter = 0;
                JArray target_hle = new JArray();
                for (int i = 0; i < Details.Count(); i++)
                {
                    String[] AddressSplit = Details[i].LocationAddress.Split(',');
                    String StreetAddress = AddressSplit[0].Trim();
                    String City = AddressSplit[1].Trim();
                    String stateShortRepresentation = AddressSplit[2].Trim().Length == 2 ? AddressSplit[2].Trim() : StatesOfUSA.GetStateByName(AddressSplit[2].Trim());
                    String Zipcode = AddressSplit[3].Trim();
                    String[] LatLongSplit = Details[i].LocationLatLong.Split(',');
                    String LongitudeLocation = LatLongSplit[0].Trim();
                    String LatitudeLocation = LatLongSplit[1].Trim();
                    User user = new EnterpriseMap.User();
                    Guid owner_ID = user.getSystemUserId("LUMOSNET\\" + LocObj.username);
                    LocationID = createLocation(Details[i].LocationName, owner_ID, Details[i].LocationNearNetOnNetLocationID, StreetAddress, Details[i].LocationApartment, Details[i].LocationType, City, OppGuid, stateShortRepresentation, Zipcode, Details[i].LocationNpanxx, LatitudeLocation, LongitudeLocation, Details[i].LocationsalesChannelForLocation, Details[i].LocationDiversity, service);
                    if (Details[i].LocationFiber == "true")
                    {
                        hle_to_create_counter += 1;
                        FSRDetails fsrd = new FSRDetails();
                        fsrd.rfpid = LocationID.ToString();
                        fsrd.longitude = LongitudeLocation;
                        fsrd.latitude = LatitudeLocation;
                        fsrd.classOfService = Details[i].LocationCos;
                        fsrd.LocationType = Details[i].LocationType;
                        fsrd.LocationID = LocationID;
                        fsrd.OpportunityId = OppGuid;
                        fsrd.OwnerID = owner_ID;
                        fsrd.ProposedSolution = Details[i].LocationProposedSol;
                        fsrd.Diversity = Details[i].LocationDiversity;
                        fsrd.DiversityType = Details[i].LocationDiversitytype;
                        fsrd.Bandwidth = Details[i].LocationBandwidth;
                        fsrd.Term = Locterm.First();
                        fsrclass.Add(fsrd);
                        target_hle.Add(new JObject() {
                        new JProperty("id",LocationID.ToString()),
                        new JProperty("longitude",LongitudeLocation),
                        new JProperty("latitude",LatitudeLocation),
                         });
                    }
                    if (Details[i].LocationOffnet == "true")
                    {
                        for (int j = 0; j < Locterm.Count; j++)
                        {
                            createOffNetRequest(Details[i].LocationBandwidth, owner_ID, Locterm[j], OppGuid, LocationID, Details[i].LocationCos, Details[i].LocationProposedSol, service, Details[i].LocationInterfaceSpeed);
                        }
                    }
                    if (Details[i].LocationEoc == "true")
                        createEocRequest(OppGuid, owner_ID, LocationID, service);
                }
                if (hle_to_create_counter == 0)
                    return "Success";
                else
                {
                    string ARO_token = AROConnection.getAROToken();
                    string Report_string = AROConnection.getAvailableReports(ARO_token);
                    JArray values = JArray.Parse(Report_string);
                    JObject first_element = (JObject)values[0];
                    JObject first_report = (JObject)first_element.GetValue("reportData");
                    string Report_id = (string)first_report.SelectToken("id");
                    JObject postData = new JObject();
                    postData.Add(new JProperty("rfpId", OppGuid.ToString()));
                    postData.Add(new JProperty("fiberRoutingMode", "ROUTE_FROM_FIBER"));
                    postData.Add(new JProperty("targets", target_hle));
                    string PlanId = AROConnection.getPlainId(ARO_token, postData.ToString());
                    string AllReports = AROConnection.getIndividualReport(PlanId, Report_id, ARO_token);
                    JArray ARO_values = JArray.Parse(AllReports);
                    for (int j = 0; j < hle_to_create_counter; j++)
                    {
                        for (int k = 0; k < hle_to_create_counter; k++)
                        {
                            JObject AROINFO = (JObject)ARO_values[k];
                            string location_id = (string)AROINFO.SelectToken("location_id");
                            if (location_id == fsrclass[j].LocationID.ToString())
                            {
                                createFiberServiceAbilityRequest((JObject)ARO_values[k], fsrclass[j]);
                                break;
                            }
                        }
                    }
                    return "Success";
                }
            }
            catch (Exception e)
            {
                return ("!!Exception!! = " + e.Message + ", Source = " + e.Source).ToString();
            }
        }

        private Guid createLocation(string LocationName, Guid owner_ID, string LocationNearNetOnNetLocationID_str, string StreetAddress, string LocationApartment, string LocationType, string City, Guid OppGuid, string stateShortRepresentation, string Zipcode, string LocationNpanxx, string LatitudeLocation, string LongitudeLocation, string LocationsalesChannelForLocation, string LocationDiversity, IOrganizationService service) {
            var request_sla = new Entity("spirit_servicelocation");
            request_sla["spirit_businessname"] = LocationName;
            request_sla["ownerid"] = new EntityReference("systemuser", owner_ID);
            if (LocationNearNetOnNetLocationID_str != "" || !(string.IsNullOrEmpty(LocationNearNetOnNetLocationID_str)))
            {
                Guid NearNetOnNetLocationID = new Guid(LocationNearNetOnNetLocationID_str);
                request_sla["sgr_nearnetid"] = new EntityReference("spirit_nearnetlocation", NearNetOnNetLocationID);
            }
            request_sla["spirit_street1"] = StreetAddress;
            request_sla["spirit_street2"] = LocationApartment;
            int Lvalue = getLocationType(LocationType);            
            request_sla["spirit_locationtype"] = new OptionSetValue((int)Lvalue);
            request_sla["spirit_city"] = City;
            request_sla["spirit_servicelocationforopportunityid"] = new EntityReference("opportunity", OppGuid);
            request_sla["spirit_state"] = stateShortRepresentation;
            request_sla["spirit_postalcode"] = Zipcode;
            request_sla["spirit_npanxx"] = LocationNpanxx;
            request_sla["spirit_esrilatitude"] = LatitudeLocation;
            request_sla["spirit_esrilongitude"] = LongitudeLocation;
            var location_link = "https://segramaps.lumosnet.com/portal/home/webmap/viewer.html?webmap=2bfe53deb7d4427b9659594c04e8c54d&marker=" + LongitudeLocation + ";" + LatitudeLocation + ";&level=18";
            request_sla["spirit_locationlink"] = location_link;
            int salesChannelForLocation = 24187000;
            if (LocationsalesChannelForLocation == "enterprise")
                salesChannelForLocation = 241870000;
            else if (LocationsalesChannelForLocation == "government")
                salesChannelForLocation = 241870002;
            request_sla["spirit_saleschannelglobal"] = new OptionSetValue((int)salesChannelForLocation);
            request_sla["spirit_diverse"] = LocationDiversity == "true" ? true : false;
            request_sla["spirit_sourcelocation"] = false;
            return service.Create(request_sla);
        }

        private void createOffNetRequest(string bandwidth, Guid owner_ID, string term, Guid OppGuid, Guid LocationID, string LocationCos, string LocationProposedSol, IOrganizationService service, string LocationInterfaceSpeed)
        {
            var request_offnet = new Entity("spirit_offnetserviceabilityrequest");
            request_offnet["spirit_bandwidthrequested"] = BandwidthOptionSetFactory.Instanse.GetOptionSet(bandwidth);
            request_offnet["ownerid"] = new EntityReference("systemuser", owner_ID);
            request_offnet["spirit_termglobal"] = TermOptionSetFactory.Instanse.GetOptionSet(term);
            request_offnet["spirit_opportunity"] = new EntityReference("opportunity", OppGuid);
            request_offnet["spirit_offnetrequestid"] = new EntityReference("spirit_servicelocation", LocationID);
            request_offnet["spirit_circuittype"] = string.IsNullOrEmpty(LocationCos) == true ? ClassOfServiceOptionSetFactory.Instanse.GetOptionSet("Ethernet") : ClassOfServiceOptionSetFactory.Instanse.GetOptionSet(LocationCos);
            request_offnet["spirit_notes"] = string.IsNullOrEmpty(LocationProposedSol) == true ? "Note" : LocationProposedSol;
            Debug.WriteLine("Here2 = " + LocationInterfaceSpeed);
            int interfacespd = string.IsNullOrEmpty(LocationInterfaceSpeed) ? 241870000 : getInterfaceSpeed(LocationInterfaceSpeed);
            Debug.WriteLine(LocationInterfaceSpeed);
            request_offnet["spirit_interfacespeed"] = new OptionSetValue((int)interfacespd);
            service.Create(request_offnet);
        }

        private void createEocRequest(Guid OppGuid, Guid owner_ID, Guid LocationID, IOrganizationService service)
        {
            var request_eoc = new Entity("spirit_eocserviceabilityrequest");
            request_eoc["spirit_opportunity"] = new EntityReference("opportunity", OppGuid);
            request_eoc["ownerid"] = new EntityReference("systemuser", owner_ID);
            request_eoc["spirit_eocavailabilityforservicelocatiid"] = new EntityReference("spirit_servicelocation", LocationID);
            service.Create(request_eoc);
        }
        public string createFiberServiceAbilityRequest(JObject AROValues, FSRDetails fsrd)
        {
            IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
            var request_fiber = new Entity("spirit_fiberserviceabilityrequest");
            request_fiber["spirit_bandwidthrequested"] = BandwidthOptionSetFactory.Instanse.GetOptionSet(fsrd.Bandwidth);
            request_fiber["ownerid"] = new EntityReference("systemuser", fsrd.OwnerID);
            request_fiber["spirit_termglobal"] = TermOptionSetFactory.Instanse.GetOptionSet(fsrd.Term);
            request_fiber["spirit_opportunity"] = new EntityReference("opportunity", fsrd.OpportunityId);
            request_fiber["spirit_fiberrequestid"] = new EntityReference("spirit_servicelocation", fsrd.LocationID);
            if (fsrd.Diversity == "true")
            {
                request_fiber["spirit_diverse"] = true;
                int diversitytype = getDiversityType(fsrd.DiversityType);                
                request_fiber["spirit_diversitytype"] = new OptionSetValue((int)diversitytype);
            }
            if (fsrd.Diversity == "false")
                request_fiber["spirit_diverse"] = false;
            request_fiber["spirit_classofservice"] = string.IsNullOrEmpty(fsrd.classOfService) ? ClassOfServiceOptionSetFactory.Instanse.GetOptionSet("Ethernet") : ClassOfServiceOptionSetFactory.Instanse.GetOptionSet(fsrd.classOfService);
            request_fiber["spirit_notes"] = string.IsNullOrEmpty(fsrd.ProposedSolution) == true ? "Internet" : fsrd.ProposedSolution;
            string[] BandwidthArray = { "2000Mb", "3000Mb", "4000Mb", "5000Mb", "6000Mb", "7000Mb", "8000Mb", "9000Mb", "10000Mb" };
            if (fsrd.classOfService == "Ethernet" && fsrd.LocationType == "OnNet" && !BandwidthArray.Contains(fsrd.Bandwidth) && fsrd.Diversity != "true")
            {                
                int addc = 6000, addec = 1000;
                request_fiber["spirit_additionalcosts"] = new Money((decimal)Convert.ToDouble(addc));
                request_fiber["spirit_additionalequipmentcosts"] = new Money((decimal)Convert.ToDouble(addec));
            }
            //ARO ADD 
            string burried_length = (string)AROValues.SelectToken("buried_length_feet");
            string link_status = (string)AROValues.SelectToken("link_status");
            string segment_name = (string)AROValues.SelectToken("segment_name");
            if (fsrd.classOfService == "Ethernet" && fsrd.LocationType != "OnNet" && fsrd.LocationType != "Existing" && fsrd.Diversity == "false" && link_status == "connected"){
                request_fiber.Attributes["spirit_burieddistance"] = Convert.ToDecimal(burried_length);
                request_fiber.Attributes["spirit_arofootage"] = Convert.ToDecimal(burried_length);
                //FOR UAT
                //request_fiber.Attributes["new_arodistanceft"] = Convert.ToDecimal(burried_length);
                request_fiber["spirit_cityzonerural"] = new OptionSetValue((int)241870016);
                request_fiber["spirit_aroconnectedsite"] = true;
            }
            if (segment_name != ""){
                string updated = updateLocation(segment_name, fsrd.LocationID, service);
                if (updated != "updated") return updated;
            }
            try
            {
                Guid fsrid = service.Create(request_fiber);
            }
            catch (Exception)
            {
                return "false";
            }
            return "Success";
        }
        private int getDiversityType(string diversityType)
        {
            int diversitytype = 0;
            switch (diversityType)
            {
                case "Dedicated Physical Ring":
                    diversitytype = 241870001;
                    break;
                case "Dual Entrance Facility":
                    diversitytype = 241870002;
                    break;
                case "Non Collapsed Last Mile Lateral":
                    diversitytype = 241870003;
                    break;
                case "Non Collapsed Lateral & Dual Entrance":
                    diversitytype = 241870004;
                    break;
                case "POP Diversity with Router Diversity":
                    diversitytype = 241870005;
                    break;
                case "Redundant CPE Router/Switch 10G Port":
                    diversitytype = 241870006;
                    break;
                case "Redundant CPE Router/Switch 1G Port":
                    diversitytype = 241870007;
                    break;
                case "Single Pop with Router Diversity":
                    diversitytype = 241870008;
                    break;
            }
            return diversitytype;
        }

        private int getLocationType(string LocationType)
        {
            int Lvalue = 0;
            switch (LocationType)
            {
                case "New":
                    Lvalue = 241870000;
                    break;
                case "Existing":
                    Lvalue = 241870001;
                    break;
                case "OnNet":
                    Lvalue = 241870002;
                    break;
            }
            return Lvalue;
        }

        private int getInterfaceSpeed(string LocationInterfaceSpeed) {
            int interfacespd = 0;
            switch (LocationInterfaceSpeed)
            {
                case "100Mb":
                    interfacespd = 241870000;
                    break;
                case "1Gb":
                    interfacespd = 241870001;
                    break;
                case "10Gb":
                    interfacespd = 241870002;
                    break;
            }
            return interfacespd;
        }

        private string updateLocation(string segment_name, Guid LocationID, IOrganizationService service)
        {
            Guid Segment_ID = AROConnection.getSegmentID(segment_name);
            if (Segment_ID.ToString() != "00000000-0000-0000-0000-000000000000")
            {
                Entity request_location = new Entity("spirit_servicelocation");
                request_location.Id = LocationID;
                request_location["spirit_fibersegment"] = new EntityReference("spirit_fibersegment", Segment_ID);
                try
                {
                    service.Update(request_location);                    
                }
                catch (Exception e)
                {
                    return "Error Message = " + e.Message + "Error Source " + e.Source;
                }
            }
            return "updated";
        }
    }
}
