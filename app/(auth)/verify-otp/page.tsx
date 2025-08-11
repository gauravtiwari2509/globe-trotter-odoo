import { Suspense } from "react";
import VerifyOtp from "@/components/Auth/VerifyOtp";

const VerifyOtpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtp />
    </Suspense>
  );
};

export default VerifyOtpPage;
