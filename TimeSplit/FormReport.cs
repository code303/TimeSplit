using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace TimeSplit
{
	public partial class FormReport : Form
	{
		public FormReport()
		{
			InitializeComponent();
		}


		private void FormReport_Click(object sender, EventArgs e)
		{
			this.Close();
		}

		private void FormReport_KeyPress(object sender, KeyPressEventArgs e)
		{
			char[] closeKeys = new char[] {'a', 'q', 'x', '\r', ' ', (char)27};
			if (closeKeys.Contains(e.KeyChar))
				this.Close();
		}

		private void labelReport_Click(object sender, EventArgs e)
		{
			this.Close();
		}
	}
}
