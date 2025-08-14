// services/api.ts
// This is a mock API service file to simulate backend behavior.

type VerifyResponse = {
  success: boolean;
  message: string;
};

export const api = {
  // Mock: Verify Order ID
  verifyOrderId(orderId: string): Promise<VerifyResponse> {
    return new Promise((resolve) => {
      console.log(`Mock API: Verifying Order ID -> ${orderId}`);
      setTimeout(() => {
        if (orderId === "ORDER123") {
          resolve({ success: true, message: "Order ID is valid" });
        } else {
          resolve({ success: false, message: "Invalid Order ID" });
        }
      }, 800); // Simulate network latency
    });
  },

  // Mock: Verify QR Token
  verifyQrToken(token: string): Promise<VerifyResponse> {
    return new Promise((resolve) => {
      console.log(`Mock API: Verifying QR Token -> ${token}`);
      setTimeout(() => {
        if (token === "QR-TOKEN-VALID") {
          resolve({ success: true, message: "QR token verified successfully" });
        } else {
          resolve({ success: false, message: "QR token is invalid or expired" });
        }
      }, 800);
    });
  },

  // Example: Mock fetch products
  fetchProducts(): Promise<any[]> {
    return new Promise((resolve) => {
      console.log("Mock API: Fetching products");
      setTimeout(() => {
        resolve([
          { id: 1, name: "Product A", price: 100 },
          { id: 2, name: "Product B", price: 150 },
          { id: 3, name: "Product C", price: 200 },
        ]);
      }, 800);
    });
  }
};
