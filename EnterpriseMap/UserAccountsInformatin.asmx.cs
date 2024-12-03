using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
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
	// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
	[System.Web.Script.Services.ScriptService]
	public class UserAccountsInformatin : System.Web.Services.WebService
	{

		[WebMethod]
		public string getUserAccounts(String name)
		{
			Debug.WriteLine("Username for ajax call er es frsdfsd fsd f = " + name);
			Debug.WriteLine("Username for ajax call = " + name);
			Char delimiter = '@';
			String[] substrings = name.Split(delimiter);
			Debug.WriteLine("Username for ajax call = " + substrings[0]);
			String USName = substrings[0] + "@ad.segra.com"; //1326 cloud configuration - transition from on prim to Dynamics 365 cloud [username format change]
			Debug.WriteLine("Username for ajax call = " + USName);
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			User user = new User();
			Guid owner_ID = user.getSystemUserId(USName);
			List<string> account_name = GetAccountID(owner_ID);
			int i = 0;
			List<string> Aname = new List<string>();
			List<string> Anumber = new List<string>();
			List<string> AId = new List<string>();
			List<Account> account = new List<Account>();
			//Account a = new Account();
			String[] seperator = { "@@@$$$" };
			foreach (object o in account_name)
			{
				String x = Convert.ToString(o);
				String[] words = x.Split(seperator, StringSplitOptions.RemoveEmptyEntries);
				Aname.Add(words[0]);
				Anumber.Add(words[1]);
				AId.Add(words[2]);
				Account a = new Account();
				a.Name = words[0];
				a.Number = words[1];
				a.AID = words[2];
				account.Add(a);
				i++;
			}
			//string ans = JsonConvert.SerializeObject(account, Formatting.Indented);
			JavaScriptSerializer jss = new JavaScriptSerializer();
			jss.MaxJsonLength = Int32.MaxValue;
			string ans = jss.Serialize(account);
			//int t = json.Length;
			//return json;
			return ans;
		}

		[WebMethod]
		public string getSalesRepAccounts(List<string> salesRepUnderManager)
		{
			Debug.WriteLine("getSales Rep functiom");
			Debug.WriteLine(salesRepUnderManager);
			if (salesRepUnderManager.Count == 0)
			{
				return "";
			}
			Dictionary<string, List<Account>> salesRepAccounts = new Dictionary<string, List<Account>>();
			for (int i = 0; i < salesRepUnderManager.Count; i++)
			{
				String AccountInfo = getUserAccounts(salesRepUnderManager[i]);
				List<Account> account = JsonConvert.DeserializeObject<List<Account>>(AccountInfo);
				salesRepAccounts.Add(salesRepUnderManager[i], account);
			}
			return JsonConvert.SerializeObject(salesRepAccounts, Formatting.Indented);
		}

		public List<string> GetAccountID(Guid ownerID)
		{
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			List<String> xyz = new List<string>();
			try
			{
				var query = new QueryExpression
				{
					EntityName = "account",
					ColumnSet = new ColumnSet("accountid", "name", "accountnumber", "statuscode"),

					Criteria = new FilterExpression
					{
						Filters =
					{
						new FilterExpression
						{
							Conditions =
							{
								new ConditionExpression("ownerid", ConditionOperator.Equal, ownerID),
								new ConditionExpression("statuscode", ConditionOperator.Equal, 1),
                                //new ConditionExpression("accountnumber",ConditionOperator.NotNull),
                            }
						}
					}
					}
				};
				query.AddOrder("name", OrderType.Ascending);

				List<Entity> entity = service.RetrieveMultiple(query).Entities.ToList<Entity>();
				if (entity == null)
				{
					throw new InvalidOperationException();
				}
				for (int i = 0; i < entity.Count; i++)
				{
					String name = Convert.ToString(entity[i].Attributes["name"]);
					String accountID = Convert.ToString(entity[i].Attributes["accountid"]);
					//String accountNumber = Convert.ToString(entity[i].Attributes["accountnumber"]);
					string accountNumber = "";
					//if (entity[i].Attributes["accountnumber"] != null && (entity[i].Attributes
					if (entityNullCatchStringValue(entity[i], "accountnumber") != "")
					{
						Debug.WriteLine("all the entity Account number " + Convert.ToString(entity[i].Attributes["accountnumber"]));
						accountNumber = Convert.ToString(entity[i].Attributes["accountnumber"]);
					}
					else
					{
						accountNumber = "NA";
					}
					String dummyString = String.Join("@@@$$$", name, accountNumber, accountID);
					xyz.Add(dummyString);
					Debug.WriteLine("name ==== " + name);
				}
				return xyz;
			}
			catch (InvalidOperationException)
			{
				xyz.Add("zzxasfsfsd");
				return xyz;
			}
		}
		private static string entityNullCatchStringValue(Entity entity, string type)
		{
			try
			{
				return (string)entity[type];
			}
			catch (Exception e)
			{
				return "";
			}
		}
		//public string getAccountName(String accountid) {
		//    Guid newGuid = Guid.Parse(accountid);
		//    IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
		//    var query = new QueryExpression
		//    {
		//        EntityName = "account",
		//        ColumnSet = new ColumnSet("name", "accountnumber"),
		//        Criteria = new FilterExpression
		//        {
		//            Filters =
		//                {
		//                    new FilterExpression
		//                    {
		//                        Conditions = { new ConditionExpression("accountid", ConditionOperator.Equal, newGuid) }
		//                    }
		//                }
		//        }
		//    };
		//    Entity entity = service.RetrieveMultiple(query).Entities.FirstOrDefault();
		//    if (entity == null) return "New Logo";
		//    var aname = (string)entity.Attributes["name"] + " - " + (string)entity.Attributes["accountnumber"];
		//    return aname;
		//}
	}
}
