using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Spirit.Esrimap.Business;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web.Services;

namespace EnterpriseMap
{
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]
	public class OpportunityCreationService : System.Web.Services.WebService
	{
		[WebMethod]
		public string createTheOpportunity(aData obj)
		{
			try
			{
				List<String> OPTerm = obj.EOpportunityTerm;
				IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
				User user = new User();
				Guid owner_ID = user.getSystemUserId(obj.EmployeeName + "@ad.segra.com"); //1402 cloud configuration - transition from on prim to Dynamics 365 cloud [username format change]
				Guid AccountID = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
				Guid ContactID = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
				Guid opportunityID = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
				String OPEstimatedCloseDate = obj.EEstimaedCloseDate;
				DateTime parsedDate = DateTime.Parse(OPEstimatedCloseDate);
				int saleschannelvalue = 241870000;
				if (obj.SalesChannel == "enterprise")
				{
					saleschannelvalue = 241870000;
				}
				else if (obj.SalesChannel == "government")
				{
					saleschannelvalue = 241870002;
				}
				int ContractValueBasedOnString = getContractValue(obj.EOpportunityContract);
				if (obj.EAccountNumber == "None")
				{
					// String[] AddressSplit = obj.EContactAddress.Split(',');
					String ContactState = obj.ContactState;
					bool isNewLogo = true;
					String stateShortRepresentation = ContactState.Length == 2 ? ContactState : StatesOfUSA.GetStateByName(ContactState.Trim());
					String[] ContactName = obj.ContactName.Split(new char[] { ' ' }, 2, StringSplitOptions.RemoveEmptyEntries);
					ContactID = ContactInfo.CreateContact(owner_ID, ContactName[0], ContactName[1], obj.ContactNumber, obj.ContactEmail, obj.ContactStreet.Trim(), obj.ContactCity.Trim(), ContactState, obj.ContactZip);
					AccountID = AccountCreation.CreateProspectAccount(owner_ID, ContactID, obj.EAccountName, obj.EAccountEmail, obj.EAccountStreet, obj.EAccountCity, obj.EAccountState, obj.EAccountZip, obj.EAccountUrl, obj.EAccountPhone);
					opportunityID = createOpportunity(obj.EOpportunityName, owner_ID, ""/*OPTerm.First()*/, ContactID, AccountID, saleschannelvalue, ContractValueBasedOnString, ""/*obj.Industry*/, parsedDate, obj.EEstimaedRevenue, service, isNewLogo);
				}
				else
				{
					bool isNewLogo = false;
					AccountID = new Guid(obj.EAccountID);
					ContactID = ContactInfo.GetContactID(AccountID);
					opportunityID = createOpportunity(obj.EOpportunityName, owner_ID, ""/*OPTerm.First()*/, ContactID, AccountID, saleschannelvalue, ContractValueBasedOnString, ""/*obj.Industry*/, parsedDate, obj.EEstimaedRevenue, service, isNewLogo);
				}
				//createNote(owner_ID, obj.AppointmentDate, obj.AppointmentDateNote, opportunityID, obj.EmployeeName, service);
				string oppid = getOppID(opportunityID);
				return ("Success" + "&&&&" + opportunityID.ToString() + "&&&&" + oppid).ToString();
			}
			catch (Exception ex)
			{
				return (ex.Source + "&&&&" + ex.Message).ToString();
			}
		}

		private Guid createOpportunity(string OPName, Guid owner_ID, string term, Guid ContactID, Guid AccountID, int saleschannelvalue, int ContractValueBasedOnString, string industry, DateTime parsedDate, string EEstimaedRevenue, IOrganizationService service, bool isNewLogo)
		{
			Entity request_opportunity = new Entity("opportunity");
			request_opportunity["name"] = OPName;
			request_opportunity["ownerid"] = new EntityReference("systemuser", owner_ID);
			request_opportunity["spirit_campaignrelated"] = false;
			//request_opportunity["spirit_term"] = TermOptionSetFactory.Instanse.GetOptionSet(term);
			TermEntity termEntity = new TermEntity();
			/*Guid termGuid = termEntity.retrieveTerm(term);
            if (termGuid  != new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00")) {
                request_opportunity["cloud_term"] = new EntityReference("cpq_term", termGuid);
            } */           //Removing Term
			request_opportunity["customeridtype"] = 2;
			if (ContactID != new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00"))
			{
				request_opportunity["parentcontactid"] = new EntityReference("contact", ContactID);
			}
			//request_opportunity["parentcontactid"] = new EntityReference("contact", ContactID);
			request_opportunity["dyncloud_saleschannel"] = new OptionSetValue((int)saleschannelvalue);
			request_opportunity["spirit_type"] = new OptionSetValue((int)ContractValueBasedOnString);
			//request_opportunity["spirit_industry"] = /*new OptionSetValue((int)xxxx); */IndustryOptionSetFactory.Instanse.GetOptionSet(industry); /*Removing Industry*/
			request_opportunity["estimatedclosedate"] = parsedDate;
			request_opportunity["estimatedvalue"] = new Money((decimal)Convert.ToDouble(EEstimaedRevenue));
			if (AccountID != new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00"))
			{
				request_opportunity["parentaccountid"] = new EntityReference("account", AccountID);
			}
			if (isNewLogo)
			{
				int newLogo = 241870001;
				request_opportunity["spirit_newlogo2"] = new OptionSetValue((int)newLogo);
			}
			else
			{
				int newLogo = 241870000;
				request_opportunity["spirit_newlogo2"] = new OptionSetValue((int)newLogo);
			}

			return service.Create(request_opportunity);
		}

		public string getOppID(Guid opportunityID)
		{
			try
			{
				IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
				var query = new QueryExpression
				{
					EntityName = "opportunity",
					ColumnSet = new ColumnSet("spirit_opportunityid"),
					Criteria = new FilterExpression
					{
						Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("opportunityid", ConditionOperator.Equal, opportunityID),

								}
							}
						}
					}
				};
				Entity entity = service.RetrieveMultiple(query).Entities.FirstOrDefault();
				if (entity == null)
				{
					throw new InvalidOperationException();
				}
				String oppid = entity.Attributes["spirit_opportunityid"].ToString();
				return oppid;
			}
			catch (InvalidOperationException)
			{
				return "xyz";
			}
		}
		private int getContractValue(string OPContract)
		{
			int ContractValueBasedOnString = 0;
			switch (OPContract)
			{
				case "New":
					ContractValueBasedOnString = 241870000;
					break;
				case "Upgrade":
					ContractValueBasedOnString = 241870001;
					break;
				case "Renewal":
					ContractValueBasedOnString = 241870002;
					break;
				case "CoterminousAdds":
					ContractValueBasedOnString = 241870003;
					break;
			}
			return ContractValueBasedOnString;
		}

		private void createNote(Guid owner_ID, string Date, string Note, Guid opportunityID, string UName, IOrganizationService service)
		{
			Entity request_note = new Entity("annotation");
			request_note["ownerid"] = new EntityReference("systemuser", owner_ID);
			request_note["notetext"] = "Meeting with " + /*Contact_name*/  " \n" + "At Location = " + "\n" + "At Date = " + Date + "\n" + "Appointment Notes = " + Note;
			request_note["objectid"] = new EntityReference("opportunity", opportunityID);
			request_note["owninguser"] = UName;
			Guid note_ID = service.Create(request_note);
		}

		[WebMethod]
		public object GetAllKeysAndValuesFromConfig()
		{
			NameValueCollection settings = ConfigurationManager.AppSettings;

			var configValues = new System.Collections.Generic.Dictionary<string, string>();

			foreach (string key in settings.AllKeys)
			{
				configValues.Add(key, settings[key]);
			}

			return configValues;
		}

	}
}
