using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EnterpriseMap
{
	public class LocationInfo
	{
		public Guid id { get; set; }
		public string accountname { get; set; }
		public string locAddress { get; set; }
		public string name { get; set; }
		public string salesChannel { get; set; }
		public string locationtype { get; set; }
		public Boolean isSourecLoc { get; set; }
	}
}