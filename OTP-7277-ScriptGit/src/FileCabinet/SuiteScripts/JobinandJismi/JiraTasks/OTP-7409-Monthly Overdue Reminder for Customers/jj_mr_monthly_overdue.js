/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**********************************************************************************
 * OTP-7409 : Monthly Over Due Reminder for Customer
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
 * Date Created: 02-July-2024
 *
 * Description: This script automates the process of sending monthly email notifications to customers with overdue invoices. It collects relevant invoice data, compiles it into a CSV file, and sends an email with the CSV attached. The email will be sent from the assigned Sales Rep or a static NetSuite Admin if no Sales Rep is assigned
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 02-July-2024: Created the initial build by JJ0354
 *
 *
 *
 **************/
define(['N/email', 'N/file', 'N/log', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (email, file, log, record, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            //search ovedue invoicea

            let invoiceRec = search.create({
                type: search.Type.INVOICE,
                filters: [['daysoverdue','greaterthan',0],'AND',
                ['datecreated','within','lastmonth'],'AND',
                ['mainline','is','T'],'AND',
                ['status','anyof', 'CustInvc:A']],
                columns: ['entity','tranid','amount','daysoverdue','salesrep','datecreated']

            })

            return invoiceRec
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            //map function
            try{

                let result = JSON.parse(mapContext.value)
            var salesRepId = result.values.salesrep ? result.values.salesrep.value : 'admin';
                log.debug("SalesREpID",salesRepId)
            let invoiceId = result.id
            let customerId = result.values.entity.value
            let invoiceAmount = result.values.amount
            let daysoverdue = result.values.daysoverdue
            let invoiceDate = result.values.datecreated

            log.debug(invoiceId)
            log.debug(customerId)
            log.debug(invoiceAmount)
            log.debug(daysoverdue)
            log.debug(invoiceDate)
            
            

            let cus =record.load({
                type: record.Type.CUSTOMER,
                id: customerId,
                isDynamic: true

            })

            let cusEmail = cus.getValue('email')
            log.debug(cusEmail)
            let cusName = result.values.entity.text
            let author = salesRepId==='admin'?-5:salesRepId
            log.debug("map",author)
            

            let invoiceData ={
                "invoiceId": invoiceId,
                "invoiceAmount":invoiceAmount,
                "daysoverdue":daysoverdue,
                "invoiceDate":invoiceDate,
                "cusName":cusName,
                "cusEmail":cusEmail,
                "authorId":author
            }
            log.debug("InvoiceData :",invoiceData)

            mapContext.write({
                key : customerId,
                value:invoiceData
            })


            }
            catch(e){
                log.debug(e)
                }

           
            // csvContent = 'Customer Name, Customer Email, Invoice document Number, Invoice Amount, Days Overdue\n'
            // csvContent+=cusName+','+recipientEmail+','+invoiceId+','+invoiceAmount+','+daysoverdue+'\n'
           
           
           
            // let authorEmail = salesRepId==='admin'?-5:salesRepId
            // log.debug(authorEmail)
            
            
            // let csvFile = file.create({
            //     name: 'invoice.csv',
            //     folder: 694,
            //     fileType: file.Type.CSV,
            //     contents: csvContent

            // })
            // csvFile.save()


            // email.send({
            //     author:authorEmail,
            //     recipients: recipientEmail,
            //     subject: 'Overdue Invoice',
            //     body: 'Your invoice is overdue',
            //     attachments: csvFile

            // })

            // log.debug("Email send successfully")

        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

            try{
            let customerId = reduceContext.key
            let invoiceData = reduceContext.values.map(JSON.parse)
            let author = invoiceData[0].authorId
            log.debug(author)
            

            log.debug(customerId)
            

            csvContent = 'Customer Name, Customer Email, Invoice document Number, Invoice Amount, Days Overdue\n'

            invoiceData.forEach(data=>{
                csvContent += `${data.cusName},${data.cusEmail},${data.invoiceId},${data.invoiceAmount},${data.daysoverdue}`
            })
            

            let csvFile = file.create({
                name: 'invoice.csv',
                folder: 694,
                fileType: file.Type.CSV,
                contents: csvContent

            })
            csvFile.save()

             email.send({
                    author: author,
                    recipients: customerId,
                    subject: 'Overdue Invoice',
                    body: 'Your invoice is overdue',
                    attachments: [csvFile]
                })
           

            log.debug("Email send successfully")
            
            }
            catch(e){
                log.error("Error in reduce function",e)
                }
            

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            summaryContext.output.iterator().each(function(key, value) {
                log.audit({
                    title: 'Summary of key: ' + key,
                    details: value
                });
                return true;
            });
 
            log.audit('Usage Consumed', summaryContext.usage);
            log.audit('Concurrency', summaryContext.concurrency);
            log.audit('Number of Yields', summaryContext.yields);

        }

        return {getInputData, map, reduce, summarize}

    });
