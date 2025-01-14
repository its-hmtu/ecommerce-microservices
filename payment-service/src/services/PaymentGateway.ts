// simulate a payment gateway
export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

const SUCCESS_CARD_NUMBER = "4242424242424242";
const FAIL_CARD_NUMBER = "4242424242424241";

export const processPayment = async (paymentDetails: PaymentDetails) => {
  try {
    // check the card
    // deduct the amount
    // return true if successful, false otherwise
    console.log("Processing payment...");
    if (!isValidCardNumber(paymentDetails.cardNumber)) {
      throw new Error("Invalid card number");
    }

    // if (!istValidExpiryDate(paymentDetails.expiryDate)) {
    //   throw new Error("Invalid expiry date");
    // }

    if (!isValidCvv(paymentDetails.cvv)) {
      throw new Error("Invalid CVV");
    }


    console.log("Payment processed successfully");
    return {success: true};
  } catch (e: any) {
    console.error("Error processing payment: ", e);
    return {success: false, message: e.message};
  }
}

const isValidCardNumber = (cardNumber: string) => {
  const regex = /^[0-9]{16}$/;
  return regex.test(cardNumber);
}

const istValidExpiryDate = (expiryDate: string) => {
  const [month, year] = expiryDate.split("/").map((val) => parseInt(val, 10))

  if (month < 1 || month > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2), 10);
  const currentMonth = currentDate.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

const isValidCvv = (cvv: string) => {
  const regex = /^[0-9]{3}$/;
  return regex.test(cvv);
}