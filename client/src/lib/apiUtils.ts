/**
 * Utility functions for API calls
 */

/**
 * Check if a secret exists in the environment
 * This makes a request to the backend to check if a secret key is set
 * @param secret - The secret key to check
 * @returns Promise<boolean> - True if the secret exists, false otherwise
 */
export async function check_secrets(secret: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/check-secrets?key=${secret}`);
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.exists === true;
  } catch (error) {
    console.error('Error checking secrets:', error);
    return false;
  }
}