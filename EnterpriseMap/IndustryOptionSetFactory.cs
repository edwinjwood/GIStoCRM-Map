using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Xrm.Sdk;


namespace Spirit.Esrimap.Business
{
	public class IndustryOptionSetFactory
	{
		private static IndustryOptionSetFactory _instanse;

		private IndustryOptionSetFactory()
		{
		}
		public static IndustryOptionSetFactory Instanse
		{
			get { return _instanse ?? (_instanse = new IndustryOptionSetFactory()); }
		}
		public OptionSetValue GetOptionSet(string insdustry)
		{
			int value = 0;
			switch (insdustry)
			{
				case "Accommodation":
					value = 241870017;
					break;
				case "Administrative":
					value = 241870018;
					break;
				case "Agriculture":
					value = 241870019;
					break;
				case "Arts":
					value = 241870000;
					break;
				case "Construction":
					value = 241870001;
					break;
				case "Education":
					value = 241870002;
					break;
				case "Finance":
					value = 241870003;
					break;
				case "Health":
					value = 241870004;
					break;
				case "Information":
					value = 241870005;
					break;
				case "Management":
					value = 241870006;
					break;
				case "Manufacturing":
					value = 241870007;
					break;
				case "Mining":
					value = 241870008;
					break;
				case "Other":
					value = 241870009;
					break;
				case "Professional":
					value = 241870010;
					break;
				case "Public":
					value = 241870011;
					break;
				case "Real":
					value = 241870012;
					break;
				case "Retail":
					value = 241870013;
					break;
				case "Transportation":
					value = 241870014;
					break;
				case "Utilities":
					value = 241870015;
					break;
				case "Wholesale":
					value = 241870016;
					break;
				default:
					value = 241861000;
					break;

			}
			return new OptionSetValue(value);
		}
	}
}