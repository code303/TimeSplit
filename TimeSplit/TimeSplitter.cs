using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace TimeSplit
{
	class TimeSplitter
	{
		#region -------------------------------- Members ------------------------------------------

		private Project _currentProject;
		private Dictionary<int, Project> _projects = new Dictionary<int, Project>();
		private DateTime _lastStateChange;
	
		#endregion

		#region -------------------------------- Properties ---------------------------------------

		public Dictionary<int, Project> Projects
		{
			get { return _projects; }
		}

		#endregion

		#region -------------------------------- Constructor --------------------------------------

		public TimeSplitter()
		{
			// ToDo: letzten Projekte laden
			_projects = ReadProjectsFromLastRun();

			if (_projects.Count < 1)
			{
				_projects.Add(0, new Project(0, Properties.Settings.Default.Project0));
				_projects.Add(1, new Project(1, Properties.Settings.Default.Project1));
				_projects.Add(2, new Project(2, Properties.Settings.Default.Project2));
				_projects.Add(3, new Project(3, Properties.Settings.Default.Project3));
				_projects.Add(4, new Project(4, Properties.Settings.Default.Project4));
				_projects.Add(5, new Project(5, Properties.Settings.Default.Project5));
				_projects.Add(6, new Project(6, Properties.Settings.Default.Project6));
				_projects.Add(7, new Project(7, Properties.Settings.Default.Project7));
			}
			_currentProject = Projects[0];
			_lastStateChange = DateTime.Now;
		}

		private Dictionary<int, Project> ReadProjectsFromLastRun()
		{
			Dictionary<int, Project> projects = new Dictionary<int, Project>();

			try
			{
				// get laast report
				FileInfo lastReport = GetLastReportFile();
				StreamReader reader = new StreamReader(lastReport.FullName, System.Text.Encoding.Default);
				int projectIndex = 0;
				while (!reader.EndOfStream)
				{
					string line = reader.ReadLine();
					string projectString = GetProjectString(line);
					string description = GetDescription(line);
					projects.Add(projectIndex, new Project(projectIndex, projectString){ Description = description});

				}
			}
			catch { }

			return projects;
		}

		private string GetProjectString(string line)
		{
			int start = line.IndexOf(" - ") + 3;
			int end = line.IndexOf('\t');
			return line.Substring(start, end - start);
		} 
		
		private string GetDescription(string line)
		{
			int start = line.IndexOf("(") + 1;
			int end = line.LastIndexOf(')');
			return line.Substring(start, end - start);
		}

		private System.IO.FileInfo GetLastReportFile()
		{
			FileInfo [] reportFiles = new System.IO.DirectoryInfo(Path.GetTempPath()).GetFiles("TimeSplitReport_*");
			Dictionary<DateTime, FileInfo> files = new Dictionary<DateTime, FileInfo>();
			foreach (FileInfo file in reportFiles)
			{
				DateTime reportDate = GetDateFromFileName(file.Name);
				if (reportDate > DateTime.MinValue)
					files[reportDate] = file;
			}

			return files.OrderBy(f => (DateTime)f.Key).LastOrDefault().Value;
		}

		private DateTime GetDateFromFileName(string fileName)
		{
			string dateString = fileName.Substring(("TimeSplitReport_").Length, ("yyyy-MM-dd").Length);
			DateTime date = DateTime.MinValue;
			DateTime.TryParse(dateString, out date);
			return date;
		}
		
		#endregion

		#region -------------------------------- Methodes -----------------------------------------

		public void AddNewProject(Project project)
		{
			_projects.Add(project.Id, project);
		}

		public void FocusOnProject(int id)
		{
			//_currentProject.AddSeconds(new TimeSpan(DateTime.Now.Ticks - _lastStateChange.Ticks).Seconds);
			_currentProject.AddSlice(_lastStateChange, DateTime.Now);
			_currentProject = _projects[id];
			_lastStateChange = DateTime.Now;
		}

		public void CreateReport()
		{
			FocusOnProject(_currentProject.Id);
			string reportFileName = System.IO.Path.GetTempPath() + "TimeSplitReport_" + DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
			int count = 0;
			string suffix = "";
			while (new System.IO.FileInfo(reportFileName.Replace(".txt", suffix + ".txt")).Exists)
			{
				count++;
				suffix = "_" + count;
			}
			reportFileName = reportFileName.Replace(".txt", suffix + ".txt");

			System.IO.StreamWriter writer = new System.IO.StreamWriter(reportFileName);
			foreach (Project project in _projects.Values)
			{
				if (project.ElapsedTime.TotalSeconds > 1)
				{
					string hours = project.ElapsedTime.Hours.ToString("00");
					string minutes = project.ElapsedTime.Minutes.ToString("00");
					//string sec = project.ElapsedTime.Seconds.ToString("00");
					writer.WriteLine(hours + ":" + minutes + /*":" + sec + */" - " + project.Name + "\t (" + project.Description + ")");
				}
			}
			writer.Flush();
			writer.Close();
		}

		public void SetDescription(int id, string description)
		{
			_projects[id].Description = description;
		}
		
		public void SetName(int id, string name)
		{
			_projects[id].Name = name;
		}
	
		//private void FireEvent()
		//{
		//    OnMinute();
		//}

		public TimeSpan GetTimeSpan(Project project)
		{
			if (project.Equals(_currentProject))
				return _projects[project.Id].ElapsedTime.Add(DateTime.Now - _lastStateChange);
			else
				return _projects[project.Id].ElapsedTime;
		}

		#endregion
	}
}
