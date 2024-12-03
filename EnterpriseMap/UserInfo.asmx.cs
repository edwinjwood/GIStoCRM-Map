using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.DirectoryServices.AccountManagement;
using System.Web.Services;

namespace EnterpriseMap
{

	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]
	public class UserInfo : System.Web.Services.WebService
	{
		[WebMethod]
		public string getUsername(string name1)
		{
			String fullname = "Map User";
			try
			{
				using (var context = new PrincipalContext(ContextType.Domain))
				{
					UserPrincipal principal = null;
					if (name1.Length != 0)
					{

						using (principal = UserPrincipal.FindByIdentity(context, name1))
						{
							if (principal != null)
								fullname = principal.GivenName + " " + principal.Surname;
						}
					}
					else
					{
						fullname = "XYZ";
					}
				}
			}
			catch (Exception ex)
			{
				Debug.WriteLine(ex.Message);
			}
			String fname = JsonConvert.SerializeObject(fullname, Formatting.Indented);
			return fname;
		}
	}
}
