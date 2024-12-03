using System;
using System.Linq;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace EnterpriseMap
{
	public class ContactInfo
	{
		public static Guid CreateContact(Guid Owner_ID, String ConFristName, String ConLastName, String ConNumber, String ConEmail, String streetAddress, String City, String State
			, String Zip)
		{
			String stateShortRepresentation = State.Length == 2 ? State : StatesOfUSA.GetStateByName(State.Trim());
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			int role = 100000003;
			Entity _contact = new Entity("contact");
			_contact.Attributes["firstname"] = ConFristName;
			_contact.Attributes["new_contacttype"] = new OptionSetValue((int)role);
			_contact.Attributes["ownerid"] = new EntityReference("systemuser", Owner_ID);
			_contact.Attributes["lastname"] = ConLastName;
			_contact.Attributes["emailaddress1"] = ConEmail;
			_contact.Attributes["telephone1"] = ConNumber;
			_contact.Attributes["address1_line1"] = streetAddress;
			_contact.Attributes["address1_city"] = City;
			_contact.Attributes["address1_stateorprovince"] = stateShortRepresentation;
			_contact.Attributes["address1_postalcode"] = Zip;
			Guid contactID = service.Create(_contact);
			return contactID;
		}

		public static Guid GetContactID(Guid Acc_ID)
		{
			IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
			try
			{
				var query = new QueryExpression
				{
					EntityName = "contact",
					ColumnSet = new ColumnSet("contactid"),
					Criteria = new FilterExpression
					{
						Filters =
					{
						new FilterExpression
						{
							Conditions =
							{
								new ConditionExpression("parentcustomerid", ConditionOperator.Equal, Acc_ID)
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
				return entity.Id;
			}
			catch (InvalidOperationException)
			{
				Guid g = new Guid("11223344-5566-7788-99AA-BBCCDDEEFF00");
				return g;
			}
		}
	}
}