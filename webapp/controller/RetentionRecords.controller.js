sap.ui.define([
  "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/apptech/app-retention/controller/AppUI5",
	"sap/ui/core/BusyIndicator"
], function(MessageBox, Controller, JSONModel, MessageToast,Fragment, Filter, FilterOperator,AppUI5,BusyIndicator) {
  "use strict";


  return Controller.extend("com.apptech.app-retention.controller.RetentionRecords", {

    onInit: function () {

			this.Database = jQuery.sap.storage.get("Database");
			this.UserName = jQuery.sap.storage.get("Usename");
      
      		//Selection Menu
			this.POData = new JSONModel("model/POCreation.json");
			this.getView().setModel(this.POData, "POData");

			//Get All Contract and Retention Records
			this.oMdlAllRecords = new JSONModel();
			this.fGetAllRecords("getContractRecordsDPayment",1);

			//getButtons
			this.oMdlButtons = new JSONModel();
			this.oResults = AppUI5.fGetButtons(this.Database,this.UserName,"contractransaction");
				var newresult = [];
					this.oResults.forEach((e)=> {
						  var d = {};
						  d[e.U_ActionDesc] = JSON.parse(e.visible);
						  newresult.push(JSON.parse(JSON.stringify(d)));
				});
			var modelresult = JSON.parse("{" + JSON.stringify(newresult).replace(/{/g,"").replace(/}/g,"").replace("[","").replace("]","") + "}");
			this.oMdlButtons.setJSON("{\"buttons\" : " + JSON.stringify(modelresult) + "}");
			this.getView().setModel(this.oMdlButtons, "buttons");
	},	
	fGetAllRecords: function (queryTag,Param) {

		$.ajax({
		  url: "https://18.136.35.41:4300/app_xsjs/ExecQuery.xsjs?dbName=" + this.Database + "&procName=spAppRetention&queryTag=" + queryTag +"&value1=" + Param + "&value2=&value3=&value4=",
		  type: "GET",
		  beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + btoa("SYSTEM:P@ssw0rd805~"));
		  },
		  error: function(xhr, status, error) {
			MessageToast.show(error);
		  },
		  success: function(json) {},
		  context: this
		}).done(function(results) {
		  if (results) {
			this.oMdlAllRecords.setJSON("{\"allbp\" : " + JSON.stringify(results) + "}");
			this.getView().setModel(this.oMdlAllRecords, "oMdlAllRecords");
		  }
		});
	
	},
	fSelectRetentionTransaction:function (){

		var RetentionRecords = this.getView().byId("selectRecordGroup").getSelectedKey();

		switch(RetentionRecords)
		{
			case "1":
			this.fGetAllRecords("getContractRecordsDPayment",1);
			this.getView().byId("DpAmount").setVisible(true);
			this.getView().byId("DPRate").setVisible(true);
			this.getView().byId("ProDP").setVisible(false);
			this.getView().byId("ProReten").setVisible(false);
			break;
			case "2":
			this.fGetAllRecords("getContractRecords",2);
			this.getView().byId("DpAmount").setVisible(false);
			this.getView().byId("DPRate").setVisible(false);
			this.getView().byId("ProDP").setVisible(true);
			this.getView().byId("ProReten").setVisible(true);
			break;
			case "3":
			this.fGetAllRecords("getContractRecords",3);
			this.getView().byId("DpAmount").setVisible(false);
			this.getView().byId("DPRate").setVisible(false);
			this.getView().byId("ProDP").setVisible(true);
			this.getView().byId("ProReten").setVisible(true);
			break;
			case "4":
			this.fGetAllRecords("getContractRecords",4);
			this.getView().byId("DpAmount").setVisible(false);
			this.getView().byId("DPRate").setVisible(false);
			this.getView().byId("ProDP").setVisible(true);
			this.getView().byId("ProReten").setVisible(true);
			break;
			case "5":
			this.fGetAllRecords("getContractRecords",5);
			this.getView().byId("DpAmount").setVisible(false);
			this.getView().byId("DPRate").setVisible(false);
			this.getView().byId("ProDP").setVisible(true);
			this.getView().byId("ProReten").setVisible(true);
			
			break;
		}

	},
	fProcess:function (){

		this.oTable = this.getView().byId("tblTransaction");
		this.oTable.setModel(this.oMdlAllRecord);

		var iIndex = this.oTable.getSelectedIndex();

		var oRowSelected = this.oTable.getBinding().getModel().getData().allbp[this.oTable.getBinding().aIndices[iIndex]];

		this.POData.getData().RetenTransaction.Contractor = oRowSelected.CardName;
		this.POData.getData().RetenTransaction.TransactionNumber = oRowSelected.DocNum;
		this.POData.getData().RetenTransaction.ContractAmount = oRowSelected.ContractAmount;
		this.POData.getData().RetenTransaction.PostingDate = oRowSelected.DocDate;
		this.POData.getData().RetenTransaction.ProjectCode = oRowSelected.U_APP_ProjCode;
		this.POData.getData().RetenTransaction.ProgressBIll = oRowSelected.ProgbillRate;
		this.POData.getData().RetenTransaction.RetenYCWIP = oRowSelected.U_APP_CWIP;
		this.POData.getData().RetenTransaction.RetenNCWIP = oRowSelected.U_APP_YCWIP;
		this.POData.getData().RetenTransaction.GrossAmount = oRowSelected.GrossAmount;
		this.POData.getData().RetenTransaction.ProratedReten = oRowSelected.U_APP_ProRetention;
		this.POData.getData().RetenTransaction.ProgBillAmount = oRowSelected.U_APP_ProgBillAmount;
		this.POData.getData().RetenTransaction.ProratedDP = oRowSelected.U_APP_ProratedDP;
		this.POData.getData().RetenTransaction.WTX = oRowSelected.U_APP_WTX;
		this.POData.getData().RetenTransaction.LineTotal = oRowSelected.LineTotal;
		this.POData.getData().RetenTransaction.DPAmount = oRowSelected.AmountoPay;
		this.POData.refresh();

		var otab1 = this.getView().byId("idIconTabBarInlineMode");
		otab1.setSelectedKey("tab2");    

	},
	fPrint:function (){

		var Contractor = "";
		var TransactionNumber = "";
		var ContractAmount = "";
		var ProjectCode = "";
		var ProgressBIll = "";
		var DPAmount = "";
		var WTaX = "";
		var ContractAmount = "";
		var oTax = "";
		var oTaxx = "";
		var oTaxxx = "";
		var ConName = "";
		var AmntPay = "";
		var GrossAmount = "";
		var ProratedDP = "";
		var ProratedRetention = "";

		Contractor = this.POData.getData().RetenTransaction.Contractor;
		TransactionNumber = this.POData.getData().RetenTransaction.TransactionNumber;
		ContractAmount = this.getView().byId("ContractAmount").getValue();
		ProgressBIll = this.POData.getData().RetenTransaction.ProgressBIll;
		DPAmount = this.getView().byId("DpAmount").getValue();
		AmntPay = this.getView().byId("AmntPay").getValue();
		ProjectCode = this.POData.getData().RetenTransaction.ProjectCode;
		WTaX = this.POData.getData().RetenTransaction.WTX;
		GrossAmount = this.getView().byId("GRAmount").getValue();
		ProratedDP = this.getView().byId("ProDP").getValue();
		ProratedRetention = this.getView().byId("ProReten").getValue();

		var doc = new jsPDF('p');

		var SelectedKey = this.getView().byId("selectRecordGroup").getSelectedKey();

		switch(SelectedKey)
		{
			case "1":

				doc.text(20,20,'Biotech Farms Inc.(BFI)');
				doc.setFontSize(12)
				doc.text(20,25,'Bo.6,Sout Cotabato');

				doc.setFontSize(20)
				doc.text(38,45,'DOWNPAYMENT TRANSACTION REPORT');
				doc.setFontSize(14)
				doc.text(160,54,'2020-20-20');
				doc.text(145,55,'Date:____________');

				doc.text(20,70,ConName.concat('Contractor Name:','',Contractor));
				doc.text(20,78,ConName.concat('Project Code:','',ProjectCode));

				doc.text(30,90,'Contract Amount:');
				doc.text(100,90,ContractAmount);
				doc.text(30,100,'Down Payment Rate:');
				doc.text(100,101,'__________');
				doc.text(100,100,ProgressBIll.concat('%'));
				doc.text(30,110,'Down Payment Amount:');
				doc.text(100,110,DPAmount);
				doc.text(30,120,'Withholding Tax:');
				doc.text(100,120,oTax.concat('(',WTaX,')'));
				doc.text(100,121,'__________');
				doc.text(30,130,'Amount to Pay:');
				doc.text(100,130,AmntPay);
				doc.save('Downpayment.pdf');	
			break;
			case "2":
				doc.text(20,20,'Biotech Farms Inc.(BFI)');
				doc.setFontSize(12)
				doc.text(20,25,'Bo.6,Sout Cotabato');

				doc.setFontSize(20)
				doc.text(68,45,'FIRST BILLING REPORT');
				doc.setFontSize(14)
				doc.text(160,54,'2020-20-20');
				doc.text(145,55,'Date:____________');

				doc.text(20,70,ConName.concat('Contractor Name:','',Contractor));
				doc.text(20,78,ConName.concat('Project Code:','',ProjectCode));
				doc.text(30,90,'Contract Amount:');
				doc.text(100,90,ContractAmount);
				doc.text(30,100,'Progress Billing Rate:');
				doc.text(100,101,'__________');
				doc.text(100,100,ProgressBIll.concat('%'));
				doc.text(30,110,'Gross Amount:');
				doc.text(100,110,GrossAmount);
				doc.text(30,120,'Prorated Down Payment:');
				doc.text(97,120,oTax.concat('- ',ProratedDP));
				doc.text(30,130,'Prorated Retention:');
				doc.text(97,130,oTaxx.concat('- ',ProratedRetention));
				doc.text(30,140,'Withholding Tax:');
				doc.text(97,140,oTaxxx.concat('- ',WTaX,));
				doc.text(100,141,'__________');
				doc.text(30,150,'Amount to Pay:');
				doc.text(100,150,AmntPay);
				doc.save('FirstBilling.pdf');	

			break;
			case "3":
				doc.text(20,20,'Biotech Farms Inc.(BFI)');
				doc.setFontSize(12)
				doc.text(20,25,'Bo.6,Sout Cotabato');

				doc.setFontSize(20)
				doc.text(50,45,'SUBSEQUENT BILLING REPORT');
				doc.setFontSize(14)
				doc.text(160,54,'2020-20-20');
				doc.text(145,55,'Date:____________');

				doc.text(20,70,ConName.concat('Contractor Name:','',Contractor));
				doc.text(20,78,ConName.concat('Project Code:','',ProjectCode));
				doc.text(30,90,'Contract Amount:');
				doc.text(100,90,ContractAmount);
				doc.text(30,100,'Progress Billing Rate:');
				doc.text(100,101,'__________');
				doc.text(100,100,ProgressBIll.concat('%'));
				doc.text(30,110,'Gross Amount:');
				doc.text(100,110,GrossAmount);
				doc.text(30,120,'Prorated Down Payment:');
				doc.text(97,120,oTax.concat('- ',ProratedDP));
				doc.text(30,130,'Prorated Retention:');
				doc.text(97,130,oTaxx.concat('- ',ProratedRetention));
				doc.text(30,140,'Withholding Tax:');
				doc.text(97,140,oTaxxx.concat('- ',WTaX,));
				doc.text(100,141,'__________');
				doc.text(30,150,'Amount to Pay:');
				doc.text(100,150,AmntPay);
				doc.save('Subsequent.pdf');	

			break;
			case "4":
				doc.text(20,20,'Biotech Farms Inc.(BFI)');
				doc.setFontSize(12)
				doc.text(20,25,'Bo.6,Sout Cotabato');

				doc.setFontSize(20)
				doc.text(50,45,'FINAL BILLING REPORT');
				doc.setFontSize(14)
				doc.text(160,54,'2020-20-20');
				doc.text(145,55,'Date:____________');

				doc.text(20,70,ConName.concat('Contractor Name:','',Contractor));
				doc.text(20,78,ConName.concat('Project Code:','',ProjectCode));
				doc.text(30,90,'Contract Amount:');
				doc.text(100,90,ContractAmount);
				doc.text(30,100,'Progress Billing Rate:');
				doc.text(100,101,'__________');
				doc.text(100,100,ProgressBIll.concat('%'));
				doc.text(30,110,'Gross Amount:');
				doc.text(100,110,GrossAmount);
				doc.text(30,120,'Prorated Down Payment:');
				doc.text(97,120,oTax.concat('- ',ProratedDP));
				doc.text(30,130,'Prorated Retention:');
				doc.text(97,130,oTaxx.concat('- ',ProratedRetention));
				doc.text(30,140,'Withholding Tax:');
				doc.text(97,140,oTaxxx.concat('- ',WTaX,));
				doc.text(100,141,'__________');
				doc.text(30,150,'Amount to Pay:');
				doc.text(100,150,AmntPay);
				doc.save('Final.pdf');	

			break;
			
		}
				// doc.autoTable({html:'#tblTransaction'});
				// doc.autoTable({
				// 	head: [['Contractor','Transaction Number','Contract Amount','Posting Date','Project Code','Progress Bill','Retention Yes CWIP']],
				// 	body: [
				// 		[Contractor,TransactionNumber,ContractAmount,PostingDate,ProjectCode,ProgressBIll,RetenYCWIP],
				// 	]
				// });
				// doc.autoTable({
				// 	head: [['Retention No CWIP','Gross Amount','Prorated Retention','Progress Billing Amount','Prorated DP','Witholding Tax']],
				// 	body: [
				// 		[RetenNCWIP,GrossAmount,ProratedReten,ProgBillAmount,ProratedDP,WTaX],
				// 	]
				// });
				// doc.text(20, 20, 'Hello world.');	
				// doc.save('Downpayment.pdf');	
	}

  });
});
 