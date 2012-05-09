using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TimeSplit
{
	public class Slice
	{
		#region -------------------------------- Members ------------------------------------------
		
		private DateTime _begin;
		private DateTime _end;
		
		#endregion
		
		#region -------------------------------- Properties ---------------------------------------

		/// <summary>
		/// Dauer einer Teilaufgabe
		/// </summary>
		public TimeSpan Duration
		{
			get
			{
				if (_begin == null || _end == null)
					return new TimeSpan(0);
				else
					return _end - _begin;
			}
		}
		#endregion

		#region -------------------------------- Constructor --------------------------------------

		public Slice(DateTime begin, DateTime end)
		{
			_begin = begin;
			_end = end;
		}

		#endregion
	}
}
