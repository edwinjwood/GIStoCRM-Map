using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
namespace EnterpriseMap
{
	public class User
	{
		public Guid getSystemUserId(string userName)
		{
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
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
							Conditions ={ new ConditionExpression("domainname", ConditionOperator.Equal, userName)}
						}
					}
				}
			};
			Entity entity = service.RetrieveMultiple(query).Entities.FirstOrDefault();
			if (entity == null)
				Debug.Write("Whats the yser name in her {0} \n", userName);
			return entity.Id;
		}
	}
}