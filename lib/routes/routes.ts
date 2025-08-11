const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const API_ROUTES = {
  AUTH: {
    SIGNUP: `${BASE_URL}/api/signup`,
    VERIFY_OTP: `${BASE_URL}/api/otp/verify-otp`,
    SEND_OTP: `${BASE_URL}/api/otp/send-otp`,
  },

  USER: {
    PROFILE: `${BASE_URL}/api/user/profile`,
    DASHBOARD: `${BASE_URL}/api/user/dashboard`,
  },
} as const;
