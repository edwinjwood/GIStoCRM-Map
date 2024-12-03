using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json.Linq;
using System;
using System.Diagnostics;
using System.Linq;
using System.Web.Services;

namespace EnterpriseMap
{
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]
	public class NearNetLocationCheckService : System.Web.Services.WebService
	{
		[WebMethod]
		public string checkIfLocationNearNet(LatLong latlongObj)
		{
			String latitude = latlongObj.Lat;
			String longitude = latlongObj.Long;
			String address = latlongObj.Address;
			String[] AddressSplit = address.Split(',');
			String StreetAddress = AddressSplit[0].Trim();
			String City = AddressSplit[1].Trim();
			String State = AddressSplit[2].Trim();
			String Zip = AddressSplit[3].Trim();
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			try
			{
				var query = new QueryExpression
				{
					EntityName = "spirit_nearnetlocation",
					ColumnSet = new ColumnSet("spirit_street1", "spirit_locationtype", "spirit_equipmentcost", "spirit_builddistance", "spirit_ospcost", "statuscode"),
					Criteria = new FilterExpression
					{
						Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("spirit_street1", ConditionOperator.Equal, StreetAddress),
									new ConditionExpression("spirit_postalcode", ConditionOperator.Equal, Zip),
									new ConditionExpression("statuscode", ConditionOperator.Equal, 1),
									new ConditionExpression("spirit_locationtype", ConditionOperator.Equal, "241870002"),
								}
							}
						}
					}
				};
				Entity entity = service.RetrieveMultiple(query).Entities.First();
				Debug.WriteLine("entity = " + entity);
				if (entity == null)
				{
					JObject Detailss = new JObject() {
							new JProperty("LocationType", 241870009),
							 };
					return Detailss.ToString();
				}
				string id = (entity.Id).ToString();
				var locType = (OptionSetValue)entity.Attributes["spirit_locationtype"];
				JObject Details;
				var nearNetStatus = (OptionSetValue)entity.Attributes["statuscode"];
				if (locType.Value.ToString() == "241870002" && nearNetStatus.Value == 1)
				{
					//Location is OnNet
					Details = new JObject() {
							new JProperty("LocationType", locType.Value),
							new JProperty("LocationID", id)
							 };
				}
				else
				{
					Details = new JObject() {
							new JProperty("LocationType", 241870009),
							 };
				}
				return Details.ToString();
			}
			catch (Exception)
			{
				JObject Details = new JObject() {
							new JProperty("LocationType", 241870009),
							 };
				return Details.ToString();
			}
		}
	}
}
