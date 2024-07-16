/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**********************************************************************************
 * OTP-7415 : Search through the database to find the matching blood donors
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
 * Description: This script is for displaying the data in a custom record concurrently based on filters provided by the user in the custom form.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 05-July-2024: Created the initial build by JJ0350
 *
 *
 *
 **************/
define(["N/record", "N/runtime", "N/search", "N/ui/dialog", "N/url"], /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{dialog} dialog
 * @param{url} url
 */ function (record, runtime, search, dialog, url) {
  /**
   * Function to be executed after page is initialized.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
   *
   * @since 2015.2
   */
  function pageInit(scriptContext) {}

  /**
   * Function to be executed when field is changed.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   * @param {string} scriptContext.fieldId - Field name
   * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
   * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
   *
   * @since 2015.2
   */
  function fieldChanged(scriptContext) {
    var currentRecord = scriptContext.currentRecord;

    if (scriptContext.fieldId === 'custpage_bloodgroup_search' || scriptContext.fieldId === 'custpage_donationdate_search') {
    let bloodGroup = currentRecord.getValue("custpage_bloodgroup_search");
    let donationdate = currentRecord.getValue("custpage_donationdate_search");
    console.log(donationdate);

    if (donationdate && !isDateBeforeThreeMonths(donationdate)) {
      dialog.alert({
        title: "Invalid Date",
        message:
          "Last donation date must be at least three months before today.",
      });
      return false;
    }
  
  let suiteletUrl = url.resolveScript({
    deploymentId: "customdeploy_jj_blood_donor_details",
    scriptId: "customscript_jj_blood_donor_details",
    params: {
      clientBlood: bloodGroup,
      clientLastDonation: donationdate,
    },
  });

  log.debug("Suitelet URL", suiteletUrl);

  if (bloodGroup && donationdate) {
    window.location.href = suiteletUrl;
  }

}

  function isDateBeforeThreeMonths(selectedDate) {
    let currentDate = new Date();
    let threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    let selected = new Date(selectedDate);
    return selected < threeMonthsAgo;
}

}

  /**
   * Function to be executed when field is slaved.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   * @param {string} scriptContext.fieldId - Field name
   *
   * @since 2015.2
   */
  function postSourcing(scriptContext) {}

  /**
   * Function to be executed after sublist is inserted, removed, or edited.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   *
   * @since 2015.2
   */
  function sublistChanged(scriptContext) {}

  /**
   * Function to be executed after line is selected.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   *
   * @since 2015.2
   */
  function lineInit(scriptContext) {}

  /**
   * Validation function to be executed when field is changed.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   * @param {string} scriptContext.fieldId - Field name
   * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
   * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
   *
   * @returns {boolean} Return true if field is valid
   *
   * @since 2015.2
   */
  function validateField(scriptContext) {}

  /**
   * Validation function to be executed when sublist line is committed.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   *
   * @returns {boolean} Return true if sublist line is valid
   *
   * @since 2015.2
   */
  function validateLine(scriptContext) {}

  /**
   * Validation function to be executed when sublist line is inserted.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   *
   * @returns {boolean} Return true if sublist line is valid
   *
   * @since 2015.2
   */
  function validateInsert(scriptContext) {}

  /**
   * Validation function to be executed when record is deleted.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   *
   * @returns {boolean} Return true if sublist line is valid
   *
   * @since 2015.2
   */
  function validateDelete(scriptContext) {}

  /**
   * Validation function to be executed when record is saved.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @returns {boolean} Return true if record is valid
   *
   * @since 2015.2
   */
  function saveRecord(scriptContext) {}

  return {
    // pageInit: pageInit,
    fieldChanged: fieldChanged,
    // postSourcing: postSourcing,
    // sublistChanged: sublistChanged,
    // lineInit: lineInit,
    // validateField: validateField,
    // validateLine: validateLine,
    // validateInsert: validateInsert,
    // validateDelete: validateDelete,
    // saveRecord: saveRecord,
  };
});

// /**
//  * @NApiVersion 2.1
//  * @NScriptType ClientScript
//  * @NModuleScope SameAccount
//  */
// /**********************************************************************************
//  * OTP-7415 : Search through the database to find the matching blood donors
//  *
//  *
//  * ********************************************************************************
//  *
//  * ********************
//  * company name
//  *
//  * Author: Jobin and Jismi IT Services
//  *
//  *
//  * Date Created: 05-July-2024
//  *
//  * Description: This script is for displaying the data in a custom record concurrently based on filters provided by the user in the custom form.
//  *
//  *
//  * REVISION HISTORY
//  *
//  * @version 1.0 company name: 05-July-2024: Created the initial build by JJ0350
//  *
//  *
//  *
//  **************/
// define(['N/currentRecord', 'N/url', 'N/ui/dialog', 'N/log'],
//     function (currentRecord, url, dialog, log) {
//         function fieldChanged(scriptContext) {
//             let bloodDonorRec = scriptContext.currentRecord;

//             if (scriptContext.fieldId === 'custpage_jj_blood' || scriptContext.fieldId === 'custpage_jj_lastdon') {
//                 try {
//                     let blood = bloodDonorRec.getValue('custpage_jj_blood');
//                     let lastDonation = bloodDonorRec.getValue('custpage_jj_lastdon');

//                     log.debug('Field Changed', { blood, lastDonation });

//                     if (lastDonation && !(isDateBeforeThreeMonths(lastDonation))) {
//                         dialog.alert({
//                             title: 'Invalid Date',
//                             message: 'Last donation date must be at least three months before today.'
//                         });
//                         return false;
//                     }

//                     let suiteletUrl = url.resolveScript({
//                         deploymentId: 'customdeploy_jj_sl_otp7415_jira_task2',
//                         scriptId: 'customscript_jj_sl_otp7415_jira_task2',
//                         params: {
//                             clientBlood: blood,
//                             clientLastDonation: lastDonation
//                         }
//                     });

//                     log.debug('Suitelet URL', suiteletUrl);

//                     if (blood && lastDonation) {
//                         window.location.href = suiteletUrl;
//                     }
//                 } catch (error) {
//                     log.error('Error in Client Script', error);
//                 }
//             }
//         }

//         function isDateBeforeThreeMonths(selectedDate) {
//             let currentDate = new Date();
//             let threeMonthsAgo = new Date();
//             threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
//             let selected = new Date(selectedDate);
//             return selected < threeMonthsAgo;
//         }

//         return {
//             fieldChanged: fieldChanged
//         };
//     });
