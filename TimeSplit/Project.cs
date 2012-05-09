using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TimeSplit
{
	class Project
	{
		private int _id;
		private string _name;
		private string _description;
		private List<Slice> _slices = new List<Slice>();
		private int _adjustMinutes;

		public int Id
		{
			get { return _id; }
		}

		public string Name
		{
			get { return _name; }
			set { _name = value; }
		}

		public TimeSpan ElapsedTime
		{
			get 
			{
				TimeSpan elapsed = new TimeSpan(0);
				
				foreach (Slice s in _slices)
					elapsed += s.Duration;

				if (_adjustMinutes > 0)
					elapsed = elapsed.Add(new TimeSpan(0, _adjustMinutes, 0));
				else
					elapsed = elapsed.Subtract(new TimeSpan(0, System.Math.Abs(_adjustMinutes), 0));
				
				return elapsed; 
			}
		}

		public int AdjustMinutes
		{
			get { return _adjustMinutes; }
			set { _adjustMinutes =  value; } 
		}

		public string Description
		{
			get { return _description; }
			set { _description = value; }
		}

		public Project(int id, string name)
		{
			_id = id;
			_name = name;
		}

		public void AddSlice(DateTime begin, DateTime end)
		{
			_slices.Add(new Slice(begin, end));
		}


	}
}
