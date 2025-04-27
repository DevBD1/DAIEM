export interface User {
  tckn: string;          // Turkish Citizen ID Number
  isGraduated: boolean;  // Graduation status
  isPaid: boolean;       // Payment status
}

export interface UserCredentials {
  tckn: string;
}

export default User; 