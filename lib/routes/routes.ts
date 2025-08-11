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
    TRIP: {
      CREATE: `${BASE_URL}/api/user/trip/create`,
      GET_ALL: (pageParam: number) =>
        `${BASE_URL}/api/user/trip/get-all?page=${pageParam}&limit=10`,
      GET_BY_ID: (id: string) => `${BASE_URL}/api/user/trip/${id}`,
    },
  },
} as const;
