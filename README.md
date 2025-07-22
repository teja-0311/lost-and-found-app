#  Lost & Found App

A mobile and web-integrated platform to help users **report**, **search**, and **claim** lost and found items within a campus or city environment.

Built using **React Native**, **Node.js**, and **MongoDB**, this system simplifies reporting and tracking of lost and found items. It includes OTP-based authentication, Cloudinary for image handling, and a personalized dashboard with claims management.

---

##  Key Modules

| Module         | Description |
|----------------|-------------|
|  Auth System | OTP-based signup/login using email |
|  Alerts      | Post and view lost/found items |
|  Media Upload | Upload item or proof images (via Cloudinary) |
|  Claim System | Submit claims on found items with image proof |
|  Notifications | Found item posters see submitted claims |
|  Profile     | Sidebar drawer shows user profile, logout |

---

##  Software Requirements

| Component     | Version         |
|---------------|-----------------|
| Node.js       | >= 16.x         |
| MongoDB       | Atlas or Local  |
| Expo CLI      | >= 6.x          |
| React Native  | >= 0.72         |
| Cloudinary    | Active Account  |
| Gmail SMTP    | App password (for OTP) |

---

##  Tech Stack

| Layer       | Tech Used                     |
|-------------|-------------------------------|
| Frontend    | React Native (Expo)           |
| Navigation  | @react-navigation/native      |
| State Mgmt  | Context API, AsyncStorage     |
| Backend     | Node.js + Express             |
| Database    | MongoDB + Mongoose            |
| Auth        | OTP Email (via Nodemailer)    |
| Media       | Cloudinary Image Upload       |

---

##  Folder Structure
```
lost-found-app/
├── App.js
├── AppNavigator.js
├── UserContext.js
├── config.js
├── screens/
│ ├── DashboardScreen.js
│ ├── PostItemScreen.js
│ ├── ClaimProofScreen.js
│ ├── ClaimsScreen.js
│ ├── MessagesScreen.js
│ ├── OtpScreen.js
│ ├── UsernameScreen.js
├── lost-found-api/
│ ├── server.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── alerts.js
│ │ └── messages.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Otp.js
│ │ ├── Alert.js
│ │ └── Message.js
│ └── .env (gitignored)
```
---

##  Setup Instructions

### 1.  Backend Setup

```bash```
cd lost-found-api

```bash```
npm install
#### Start Backend
```bash```
node server.js
### 2. Frontend Setup
```bash```cd ..


```bash```npm install


```bash```npx expo start
(Scan QR code using Expo Go app)

(Or run in Android/iOS emulator)

## Cloudinary Configuration
Set the following during image upload:

upload_preset=your_upload_preset(eg. lostfound)

cloud_name=your_cloud_name

Make sure to use unsigned uploads for simplicity.
##  Deployment (Optional)
You can deploy the backend to:

Render, Cyclic, Railway, or Vercel (serverless)

Frontend:

React Native apps can be compiled via EAS or used via Expo Go

## Author

 **Teja G**  
 [GitHub Profile](https://github.com/teja-0311)

**This project is part of my portfolio. Feel free to explore the code and reach out!**

