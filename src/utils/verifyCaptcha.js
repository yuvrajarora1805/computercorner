/**
 * Helper to verify Google reCAPTCHA v2 / v3 tokens on backend API routes
 */
export async function verifyCaptcha(token) {
  if (!token) {
    return { success: false, error: 'Missing captcha token' };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LceUxEuAAAAAHneDeMcKGWaznrQZSb8nww_VSDz';

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    return {
      success: !!data.success,
      score: data.score, // if v3
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return { success: false, error: error.message };
  }
}

