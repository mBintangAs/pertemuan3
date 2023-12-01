export const generateOtp = () => {
    const otp = Math.floor(100000000 + Math.random() * 900000000);

    const now = new Date();
    const expiry = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    expiry.setTime(expiry.getTime() + 30 * 60 * 1000); // Adding 30 minutes to the current time

    return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
    const accountSid = 'AC73bc0467bfb232cd52360d5a2c6518d7'
    const authToken = '987b0adceebe0d787f66c7c13bf1494c'
    const clinet = require('twilio')(accountSid, authToken)
    const data = { body: `otp anda ${otp}`,from:"",to:toPhoneNumber }
    console.log(data);
    const resp = await clinet.messages.create(data);
    return resp;
}