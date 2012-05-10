using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace TimeSplit
{
	public partial class MainForm : Form
	{
		private TimeSplitter _timeSplitter;
		private System.Timers.Timer _timer;

		delegate void UICallback();

		public MainForm()
		{
			InitializeComponent();
			_timeSplitter = new TimeSplitter();
			_timer = new System.Timers.Timer(5000);
			_timer.Elapsed += new System.Timers.ElapsedEventHandler(_timer_Elapsed);
			_timer.Enabled = true;
			_timer.AutoReset = true;
			_timer.Start();

		}

		private void _timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
		{
			try
			{
				if (InvokeRequired)
				{
					UICallback d = new UICallback(UpdateUI);
					this.Invoke(d, new object[] { });
				}
				else
				{
					UpdateUI();
				}
			}
			catch { }
			
		}

		private void UpdateUI()
		{
			if (_timeSplitter == null)
				return;
	
			TimeSpan sum = new TimeSpan(0);
			TimeSpan workSum = new TimeSpan(0);
			
			for (int i = 0; i < _timeSplitter.Projects.Count; i++)
			{
				sum = sum.Add(_timeSplitter.GetTimeSpan(_timeSplitter.Projects[i]));
				if(i!=0)
					workSum = workSum.Add(_timeSplitter.GetTimeSpan(_timeSplitter.Projects[i]));

				string timeSpanString = _timeSplitter.GetTimeSpan(_timeSplitter.Projects[i]).ToString();
				switch (i)
				{
					case 0:
						label0.Text = timeSpanString.Substring(0, 5);
						break;
					case 1:
						label1.Text = timeSpanString.Substring(0, 5);
						break;
					case 2:
						label2.Text = timeSpanString.Substring(0, 5);
						break;
					case 3:
						label3.Text = timeSpanString.Substring(0, 5);
						break;
					case 4:
						label4.Text = timeSpanString.Substring(0, 5);
						break;
					case 5:
						label5.Text = timeSpanString.Substring(0, 5);
						break;
					case 6:
						label6.Text = timeSpanString.Substring(0, 5);
						break;
					case 7:
						label7.Text = timeSpanString.Substring(0, 5);
						break;
					default:
						break;
				}
			}
			toolStripStatusLabelSum.Text = sum.ToString().Substring(0, 5);
			toolStripStatusLabelWorkSum.Text = "[" + workSum.ToString().Substring(0, 5) + "]";
		}

		private void MainForm_Load(object sender, EventArgs e)
		{
			//foreach (Project project in _timeSplitter.Projects.Values)
			//{
			//    AddNewProjectToForm(project.Id, project.Name, project.ElapsedTime, project.Description);
			//}
			this.textBox2.Text = "RnD Emails, OpenAir, iTrac";
			textBox1_TextChanged(this.textBox2, ErrorEventArgs.Empty);
			button1_Click(this.button2, EventArgs.Empty);
		}

		private void button1_Click(object sender, EventArgs e)
		{
			_timeSplitter.FocusOnProject(int.Parse((sender as Button).Tag.ToString())-1);
			
			System.Windows.Forms.Control.ControlCollection collection = this.Controls;
			

			
			foreach (Control c in collection)
			{
				if (c.Name.StartsWith("tabControl1"))
				{
					System.Windows.Forms.Control.ControlCollection coll2 = c.Controls;
			
					foreach (Control cc in coll2)
					{
						if (cc.Name.StartsWith("tabPageTimeSplit"))
						{
							foreach (Control ccc in cc.Controls)
							{
								if (ccc.Name.StartsWith("button"))
									ccc.BackColor = System.Drawing.SystemColors.Control;
							}
						}

						
					}
				}

				
			}
			Button b = sender as Button;
			b.BackColor = Color.LightGreen;
		}

		private void textBox1_TextChanged(object sender, EventArgs e)
		{
			_timeSplitter.SetDescription(int.Parse((sender as TextBox).Tag.ToString())-1, ((TextBox)sender).Text);

		}

		private void textBoxProjectName_TextChanged(object sender, EventArgs e)
		{
			_timeSplitter.SetName(int.Parse((sender as TextBox).Tag.ToString())-1, ((TextBox)sender).Text);
		}

		private void AddNewProjectToForm(int id, string name, TimeSpan elapsedTime, string description)
		{
			// Add ID
			//this.button1 = new System.Windows.Forms.Button();

			// Add Play Button
			//this.button1 = new System.Windows.Forms.Button();

			// Add Name
			// Add Time
			// Add Description
		}

		
		private void MainForm_FormClosed(object sender, FormClosedEventArgs e)
		{
			_timeSplitter.CreateReport();
		}



		/// <summary>
		/// Returns the full path and filename of the most recent report
		/// </summary>
		/// <returns>Full path and filename of the most recent report</returns>
		private string GetLastReport()
		{
			string report = "";
			string[] fileNames = Directory.GetFiles(System.IO.Path.GetTempPath(),"TimeSplitReport*");
			List<FileInfo> files = new List<FileInfo>();
			foreach(string fileName in fileNames)
				files.Add(new FileInfo(fileName));

			if(files.Count() > 0)
				report = files.OrderBy(f=>f.CreationTime).Last().FullName;
			return report;
		}

		private void toolStripStatusLabel1_Click(object sender, EventArgs e)
		{
			string tempDir = System.IO.Path.GetTempPath();
			if (Directory.Exists(tempDir))
				System.Diagnostics.Process.Start("explorer.exe", tempDir);
		}

		private void textBox16_TextChanged(object sender, EventArgs e)
		{
			int korrektur = 0;
			int.TryParse((sender as TextBox).Text, out korrektur);
			int project = int.Parse((string)(sender as Control).Tag)-1;
			_timeSplitter.Projects[project].AdjustMinutes = korrektur;
		}

		private void tabControl1_SelectedIndexChanged(object sender, EventArgs e)
		{
			if ((sender as TabControl).SelectedTab.Name == "tabPageTimeSplit")
			{
				this.TopMost = false;
			}
			else
			{
				this.TopMost = true;
				string reportFileName = GetLastReport();

				if (!string.IsNullOrEmpty(reportFileName))
				{
				    StreamReader reader = new StreamReader(reportFileName);
					labelReportDate.Text = (new FileInfo(reportFileName)).CreationTime.ToString("dd.MM.yyyy");
				    labelReport.Text = reader.ReadToEnd();
				    reader.Close();
				}
				else
				{
					labelReportDate.Text = "";
					labelReport.Text = "- no report available -";
				}
			}
		}
	}
}
