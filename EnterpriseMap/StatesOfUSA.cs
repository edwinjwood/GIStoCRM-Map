﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EnterpriseMap
{
	public class StatesOfUSA
	{
		public static string GetStateByName(string name)
		{
			switch (name.ToUpper())
			{
				case "ALABAMA":
					return "AL";

				case "ALASKA":
					return "AK";

				case "AMERICAN SAMOA":
					return "AS";

				case "ARIZONA":
					return "AZ";

				case "ARKANSAS":
					return "AR";

				case "CALIFORNIA":
					return "CA";

				case "COLORADO":
					return "CO";

				case "CONNECTICUT":
					return "CT";

				case "DELAWARE":
					return "DE";

				case "DISTRICT OF COLUMBIA":
					return "DC";

				case "FEDERATED STATES OF MICRONESIA":
					return "FM";

				case "FLORIDA":
					return "FL";

				case "GEORGIA":
					return "GA";

				case "GUAM":
					return "GU";

				case "HAWAII":
					return "HI";

				case "IDAHO":
					return "ID";

				case "ILLINOIS":
					return "IL";

				case "INDIANA":
					return "IN";

				case "IOWA":
					return "IA";

				case "KANSAS":
					return "KS";

				case "KENTUCKY":
					return "KY";

				case "LOUISIANA":
					return "LA";

				case "MAINE":
					return "ME";

				case "MARSHALL ISLANDS":
					return "MH";

				case "MARYLAND":
					return "MD";

				case "MASSACHUSETTS":
					return "MA";

				case "MICHIGAN":
					return "MI";

				case "MINNESOTA":
					return "MN";

				case "MISSISSIPPI":
					return "MS";

				case "MISSOURI":
					return "MO";

				case "MONTANA":
					return "MT";

				case "NEBRASKA":
					return "NE";

				case "NEVADA":
					return "NV";

				case "NEW HAMPSHIRE":
					return "NH";

				case "NEW JERSEY":
					return "NJ";

				case "NEW MEXICO":
					return "NM";

				case "NEW YORK":
					return "NY";

				case "NORTH CAROLINA":
					return "NC";

				case "NORTH DAKOTA":
					return "ND";

				case "NORTHERN MARIANA ISLANDS":
					return "MP";

				case "OHIO":
					return "OH";

				case "OKLAHOMA":
					return "OK";

				case "OREGON":
					return "OR";

				case "PALAU":
					return "PW";

				case "PENNSYLVANIA":
					return "PA";

				case "PUERTO RICO":
					return "PR";

				case "RHODE ISLAND":
					return "RI";

				case "SOUTH CAROLINA":
					return "SC";

				case "SOUTH DAKOTA":
					return "SD";

				case "TENNESSEE":
					return "TN";

				case "TEXAS":
					return "TX";

				case "UTAH":
					return "UT";

				case "VERMONT":
					return "VT";

				case "VIRGIN ISLANDS":
					return "VI";

				case "VIRGINIA":
					return "VA";

				case "WASHINGTON":
					return "WA";

				case "WEST VIRGINIA":
					return "WV";

				case "WISCONSIN":
					return "WI";

				case "WYOMING":
					return "WY";
				default:
					return "NA";
			}
		}
	}
}