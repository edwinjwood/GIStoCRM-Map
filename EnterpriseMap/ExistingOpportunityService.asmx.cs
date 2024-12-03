using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace EnterpriseMap
{
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]
	public class ExistingOpportunityService : System.Web.Services.WebService
	{
		[WebMethod]
		public string getExistingOpportunity(String existingoppid)
		{
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			var query = new QueryExpression
			{
				EntityName = "opportunity",
				ColumnSet = new ColumnSet("spirit_opportunityid", "name", "parentaccountid", "dyncloud_saleschannel"),
				Criteria = new FilterExpression
				{
					Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("spirit_opportunityid", ConditionOperator.Equal, existingoppid)
								}
							}
						}
				}
			};
			Entity entity = service.RetrieveMultiple(query).Entities.FirstOrDefault();
			if (entity == null)
				return "";
			string id = (entity.Id).ToString();
			var locInfo = GetLocationForOpp(entity.Id);
			String name = (string)entity.Attributes["name"];
			string accountName1 = "";
			var saleschannel = ((OptionSetValue)entity.Attributes["dyncloud_saleschannel"]).Value; //retired spirit_saleschannel
			string salesChannelString = "enterprise";
			if (saleschannel == 241870002)
				salesChannelString = "government";
			if (entity.Attributes.Contains("parentaccountid"))
				accountName1 = entity.GetAttributeValue<EntityReference>("parentaccountid").Name; //For Name string                 
																								  //string accountName = "New Logo";
			string accountName = "";
			if (accountName1 != null || accountName1 != "")
			{
				accountName = accountName1;
			}
			var l1 = new LocationInfo();
			l1.name = name;
			l1.accountname = accountName;
			l1.salesChannel = salesChannelString;
			l1.id = entity.Id;
			l1.locAddress = "";
			l1.locationtype = "";
			l1.isSourecLoc = false;
			locInfo.Add(l1);
			var json = new JavaScriptSerializer().Serialize(locInfo);
			return json;
		}

		public List<LocationInfo> GetLocationForOpp(Guid id)
		{
			var list_loc_info = new List<LocationInfo>();
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			try
			{
				var query = new QueryExpression
				{
					EntityName = "spirit_servicelocation",
					ColumnSet = new ColumnSet("spirit_servicelocationid", "spirit_addressmerged", "spirit_businessname", "spirit_locationtype", "spirit_sourcelocation", "cloud_addressmerged"),
					Criteria = new FilterExpression
					{
						Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("spirit_servicelocationforopportunityid", ConditionOperator.Equal, id),
								}
							}
						}
					}
				};
				query.AddOrder("spirit_businessname", OrderType.Ascending);
				List<Entity> entity = service.RetrieveMultiple(query).Entities.ToList<Entity>();
				for (int i = 0; i < entity.Count; i++)
				{
					String name;
					try
					{
						name = Convert.ToString(entity[i].Attributes["spirit_businessname"]);
					}
					catch (KeyNotFoundException)
					{
						name = "Name Not Present";
					}
					Guid LocID = entity[i].Id;
					//String address = Convert.ToString(entity[i].Attributes["spirit_addressmerged"]);
					String address = Convert.ToString(entity[i].Attributes["cloud_addressmerged"]);
					//Debug.WriteLine("address merged = "+ address);
					String locationtype;
					try
					{
						locationtype = ((Microsoft.Xrm.Sdk.OptionSetValue)(entity[i].Attributes["spirit_locationtype"])).Value.ToString();
					}
					catch (KeyNotFoundException)
					{
						locationtype = "No Location Type";
					}
					Boolean isSource = false;
					try
					{
						var x = entity[i].Attributes["spirit_sourcelocation"].ToString();
						isSource = x == "True" ? true : false;
					}
					catch (KeyNotFoundException)
					{
						isSource = false;
					}
					var l1 = new LocationInfo();
					l1.name = name;
					l1.id = LocID;
					l1.locAddress = address;
					l1.locationtype = locationtype;
					l1.isSourecLoc = isSource;
					list_loc_info.Add(l1);
				}
				if (entity == null)
					throw new InvalidOperationException();
			}
			catch (InvalidOperationException)
			{
				return list_loc_info;
			}
			return list_loc_info;
		}
	}
}