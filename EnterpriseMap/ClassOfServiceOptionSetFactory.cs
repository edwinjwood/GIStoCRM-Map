using Microsoft.Xrm.Sdk;
namespace Spirit.Esrimap.Business
{
	public class ClassOfServiceOptionSetFactory
	{
		private static ClassOfServiceOptionSetFactory _instanse;

		private ClassOfServiceOptionSetFactory()
		{
		}

		public static ClassOfServiceOptionSetFactory Instanse
		{
			get { return _instanse ?? (_instanse = new ClassOfServiceOptionSetFactory()); }
		}

		public OptionSetValue GetOptionSet(string cos)
		{
			int value;
			switch (cos)
			{
				case "DarkFiber":
					value = 241870012;
					break;
				case "Ethernet":
					value = 241870004;
					break;
				case "Other":
					value = 241870009;
					break;
				case "Wavelength Service":
					value = 241870010;
					break;
				case "TDM":
					value = 241870013;
					break;
				default:
					value = 241870004;
					break;

			}
			return new OptionSetValue(value);
		}
	}
}