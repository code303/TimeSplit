namespace TimeSplit
{
	partial class FormReport
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.labelReport = new System.Windows.Forms.Label();
			this.SuspendLayout();
			// 
			// labelReport
			// 
			this.labelReport.AutoSize = true;
			this.labelReport.Location = new System.Drawing.Point(3, 4);
			this.labelReport.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
			this.labelReport.Name = "labelReport";
			this.labelReport.Padding = new System.Windows.Forms.Padding(0, 0, 0, 8);
			this.labelReport.Size = new System.Drawing.Size(35, 21);
			this.labelReport.TabIndex = 0;
			this.labelReport.Text = "label1";
			this.labelReport.Click += new System.EventHandler(this.labelReport_Click);
			// 
			// FormReport
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.AutoSize = true;
			this.ClientSize = new System.Drawing.Size(74, 44);
			this.Controls.Add(this.labelReport);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
			this.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
			this.Name = "FormReport";
			this.ShowIcon = false;
			this.ShowInTaskbar = false;
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
			this.Text = "Report";
			this.Click += new System.EventHandler(this.FormReport_Click);
			this.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.FormReport_KeyPress);
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.Label labelReport;

	}
}