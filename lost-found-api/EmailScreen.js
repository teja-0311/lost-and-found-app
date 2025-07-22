const handleSendOtp = async () => {
  await axios.post('http://.../api/auth/send-otp', { email });
  navigation.navigate('OtpScreen', { email, name, phone });
};
