using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EnterpriseMap
{
    public class ListAroFsrData
    {
        public string buried_length_feet { get; set; }
        public string link_status { get; set; }
        public Guid location_id { get; set; }
        public string segment_name { get; set; }
        public string classOfService { get; set; }
        public string LocationType { get; set; }

    }
}