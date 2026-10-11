import sys
import smtplib
import ssl
from email.message import EmailMessage

def send_otp_email(to_email, otp_code, user_name="User"):
    email = "programmmariojs8@gmail.com"
    password = "eipsenitutruqzxo"

    msg = EmailMessage()
    msg["Subject"] = f"Your Verification Passcode: {otp_code}"
    msg["From"] = f"Kartavya Civic <{email}>"
    msg["To"] = to_email

    plain_text = f"""Hello {user_name},

Your verification code is: {otp_code}

This code will expire in 5 minutes.
If you did not request this code, please ignore this email.

— Team Kartavya Civic"""

    html = f"""<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;border:1px solid #eaeaea;border-radius:12px;background:#ffffff;">
<div style="text-align:center;margin-bottom:24px;">
<h1 style="color:#047857;margin:0;font-size:26px;letter-spacing:1px;font-weight:800;">KARTAVYA</h1>
<p style="color:#716d82;font-size:13px;margin:4px 0 0;">Civic Action &bull; See the issue. Be the change.</p>
</div>
<p style="color:#18162b;font-size:15px;line-height:1.6;">Hello <b>{user_name}</b>,</p>
<p style="color:#504c61;font-size:14px;line-height:1.6;">Thank you for signing in to Kartavya Civic. Use the passcode below to verify your email address and authenticate your citizen session:</p>
<div style="text-align:center;margin:30px 0;">
<span style="display:inline-block;letter-spacing:8px;font-size:32px;font-weight:800;color:#047857;background:#ecfdf5;padding:14px 28px;border-radius:10px;border:1px dashed #047857;">{otp_code}</span>
</div>
<p style="color:#716d82;font-size:13px;line-height:1.5;">⏱️ This code will expire in <b>5 minutes</b>. If you did not request this verification, you can safely ignore this message.</p>
<hr style="border:none;border-top:1px solid #f0edf7;margin:28px 0 16px;" />
<p style="color:#9c97aa;font-size:12px;text-align:center;margin:0;">&copy; 2025 Kartavya Civic Action Foundation &bull; Public Trust Architecture</p>
</div>"""

    msg.set_content(plain_text)
    msg.add_alternative(html, subtype="html")

    try:
        context = ssl._create_unverified_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=15) as server:
            server.login(email, password)
            server.send_message(msg)
        print("SUCCESS")
        return True
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        to_email = sys.argv[1]
        otp_code = sys.argv[2]
        user_name = sys.argv[3] if len(sys.argv) > 3 else "Citizen"
        success = send_otp_email(to_email, otp_code, user_name)
        sys.exit(0 if success else 1)
    else:
        print("Usage: python3 send_otp.py <to_email> <otp_code> [user_name]", file=sys.stderr)
        sys.exit(1)
