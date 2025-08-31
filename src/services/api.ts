// services/api.ts
// This is a mock API service file to simulate backend behavior.
const apiUrl = import.meta.env.VITE_API_BASE_URL;
type VerifyResponse = {
  success: boolean;
  message: string;
  data?:Object
};

export const api = {
  // Mock: Verify Order ID
  async verifyOrderId(orderId: string): Promise<VerifyResponse> {
      try {
      const res = await fetch(
        `${apiUrl}/orders/${orderId}`
      );
      const responseData=await res.json();
      console.log("Response Data",responseData);
      
      if (responseData?.success) {
        return {
          success: true,
          message: "Order Validated Successfully",
          data: responseData?.userData
        };
      } else  {
        return {
          success: false,
          message: "Order not found",
        };
      } 
    } catch (err: any) {
      console.error("API error:", err);
      return {
        success: false,
        message: "Failed to connect to server",
      };
    }
  },

  // Mock: Verify QR Token
  async verifyQrToken(orderCode: string): Promise<VerifyResponse> {
    
    try {
      const res = await fetch(
        `${apiUrl}/orders/${orderCode}`
      );
      const responseData=await res.json();
      console.log("Response Data",responseData);
      
      if (responseData?.success) {
        return {
          success: true,
          message: "Order Validated Successfully",
          data: responseData?.userData
        };
      } else  {
        return {
          success: false,
          message: "Order not found",
        };
      } 
    } catch (err: any) {
      console.error("API error:", err);
      return {
        success: false,
        message: "Failed to connect to server",
      };
    }

  },

};
