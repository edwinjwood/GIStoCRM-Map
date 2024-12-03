using Microsoft.Xrm.Sdk;

namespace Spirit.Esrimap.Business
{
	public class RegionOptionSetFactory
	{
		private static RegionOptionSetFactory _instanse;

		private RegionOptionSetFactory()
		{
		}

		public static RegionOptionSetFactory Instanse
		{
			get { return _instanse ?? (_instanse = new RegionOptionSetFactory()); }
		}

		public OptionSetValue GetOptionSet(string region)
		{
			int value = 0;
			switch (region)
			{
				case "Coastal TC":
					value = 241870000;
					break;
				case "Midlands TC":
					value = 241870001;
					break;
				case "North Carolina TC":
					value = 241870002;
					break;
				case "Upstate TC":
					value = 241870003;
					break;
				case "Wilmington TC":
					value = 241870004;
					break;
				case "Carrier TC":
					value = 241870005;
					break;
				default:
					value = 241861000;
					break;
			}
			return new OptionSetValue(value);
		}
	}
}