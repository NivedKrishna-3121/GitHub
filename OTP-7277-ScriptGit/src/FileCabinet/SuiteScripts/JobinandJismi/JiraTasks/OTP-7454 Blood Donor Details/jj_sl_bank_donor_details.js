/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**********************************************************************************
 * OTP-7454 : Search through the database to find the matching blood donors
 *
 *
 * ********************************************************************************
 *
 * ********************
 * company name
 *
 * Author: Jobin and Jismi IT Services
 *
 *
 * Date Created: 10-July-2024
 *
 * Description: This script is for displaying the data in a custom record concurrently based on filters provided by the user in the custom form.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 10-July-2024: Created the initial build by JJ0354
 *
 *
 *
 **************/
define(["N/record", "N/search", "N/ui/serverWidget"], /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */ (record, search, serverWidget) => {
  /**
   * Defines the Suitelet script trigger point.
   * @param {Object} scriptContext
   * @param {ServerRequest} scriptContext.request - Incoming request
   * @param {ServerResponse} scriptContext.response - Suitelet response
   * @since 2015.2
   */
  const onRequest = (scriptContext) => {


    try{
    if (scriptContext.request.method == "GET") {
      //search using blood group and donation date
      var form = serverWidget.createForm({
        title: "Search Blood Donor",
        hideNavBar: true,
      });

      form.clientScriptFileId = 5437;

      let bloodgroup = form.addField({
        id: "custpage_bloodgroup_search",
        type: serverWidget.FieldType.SELECT,
        label: "Blood Group",
        source: "customlist_jj_blood_group",
      });
     
      let donationdate = form.addField({
        id: "custpage_donationdate_search",
        type: serverWidget.FieldType.DATE,
        label: "Donation Date",
      });
      //add sublist for donor name and phone number
      let sublist = form.addSublist({
        id: "custpage_donorsublist",
        type: serverWidget.SublistType.LIST,
        label: "Donors List",
      });
      sublist.addField({
        id: "custpage_jj_donorname",
        type: serverWidget.FieldType.TEXT,
        label: "Donor Name",
      });
      sublist.addField({
        id: "custpage_jj_donorphone",
        type: serverWidget.FieldType.TEXT,
        label: "Donor Phone",
      });
      sublist.addField({
        id: "custpage_jj_donordate",
        type: serverWidget.FieldType.DATE,
        label: "Donation Date",
      });

     
      //search using donor name and phone number    }
      let clientBlood = scriptContext.request.parameters.clientBlood;
      let clientDonationdate = scriptContext.request.parameters.clientLastDonation;
      log.debug(clientBlood)
      log.debug(clientDonationdate)
      
      let date = new Date(clientDonationdate);

      // Extract the day, month, and year
      let day = String(date.getDate()+1).padStart(2, "0");
      let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      let year = date.getFullYear();

      // Format the date as dd/mm/yyyy
      let formattedDate = `${month}/${day}/${year}`;
      log.debug("bloodGroup",clientBlood)
      log.debug("date",formattedDate)

      
      if(clientBlood && formattedDate){
      let searchRecord = search.create({
        type: "customrecord__jj_blood_donor",
        filters: [
          ["custrecord_jj_blood_donor_blood_group", "is", clientBlood],
          "AND",
          [
            "custrecord_jj_blood_donor_donation_date",
            "before",
            formattedDate,
          ],
        ],
        columns: [
          "custrecord_jj_blood_donor_firstname",
          "custrecord_jj_blood_donor_phone_number",
          "custrecord_jj_blood_donor_donation_date",
        ],
      });

      log.debug("Search Result: ",searchRecord)

      
      let lineCount = searchRecord.run().getRange({
        start: 0,
        end: 100
    })

    for(let i=0;i<lineCount.length;i++){

    var result = lineCount[i];
        let donor = result.getValue("custrecord_jj_blood_donor_firstname")
        log.debug("DONOR: "+ donor)
        let phone = result.getValue("custrecord_jj_blood_donor_phone_number")
        log.debug("PHONE: "+ phone)
        let date = result.getValue("custrecord_jj_blood_donor_donation_date")
        log.debug("DATE: "+ date)
        
        sublist.setSublistValue({
          id: "custpage_jj_donorname",
          line: i,
          value: result.getValue("custrecord_jj_blood_donor_firstname"),
          

          
        });
        sublist.setSublistValue({
          id: "custpage_jj_donorphone",
          line: i,
          value: result.getValue("custrecord_jj_blood_donor_phone_number"),
         


        });
        sublist.setSublistValue({
          id: "custpage_jj_donordate",
          line: i,
          value: result.getValue("custrecord_jj_blood_donor_donation_date"),
          
        
        });

      
      }
    
    
    }
  
    scriptContext.response.writePage(form);

  }
    }
    catch(e){
      log.error('',e)
      }
    }

  



  return { onRequest };
});

