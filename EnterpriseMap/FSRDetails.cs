using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EnterpriseMap
{
	public class FSRDetails
	{
		public string rfpid { get; set; }
		public string longitude { get; set; }
		public string latitude { get; set; }
		public string classOfService { get; set; }
		public string LocationType { get; set; }
		public string Bandwidth { get; set; }
		public Guid OwnerID { get; set; }
		public Guid OpportunityId { get; set; }
		public Guid LocationID { get; set; }
		public string Diversity { get; set; }
		public string DiversityType { get; set; }
		public string ProposedSolution { get; set; }
		//public string Term { get; set; }
		public string SalesChannel { get; set; }
		//public string ClosingDate { get; set; }
	}
}