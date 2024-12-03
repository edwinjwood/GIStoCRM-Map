using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Microsoft.Xrm.Sdk;
using System.Diagnostics;

namespace EnterpriseMap
{
	public class AROConnection
	{
		//DEV AND UAT
		//private static string baseURL = "https://segra-test.aro.altvil.com";

		//PROD
		private static string baseURL = "https://lumos.aro.altvil.com";
		//        public static string getAROToken()
		//        {
		//            try
		//            {
		//                var request = (HttpWebRequest)WebRequest.Create(baseURL + "/oauth/token");
		//                var postData = "grant_type=password";
		//                postData += "&client_id=segra";
		//                //postData += "&client_secret=%40VS7MT%3D%7DqBR%7B%3EnC%23";
		//                postData += "&client_secret=@VS7MT=}qBR{>nC#";
		//                postData += "&username=segra_api";
		//                postData += "&password=G<A4Y=LecCfdH";
		//                var data = Encoding.ASCII.GetBytes(postData);
		//                request.Method = "POST";
		//                request.ContentType = "application/x-www-form-urlencoded";
		//                request.ContentLength = data.Length;
		//                using (var stream = request.GetRequestStream())
		//                {
		//                    stream.Write(data, 0, data.Length);
		//                }
		//                var response = (HttpWebResponse)request.GetResponse();
		//                var accessToken = "";
		//                using (var responseString = new StreamReader(response.GetResponseStream())) {
		//                    JObject jsonObject = JObject.Parse(responseString.ReadToEnd());
		//                    accessToken = (string)jsonObject.GetValue("access_token");
		//                }
		//                response.Close();
		//                return accessToken;
		//        }
		//            catch (Exception e)
		//            {
		//                return "Exception = Message = " + e.Message + " Source = " + e.Source;
		//            }
		//}
		//public static string getAvailableReports(string accessToken)
		//{
		//    var request = (HttpWebRequest)WebRequest.Create(baseURL + "/api-ext/rfp/v1/report-definition");
		//    request.Method = "GET";
		//    request.PreAuthenticate = true;
		//    request.Headers.Add("Authorization", "Bearer " + accessToken);
		//    try
		//    {
		//        var response = (HttpWebResponse)request.GetResponse();
		//        var respnseString = "";
		//        using (var responseString = new StreamReader(response.GetResponseStream())) {
		//            respnseString = responseString.ReadToEnd();
		//        }
		//        //var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
		//        response.Close();
		//        return respnseString;
		//    }
		//    catch (Exception e)
		//    {
		//        return "Exception = Message = " + e.Message + " Source = " + e.Source;
		//    }
		//}
		//public static string getPlainId(string accessToken, string data)
		//{
		//    try
		//    {
		//        var request = (HttpWebRequest)WebRequest.Create(baseURL + "/api-ext/rfp/v1/process");
		//        byte[] data1 = Encoding.ASCII.GetBytes(data);
		//        Debug.WriteLine(data);
		//        request.Method = "POST";
		//        request.PreAuthenticate = true;
		//        request.Timeout = 500000;
		//        request.ReadWriteTimeout = 3200000;
		//        request.Headers.Add("Authorization", "Bearer " + accessToken);
		//        request.ContentType = "application/json";
		//        request.ContentLength = data1.Length;
		//        using (var stream = request.GetRequestStream())
		//        {
		//            stream.Write(data1, 0, data1.Length);
		//        }
		//        var response = (HttpWebResponse)request.GetResponse();
		//    string planId = "";
		//    using (var responseString = new StreamReader(response.GetResponseStream())) {
		//        JObject jsonObject = JObject.Parse(responseString.ReadToEnd());
		//        planId = (string)jsonObject.GetValue("planId");
		//        Debug.WriteLine("planID === ", planId);
		//    }
		//    //var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();            
		//    response.Close();
		//        return planId;
		//    }
		//    catch (Exception e)
		//    {
		//        return "Exception = Message = " + e.Message + " Source = " + e.Source;
		//    }
		//}
		//public static string getIndividualReport(string planId, string reportId, string accessToken)
		//{
		//    try
		//    {
		//        var request = (HttpWebRequest)WebRequest.Create(baseURL + "/api-ext/rfp/v1/" + planId + "/report/" + reportId + ".json");
		//        request.Method = "GET";
		//        request.PreAuthenticate = true;
		//        request.Headers.Add("Authorization", "Bearer " + accessToken);
		//        var response = (HttpWebResponse)request.GetResponse();
		//        var rString = "";
		//        using (var responseString = new StreamReader(response.GetResponseStream())) {
		//            rString = responseString.ReadToEnd();
		//        }
		//        //var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
		//        response.Close();
		//        return rString;
		//    }
		//    catch (Exception e)
		//    {
		//        return "Exception = Message = " + e.Message + " Source = " + e.Source;
		//    }
		//}
		public static Guid getSegmentID(string segmentname)
		{
			try
			{
				IOrganizationService service = DynamicsServiceConnection.GetCRM_Service();
				var query = new QueryExpression
				{
					EntityName = "spirit_fibersegment",
					ColumnSet = new ColumnSet("spirit_fibersegmentid"),
					Criteria = new FilterExpression
					{
						Filters =
						{
							new FilterExpression
							{
								Conditions =
								{
									new ConditionExpression("spirit_name", ConditionOperator.Equal, segmentname),

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
				Guid g = new Guid();
				return g;
			}
		}
	}
}