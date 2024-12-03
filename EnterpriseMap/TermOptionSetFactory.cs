using Microsoft.Xrm.Sdk;

namespace Spirit.Esrimap.Business
{
	public class TermOptionSetFactory
	{
		private static TermOptionSetFactory _instanse;

		private TermOptionSetFactory()
		{
		}
		public static TermOptionSetFactory Instanse
		{
			get { return _instanse ?? (_instanse = new TermOptionSetFactory()); }
		}
		public OptionSetValue GetOptionSet(string term)
		{
			int value = 0;
			switch (term)
			{
				case "State-Contract":
					value = 241870015;
					break;
				case "M-M":
					value = 241870000;
					break;
				case "1yr":
					value = 241870001;
					break;
				case "2yr":
					value = 241870002;
					break;
				case "3yr":
					value = 241870003;
					break;
				case "4yr":
					value = 241870004;
					break;
				case "5yr":
					value = 241870005;
					break;
				case "6yr":
					value = 241870006;
					break;
				case "7yr":
					value = 241870007;
					break;
				case "8yr":
					value = 241870008;
					break;
				case "9yr":
					value = 241870009;
					break;
				case "10yr":
					value = 241870010;
					break;
				case "15yr":
					value = 241870011;
					break;
				case "20yr":
					value = 241870012;
					break;
				case "25yr":
					value = 241870013;
					break;
				case "50yr":
					value = 241870014;
					break;
				default:
					value = 241861000;
					break;
			}
			return new OptionSetValue(value);
		}
	}
}