/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**********************************************************************************
 * OTP-7453 : Blood Donor Form
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
 * Date Created: 05-July-2024
 *
 * Description: This script is for storing blood donors information in a custom record using custom data entry form.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 03-July-2024: Created the initial build by JJ0354
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
    if (scriptContext.request.method === "GET") {
      var form = serverWidget.createForm({
        title: "Blood Donor Form",
      });
      // Name (First Name, Last Name), Gender, Phone Number, Blood Group, Last Donation Date
      form.addFieldGroup({
        id: "custpage_jj_blood_donor_details",
        label: "Blood Donor Details",
        default: true,
      });
      form.addField({
        id: "custpage_jj_firstname",
        label: "First Name",
        type: serverWidget.FieldType.TEXT,
        container: "custpage_jj_details",
      });
      form.addField({
        id: "custpage_jj_lastname",
        label: "Last Name",
        type: serverWidget.FieldType.TEXT,
        container: "custpage_jj_details",
      });
      let gender = form.addField({
        id: "custpage_jj_gender",
        label: "Gender",
        type: serverWidget.FieldType.SELECT,
        container: "custpage_jj_details",
      });
      gender.addSelectOption({
        value: "",
        text: "",
      });
      gender.addSelectOption({
        value: "Male",
        text: "Male",
      });
      gender.addSelectOption({
        value: "Female",
        text: "Female",
      });
      gender.addSelectOption({
        value: "other",
        text: "Other",
      });
      form.addField({
        id: "custpage_jj_phone_number",
        label: "Phone Number",
        type: serverWidget.FieldType.PHONE,
        container: "custpage_jj_details",
      });
      let bloodGroup = form.addField({
        id: "custpage_jj_blood_group",
        label: "Blood Group",
        type: serverWidget.FieldType.SELECT,
        source :"customlist_jj_blood_group",
        container: "custpage_jj_details",
      });
      
      let lastDonationDate = form.addField({
        id: "custpage_jj_last_donation_date",
        label: "Last Donation Date",
        type: serverWidget.FieldType.DATE,
        container: "custpage_jj_details",
      });

      form.addSubmitButton({
        label: "Submit",
      });

      scriptContext.response.writePage(form);
    } else if (scriptContext.request.method == "POST") {
      let firstname = scriptContext.request.parameters.custpage_jj_firstname;
      let lastname = scriptContext.request.parameters.custpage_jj_lastname;
      let gender = scriptContext.request.parameters.custpage_jj_gender;
      let phone = scriptContext.request.parameters.custpage_jj_phone_number;
      let bloodGroup = scriptContext.request.parameters.custpage_jj_blood_group;
      let lastDonationDate =scriptContext.request.parameters.custpage_jj_last_donation_date;


      // Function to convert date to M/D/YYYY format
      function formatDateToMDY(dateString) {
        let date = new Date(dateString);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        return month + '/' + day + '/' + year;
    }

    // let formattedDate = formatDateToMDY(lastDonationDate);

    let Fdate = new Date(lastDonationDate)

      let rec = record.create({
        type: "customrecord__jj_blood_donor",
        isDynamic: true,
      });
      rec.setValue("custrecord_jj_blood_donor_firstname", firstname);
      rec.setValue("custrecord_jj_blood_donor_lastname", lastname);
      rec.setValue("custrecord_jj_blood_donor_gender", gender);
      rec.setValue("custrecord_jj_blood_donor_phone_number", phone);
      rec.setValue("custrecord_jj_blood_donor_blood_group", bloodGroup);
      rec.setValue("custrecord_jj_blood_donor_donation_date",Fdate);

      let recId = rec.save();
      scriptContext.response.write(
        "Record Created: " +
          recId +
          "<br>First Name:" +
          firstname +
          "<br>Last Name:" +
          lastname +
          "<br>Gender:" +
          gender +
          "<br>Phone:" +
          phone +
          "<br>Blood Group:" +
          bloodGroup +
          "<br>Last Donation Date:" +
          lastDonationDate
      );
    }
  };
  return { onRequest };
});
