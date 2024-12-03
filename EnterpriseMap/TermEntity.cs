using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace EnterpriseMap
{
	public class TermEntity
	{
		public Guid retrieveTerm(string term)
		{
			string termInMonth = getTermInMonth(term);
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			var query = new QueryExpression
			{
				EntityName = "cpq_term",
				ColumnSet = new ColumnSet("cpq_termid"),
				Criteria = new FilterExpression
				{
					Filters =
					{
						new FilterExpression
						{
							Conditions ={ new ConditionExpression("cpq_numberofmonths", ConditionOperator.Equal, termInMonth)}
						}
					}
				}
			};
			Entity entity = service.RetrieveMultiple(query).Entities.FirstOrDefault();
			if (entity == null)
				return new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
			return entity.Id;
		}
		private String getTermInMonth(string term)
		{
			string termInMonth = "";
			switch (term)
			{
				case "M-M":
					termInMonth = "1";
					break;
				case "1yr":
					termInMonth = "12";
					break;
				case "2yr":
					termInMonth = "24";
					break;
				case "3yr":
					termInMonth = "36";
					break;
				case "4yr":
					termInMonth = "48";
					break;
				case "5yr":
					termInMonth = "60";
					break;
				case "6yr":
					termInMonth = "72";
					break;
				case "7yr":
					termInMonth = "84";
					break;
				case "8yr":
					termInMonth = "96";
					break;
				case "9yr":
					termInMonth = "108";
					break;
				case "10yr":
					termInMonth = "120";
					break;
				case "15yr":
					termInMonth = "180";
					break;
				case "20yr":
					termInMonth = "240";
					break;
				case "25yr":
					termInMonth = "300";
					break;
				case "50yr":
					termInMonth = "600";
					break;
				default:
					termInMonth = "0";
					break;
			}
			return termInMonth;
		}
	}
}