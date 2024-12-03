using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Xrm.Sdk;
namespace Spirit.Esrimap.Business
{
	public class BandwidthOptionSetFactory
	{
		private static BandwidthOptionSetFactory _instanse;

		private BandwidthOptionSetFactory()
		{
		}

		public static BandwidthOptionSetFactory Instanse
		{
			get { return _instanse ?? (_instanse = new BandwidthOptionSetFactory()); }
		}
		public OptionSetValue GetOptionSet(string term)
		{
			int value = 0;
			switch (term)
			{
				//case "2Mb":
				//    value = 241870017;
				//    break;
				//case "3Mb":
				//    value = 241870000;
				//    break;
				//case "5Mb":
				//    value = 241870001;
				//    break;
				//case "6Mb":
				//    value = 241870020;
				//    break;
				//case "10Mb":
				//    value = 241870002;
				//    break;
				case "20Mb":
					value = 241870003;
					break;
				//case "30Mb":
				//    value = 241870004;
				//    break;
				//case "40Mb":
				//    value = 241870005;
				//    break;
				case "50Mb":
					value = 241870006;
					break;
				//case "60Mb":
				//    value = 241870021;
				//    break;
				//case "70Mb":
				//    value = 241870022;
				//    break;
				//case "80Mb":
				//    value = 241870023;
				//    break;
				//case "90Mb":
				//    value = 241870024;
				//    break;
				case "100Mb":
					value = 241870007;
					break;
				//case "150Mb":
				//    value = 241870030;
				//    break;
				//case "200Mb":
				//    value = 241870008;
				//    break;
				//case "250Mb":
				//    value = 241870031;
				//    break;
				//case "300Mb":
				//    value = 241870009;
				//    break;
				//case "350Mb":
				//    value = 241870032;
				//    break;
				//case "400Mb":
				//    value = 241870010;
				//    break;
				//case "450Mb":
				//    value = 241870033;
				//    break;
				case "500Mb":
					value = 241870011;
					break;
				//case "550Mb":
				//    value = 241870034;
				//    break;
				//case "600Mb":
				//    value = 241870025;
				//    break;
				//case "650Mb":
				//    value = 241870026;
				//    break;
				//case "700Mb":
				//    value = 241870027;
				//    break;
				//case "750Mb":
				//    value = 241870012;
				//    break;
				//case "800Mb":
				//    value = 241870018;
				//    break;
				//case "850Mb":
				//    value = 241870019;
				//    break;
				//case "900Mb":
				//    value = 241870028;
				//    break;
				//case "950Mb":
				//    value = 241870029;
				//    break;
				case "1000Mb":
					value = 241870013;
					break;
				case "2000Mb":
					value = 241870035;
					break;
				case "3000Mb":
					value = 241870036;
					break;
				//case "4000Mb":
				//    value = 241870037;
				//    break;
				case "5000Mb":
					value = 241870038;
					break;
				//case "6000Mb":
				//    value = 241870039;
				//    break;
				//case "7000Mb":
				//    value = 241870040;
				//    break;
				//case "8000Mb":
				//    value = 241870041;
				//    break;
				//case "9000Mb":
				//    value = 241870042;
				//    break;
				case "10000Mb":
					value = 241870015;
					break;
				case "100000Mb":
					value = 241870016;
					break;
				case "200000Mb":
					value = 241870043;
					break;
				case "400000Mb":
					value = 241870053;
					break;
				case "N/A":
					value = 241870014;
					break;
				case "DS0":
					value = 241870044;
					break;
				case "DS1":
					value = 241870045;
					break;
				case "DS3":
					value = 241870046;
					break;
				case "OC3":
					value = 241870047;
					break;
				case "OC12":
					value = 241870048;
					break;
				case "OC48":
					value = 241870049;
					break;
				case "OC192":
					value = 241870050;
					break;
				case "Cross Connect":
					value = 241870051;
					break;
				case "Other":
					value = 241870052;
					break;
					//default:
					//    value = 241861000;
					//    break;
			}
			return new OptionSetValue(value);
		}
	}
}