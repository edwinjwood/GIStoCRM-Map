using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EnterpriseMap
{
	public class LocationType1OptionSetFactory
	{
		private static LocationType1OptionSetFactory _instanse;

		private LocationType1OptionSetFactory()
		{
		}

		public static LocationType1OptionSetFactory Instanse
		{
			get { return _instanse ?? (_instanse = new LocationType1OptionSetFactory()); }
		}
		public OptionSetValue GetOptionSet(string locationType1)
		{
			int value = 241870000;
			switch (locationType1)
			{
				case "building":
					value = 241870000;
					break;
				case "campusBuilding":
					value = 241870002;
					break;
				case "tower":
					value = 241870001;
					break;
				case "smallCell":
					value = 241870003;
					break;
				case "splicepoint":
					value = 241870004;
					break;
				case "carrierBuildingDataCenter":
					value = 241870005;
					break;
			}
			return new OptionSetValue(value);
		}
	}
}