using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Newtonsoft.Json.Linq;
using Spirit.Esrimap.Business;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace EnterpriseMap
{
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]
	public class LocationCreationService : System.Web.Services.WebService
	{
		public string ARO_token = "";
		public string getReportID = "";
		[WebMethod]
		public string createAllLocations(ListLocation LocObj)
		{
			try
			{
				Guid LocationID = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
				List<String> Locterm = LocObj.term;
				String OppId = LocObj.OppID;
				Guid OppGuid = Guid.Parse(OppId);
				String LocData = LocObj.LocationData;
				Debug.WriteLine("88888888888888888 === " + LocObj);
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
					String LongitudeLocation = LatLongSplit[1].Trim();
					String LatitudeLocation = LatLongSplit[0].Trim();
					User user = new EnterpriseMap.User();
					Guid owner_ID = user.getSystemUserId(LocObj.username + "@ad.segra.com"); //1402 cloud configuration - transition from on prim to Dynamics 365 cloud [username format change]
					LocationID = createLocation(Details[i].LocationName, owner_ID, Details[i].LocationNearNetOnNetLocationID, StreetAddress, Details[i].LocationApartment, Details[i].LocationType, City, OppGuid, stateShortRepresentation, Zipcode, LatitudeLocation, LongitudeLocation, Details[i].LocationsalesChannelForLocation, Details[i].LocationDiversity, Details[i].LocationType1, Details[i].LocationSubType, Details[i].LocationFloor, Details[i].LocationMultiTenant, Details[i].LocationApartmentType, service);
					if (Details[i].LocationFiber == "true")
					{
						hle_to_create_counter += 1;
						Debug.WriteLine("hlec = " + hle_to_create_counter);
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
						//fsrd.Term = Locterm.First();
						fsrd.SalesChannel = Details[i].LocationsalesChannelForLocation;
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
					Debug.WriteLine("time to create fsr == " + hle_to_create_counter);
					//ARO_token = ARO_token == "" ? AROConnection.getAROToken() : ARO_token;
					Debug.WriteLine("ARO TOKEM  = " + ARO_token);
					if (getReportID == "")
					{
						//string Report_string = AROConnection.getAvailableReports(ARO_token);
						//Debug.WriteLine("Report_string  = " + Report_string);
						//JArray values = JArray.Parse(Report_string);

						//foreach (var Data in values)
						//{
						//    //Debug.WriteLine("Data  =========================" + Data);

						//    if (Data["reportData"]["name"].ToString() == "rfp_output")
						//    {
						//        Debug.WriteLine("reportData  =========================" + Data["reportData"]["id"] + Data["reportData"]["name"]);
						//        getReportID = Data["reportData"]["id"].ToString();
						//    }

						//}
					}
					//JObject first_element = (JObject)values[0];
					//Debug.WriteLine("first_element  = " + first_element);
					//JObject first_report = (JObject)first_element.GetValue("reportData");
					//Debug.WriteLine("first_report  = " + first_report);
					//string Report_id = (string)first_report.SelectToken("id");
					Debug.WriteLine("Report Id == " + getReportID);
					JObject postData = new JObject();
					postData.Add(new JProperty("rfpId", OppGuid.ToString()));
					postData.Add(new JProperty("fiberRoutingMode", "ROUTE_FROM_FIBER"));
					postData.Add(new JProperty("targets", target_hle));
					Debug.WriteLine("post Dat == " + postData);
					//string PlanId = AROConnection.getPlainId(ARO_token, postData.ToString());
					//Debug.WriteLine("Plan ID = " + PlanId);
					//string AllReports = AROConnection.getIndividualReport(PlanId, Report_id, ARO_token);
					//string AllReports = AROConnection.getIndividualReport(PlanId, getReportID, ARO_token);
					//Debug.WriteLine("ALL Reports = " + AllReports);
					//JArray ARO_values = JArray.Parse(AllReports);
					Debug.WriteLine("hle counter == " + hle_to_create_counter);
					for (int j = 0; j < hle_to_create_counter; j++)
					{
						for (int k = 0; k < hle_to_create_counter; k++)
						{
							//JObject AROINFO = (JObject)ARO_values[k];
							//string location_id = (string)AROINFO.SelectToken("location_id");
							//if (location_id == fsrclass[j].LocationID.ToString())
							//{
							createFiberServiceAbilityRequest(fsrclass[j]);
							break;
							//}
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
		private Guid createLocation(string LocationName, Guid owner_ID, string LocationNearNetOnNetLocationID_str, string StreetAddress, string LocationApartment, string LocationType, string City, Guid OppGuid, string stateShortRepresentation, string Zipcode, string LatitudeLocation, string LongitudeLocation, string LocationsalesChannelForLocation, string LocationDiversity, string LocationType1, string LocationSubType, string LocationFloor, string LocationMultiTenant, string LocationApartmentType, IOrganizationService service)
		{
			var request_sla = new Entity("spirit_servicelocation");
			request_sla["spirit_businessname"] = LocationName;
			request_sla["ownerid"] = new EntityReference("systemuser", owner_ID);
			if (LocationNearNetOnNetLocationID_str != "" || !(string.IsNullOrEmpty(LocationNearNetOnNetLocationID_str)))
			{
				Guid NearNetOnNetLocationID = new Guid(LocationNearNetOnNetLocationID_str);
				request_sla["sgr_nearnetid"] = new EntityReference("spirit_nearnetlocation", NearNetOnNetLocationID);
			}
			int? stateOptionValueNullable = GetOptionSetValueFromLabel("ccl_masterservicelocation", "spirit_state", stateShortRepresentation, service);
			int stateOptionValue = 0;
			if (stateOptionValueNullable.HasValue) stateOptionValue = stateOptionValueNullable.Value;

			int? intLocationType1 = GetOptionSetValueFromLabel("spirit_servicelocation", "spirit_locationtype1", LocationType1, service);
			int locationTypeOptionValue = 0;
			if (intLocationType1.HasValue) locationTypeOptionValue = intLocationType1.Value;

			int? locationSubTypeNullable = GetOptionSetValueFromLabel("spirit_servicelocation", "spirit_locationsubtype", LocationSubType, service);
			int locationSubTypeOptionValue = 0;
			if (locationSubTypeNullable.HasValue) locationSubTypeOptionValue = locationSubTypeNullable.Value;


			request_sla["spirit_locationtype1"] = new OptionSetValue((int)locationTypeOptionValue);
			request_sla["spirit_locationsubtype"] = new OptionSetValue((int)locationSubTypeOptionValue);
			request_sla["spirit_street1"] = StreetAddress;
			int Lvalue = getLocationType(LocationType);
			request_sla["spirit_locationtype"] = new OptionSetValue((int)Lvalue);
			request_sla["spirit_city"] = City;
			request_sla["spirit_servicelocationforopportunityid"] = new EntityReference("opportunity", OppGuid);
			request_sla["spirit_statenew"] = new OptionSetValue(stateOptionValue);
			// request_sla["spirit_state"] = stateShortRepresentation;
			request_sla["spirit_postalcode"] = Zipcode;
			// request_sla["spirit_npanxx"] = LocationNpanxx;
			request_sla["spirit_esrilatitude"] = LatitudeLocation;
			request_sla["spirit_esrilongitude"] = LongitudeLocation;
			//var location_link = "https://segramaps.lumosnet.com/portal/home/webmap/viewer.html?webmap=2bfe53deb7d4427b9659594c04e8c54d&marker=" + LongitudeLocation + ";" + LatitudeLocation + ";&level=18";
			//var location_link = "https://segramapsuat.lumosnet.com/portal/home/webmap/viewer.html?webmap=2bfe53deb7d4427b9659594c04e8c54d&marker=" + LongitudeLocation + ";" + LatitudeLocation + ";&level=18";
			var location_link = new Uri(ConfigurationManager.AppSettings["location_link"]) + "&marker=" + LongitudeLocation + ";" + LatitudeLocation + ";&level=18";
			request_sla["spirit_locationlink"] = location_link;
			int salesChannelForLocation = 24187000;
			if (LocationsalesChannelForLocation == "enterprise")
				salesChannelForLocation = 241870000;
			else if (LocationsalesChannelForLocation == "government")
				salesChannelForLocation = 241870002;
			request_sla["spirit_saleschannelglobal"] = new OptionSetValue((int)salesChannelForLocation);
			request_sla["spirit_diverse"] = LocationDiversity == "true" ? true : false;
			request_sla["spirit_sourcelocation"] = false;

			if (LocationType1 == "Building")
			{
				int? floorNullable = GetOptionSetValueFromLabel("spirit_servicelocation", "spirit_floor", LocationFloor, service);
				int floorOptionValue = 0;
				if (floorNullable.HasValue) floorOptionValue = floorNullable.Value;
				request_sla["spirit_floor"] = new OptionSetValue((int)floorOptionValue);
				int multiTenantOn = 241870001;
				int multiTenantOff = 241870000;
				request_sla["spirit_multitenant"] = LocationMultiTenant == "on" ? new OptionSetValue((int)multiTenantOn) : new OptionSetValue((int)multiTenantOff);
			}

			if (LocationApartmentType != "")
			{
				int? ApartmentTypeNullable = GetOptionSetValueFromLabel("spirit_servicelocation", "spirit_secondaryaddressdesignator", LocationApartmentType, service);
				int apartmentTypeOptionValue = 0;
				if (ApartmentTypeNullable.HasValue) apartmentTypeOptionValue = ApartmentTypeNullable.Value;
				request_sla["spirit_secondaryaddressdesignator"] = new OptionSetValue((int)apartmentTypeOptionValue);
				request_sla["spirit_street2"] = LocationApartment;
			}


			return service.Create(request_sla);
		}

		public static int? GetOptionSetValueFromLabel(string entityName, string fieldName, string labelString, IOrganizationService service)
		{
			var attReq = new RetrieveAttributeRequest();
			attReq.EntityLogicalName = entityName;
			attReq.LogicalName = fieldName;
			attReq.RetrieveAsIfPublished = true;

			var attResponse = (RetrieveAttributeResponse)service.Execute(attReq);
			var attMetadata = (EnumAttributeMetadata)attResponse.AttributeMetadata;

			return attMetadata.OptionSet.Options.Where(x => x.Label.UserLocalizedLabel.Label == labelString).FirstOrDefault().Value;
		}

		private void createOffNetRequest(string bandwidth, Guid owner_ID, string term, Guid OppGuid, Guid LocationID, string LocationCos, string LocationProposedSol, IOrganizationService service, string LocationInterfaceSpeed)
		{
			var request_offnet = new Entity("spirit_offnetserviceabilityrequest");
			request_offnet["spirit_bandwidthrequested"] = BandwidthOptionSetFactory.Instanse.GetOptionSet(bandwidth);
			request_offnet["ownerid"] = new EntityReference("systemuser", owner_ID);
			request_offnet["spirit_termglobal"] = TermOptionSetFactory.Instanse.GetOptionSet(term);
			request_offnet["spirit_opportunity"] = new EntityReference("opportunity", OppGuid);
			request_offnet["spirit_offnetrequestid"] = new EntityReference("spirit_servicelocation", LocationID);
			Debug.WriteLine("LocationCos == " + LocationCos);
			var circuitType = string.IsNullOrEmpty(LocationCos) == true ? ClassOfServiceOptionSetFactory.Instanse.GetOptionSet("Ethernet") : ClassOfServiceOptionSetFactory.Instanse.GetOptionSet(LocationCos);
			Debug.WriteLine("circuitType === " + circuitType);
			request_offnet["spirit_circuittype"] = circuitType;
			request_offnet["spirit_notes"] = string.IsNullOrEmpty(LocationProposedSol) == true ? "Note" : LocationProposedSol;
			Debug.WriteLine("Here = " + LocationInterfaceSpeed);
			int interfacespd = getInterfaceSpeed(LocationInterfaceSpeed);
			Debug.WriteLine("Here = {0}", interfacespd);
			if (interfacespd != 0)
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
		public string createFiberServiceAbilityRequest(FSRDetails fsrd)
		{
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			var request_fiber = new Entity("spirit_fiberserviceabilityrequest");
			request_fiber["spirit_bandwidthrequested"] = BandwidthOptionSetFactory.Instanse.GetOptionSet(fsrd.Bandwidth);
			request_fiber["ownerid"] = new EntityReference("systemuser", fsrd.OwnerID);
			//request_fiber["spirit_termglobal"] = TermOptionSetFactory.Instanse.GetOptionSet(fsrd.Term);
			request_fiber["spirit_opportunity"] = new EntityReference("opportunity", fsrd.OpportunityId);
			request_fiber["spirit_fiberrequestid"] = new EntityReference("spirit_servicelocation", fsrd.LocationID);
			int salesChannelForLocation = 24187000;
			if (fsrd.SalesChannel == "enterprise")
				salesChannelForLocation = 241870000;
			else if (fsrd.SalesChannel == "government")
				salesChannelForLocation = 241870002;
			request_fiber["spirit_saleschannel"] = new OptionSetValue((int)salesChannelForLocation);
			if (fsrd.Diversity == "true")
			{
				request_fiber["spirit_diverse"] = true;
				int diversitytype = getDiversityType(fsrd.DiversityType);
				Debug.WriteLine("diversityType = " + diversitytype);
				request_fiber["spirit_diversitytype"] = new OptionSetValue(diversitytype);
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
			//string burried_length = (string)AROValues.SelectToken("buried_length_feet");
			//string link_status = (string)AROValues.SelectToken("link_status");
			//string segment_name = (string)AROValues.SelectToken("segment_name");
			//if (fsrd.classOfService == "Ethernet" && fsrd.LocationType != "OnNet" && fsrd.LocationType != "Existing" && fsrd.Diversity == "false" && link_status == "connected")
			if (fsrd.classOfService == "Ethernet" && fsrd.LocationType != "OnNet" && fsrd.LocationType != "Existing" && fsrd.Diversity == "false")
			{
				//request_fiber.Attributes["spirit_burieddistance"] = Convert.ToDecimal(burried_length);
				//request_fiber.Attributes["spirit_arofootage"] = Convert.ToDecimal(burried_length);
				//FOR UAT
				//request_fiber.Attributes["new_arodistanceft"] = Convert.ToDecimal(burried_length);
				request_fiber["spirit_cityzonerural"] = new OptionSetValue((int)241870016);
				request_fiber["spirit_aroconnectedsite"] = false;
			}
			//if (segment_name != "")
			//{
			//    string updated = updateLocation(segment_name, fsrd.LocationID, service);
			//    if (updated != "updated") return updated;
			//}
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
			int diversitytype = 241870000;
			switch (diversityType)
			{
				case "Dedicated Virtual Ring":
					diversitytype = 241870001;
					break;
				case "Dedicated Physical Ring":
					diversitytype = 241870000;
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

		private int getInterfaceSpeed(string LocationInterfaceSpeed)
		{
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
				default:
					interfacespd = 0;
					break;
			}
			return interfacespd;
		}

		private string updateLocation(string segment_name, Guid LocationID, IOrganizationService service)
		{
			//Guid Segment_ID = AROConnection.getSegmentID(segment_name);
			//if (Segment_ID.ToString() != "00000000-0000-0000-0000-000000000000")
			//{
			//    Entity request_location = new Entity("spirit_servicelocation");
			//    request_location.Id = LocationID;
			//    request_location["spirit_fibersegment"] = new EntityReference("spirit_fibersegment", Segment_ID);
			//    try
			//    {
			//        service.Update(request_location);
			//    }
			//    catch (Exception e)
			//    {
			//        return "Error Message = " + e.Message + "Error Source " + e.Source;
			//    }
			//}
			return "updated";
		}
	}
}