interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expires_in?: number;
}

interface RefreshTokenError {
  error: string;
  detail: string;
}

async function refreshAccessToken(refreshToken: string, tenant: string | null): Promise<TokenResponse> {
  try {
    const response = await fetch(
			`http://${tenant}.localhost:8000/api/token/pair`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh: refreshToken }),
			}
		);

    if (!response.ok) {
      const errorData: RefreshTokenError = await response.json();
      throw new Error(errorData.detail || 'Failed to refresh token');
    }

    const data: TokenResponse = await response.json();
    
    // Store new tokens in localStorage or your preferred storage
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

export default refreshAccessToken;