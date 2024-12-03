using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace EnterpriseMap
{

	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]
	public class UserRetrievalUnderManagerService : System.Web.Services.WebService
	{
		[WebMethod]
		public string retrieveSystemUserUnderManager(string managerName)
		{
			Debug.WriteLine("managerName = " + managerName);
			Guid systemUserID = getSystemUserID(managerName);
			Debug.WriteLine(systemUserID);
			if (systemUserID == new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00"))
			{
				return "No User Found";
			}
			List<string> systemUsers = getUserBasedOnSystemUserID(systemUserID);
			if (systemUsers.Count() > 0)
			{
				string ans = JsonConvert.SerializeObject(systemUsers, Formatting.Indented);
				return ans;
			}
			else
				return "No User Found";
		}

		public List<string> getUserBasedOnSystemUserID(Guid systemUserID)
		{
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			List<string> users = new List<string>();
			JObject Details;
			try
			{
				var query = new QueryExpression
				{
					EntityName = "systemuser",
					ColumnSet = new ColumnSet("fullname", "domainname"),
					Criteria = new FilterExpression
					{
						Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("parentsystemuserid", ConditionOperator.Equal, systemUserID),
								}
							}
						}
					}
				};
				query.AddOrder("fullname", OrderType.Ascending);
				List<Entity> entity = service.RetrieveMultiple(query).Entities.ToList<Entity>();
				if (entity == null)
				{
					return users;
				}
				for (int i = 0; i < entity.Count; i++)
				{
					Details = new JObject() {
							new JProperty("FullName", entity[i].Attributes["fullname"]),
							new JProperty("DomainName", entity[i].Attributes["domainname"])
							 };
					users.Add(Details.ToString());
				}
				return users;
			}
			catch (Exception)
			{
				return users;
			}
		}

		public Guid getSystemUserID(string managerName)
		{
			Guid systemUserID = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
			string DomainName = managerName + "@ad.segra.com"; //1402 cloud configuration - transition from on prim to Dynamics 365 cloud [username format change]
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			try
			{
				var query = new QueryExpression
				{
					EntityName = "systemuser",
					ColumnSet = new ColumnSet("systemuserid"),
					Criteria = new FilterExpression
					{
						Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("domainname", ConditionOperator.Equal, DomainName),
								}
							}
						}
					}
				};
				Entity entity = service.RetrieveMultiple(query).Entities.First();
				Debug.WriteLine("entity = " + entity);
				if (entity == null)
				{
					return systemUserID;
				}
				systemUserID = entity.Id;
				return systemUserID;
			}
			catch (Exception)
			{
				return systemUserID;
			}
		}
	}
}