using System;
using System.ServiceModel.Description;
using System.Net;
using Microsoft.Xrm.Tooling.Connector;
using Microsoft.Xrm.Sdk;
using System.Configuration;

namespace EnterpriseMap
{
	public class DynamicsServiceConnection
	{
		public static Uri HomeRealmUri { get; private set; }
		public static ClientCredentials DeviceCredentials { get; private set; }
		public static IOrganizationService GetCRM_Service()
		{
			//1402 cloud configuration
			// - transition from on prim to Dynamics 365 cloud
			//***************************************Start**************************************
			Uri organizationUri = new Uri(ConfigurationManager.AppSettings["organizationUri"]);
			String clientId = ConfigurationManager.AppSettings["clientId"];
			String clientSecret = ConfigurationManager.AppSettings["clientSecret"];
			try
			{
				//Create the Dynamics 365 Connection:
				Console.WriteLine("Connecting to Dynamics 365 Server...");
				ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;  //to prevent currentAccesstoken error
				CrmServiceClient service = new CrmServiceClient($@"AuthType=ClientSecret;url={organizationUri};ClientId={clientId};ClientSecret={clientSecret}");
				return service.OrganizationWebProxyClient != null ? service.OrganizationWebProxyClient : (IOrganizationService)service.OrganizationServiceProxy;
			}
			catch (Exception ex)
			{
				Console.WriteLine("Error while connecting to Dynamics 365 Server " + ex.Message);
				Console.ReadKey();
				return null;
			}
			//***************************************End**************************************
		}
	}
}