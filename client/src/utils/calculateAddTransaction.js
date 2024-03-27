export default function calculateAddTransaction(
  transactionDetails,
  setTransactionDetails
) {
  //converting paid percentage into amount
  const rCommisssion =
    Math.round(
      (transactionDetails.receiverCommissionPercentage *
        transactionDetails.amount) /
        10
    ) / 10;

  //converting send percentage into amount
  const sCommisssion =
    Math.round(
      (transactionDetails.senderCommissionPercentage *
        transactionDetails.amount) /
        10
    ) / 10;

  // Finding netPaid Amount
  let netpAmount =
    transactionDetails.comisionTypeP == "Credit"
      ? Number(transactionDetails.amount) - rCommisssion
      : Number(transactionDetails.amount) + rCommisssion;

  // Finding netrecived Amount
  let netrAmount =
    transactionDetails.comisionTypeP == "Credit"
      ? Number(transactionDetails.amount) - sCommisssion
      : Number(transactionDetails.amount) + sCommisssion;

  let netCom = 0;

  if (transactionDetails.comisionTypeP == "Credit")
    netCom -= +transactionDetails.receiverCommission;
  else if (transactionDetails.comisionTypeP == "Debit")
    netCom += +transactionDetails.receiverCommission;

  if (transactionDetails.comisionTypeS == "Credit")
    netCom -= +transactionDetails.senderCommission;
  else if (transactionDetails.comisionTypeS == "Debit")
    netCom += +transactionDetails.senderCommission;

  setTransactionDetails((pre) => ({
    ...pre,
    receiverCommission: pre.receiverCommissionEditable
      ? pre.receiverCommission
      : rCommisssion,
    netPaidAmount: netpAmount,
    senderCommission: pre.senderCommissionEditable
      ? pre.senderCommission
      : sCommisssion,
    netReceivedAmount: netrAmount,
    netComision: netCom,
  }));
}
