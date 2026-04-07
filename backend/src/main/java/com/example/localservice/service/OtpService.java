package com.example.localservice.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

    import com.example.localservice.model.OtpData;
    import com.example.localservice.service.EmailService;
    import org.springframework.beans.factory.annotation.Autowired;
    
    @Service
    public class OtpService {
    
        @Autowired
        private EmailService emailService;
    
        @Value("${twilio.account.sid}")
        private String accountSid;
    
        @Value("${twilio.auth.token}")
        private String authToken;
    
        @Value("${twilio.whatsapp.number}")
        private String fromWhatsappNumber;
    
        // 5 minutes in milliseconds
        private static final long OTP_EXPIRY_MS = 5 * 60 * 1000;
    
        // In-memory store for OTPs (identifier -> OtpData)
        private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
        private final SecureRandom secureRandom = new SecureRandom();
    
        @PostConstruct
        public void init() {
            if ("YOUR_TWILIO_ACCOUNT_SID".equals(accountSid) || accountSid == null || accountSid.isEmpty()) {
                System.err.println("WARNING: Twilio Account SID is not configured! OTPs will not be sent via WhatsApp.");
            } else {
                Twilio.init(accountSid, authToken);
            }
        }
    
        private String generateOtpValue() {
            return String.format("%06d", secureRandom.nextInt(1000000));
        }
    
        public void generateAndSendOtp(String toPhone) {
            String otpValue = generateOtpValue();
            String cleanPhone = toPhone.replaceAll("[^+\\d]", "");
            
            // Store OTP with current timestamp
            otpStorage.put(cleanPhone, new OtpData(otpValue, System.currentTimeMillis()));
    
            // ALWAYS print to console for testing (Requirement #8)
            System.out.println("===========================================");
            System.out.println("[OTP GENERATED] For: " + cleanPhone);
            System.out.println("[OTP value] : " + otpValue);
            System.out.println("===========================================");
    
            String messageBody = "Your Local Service Provider verification code is: " + otpValue;
            String formattedToWhatsapp = cleanPhone;
            
            if (!formattedToWhatsapp.startsWith("whatsapp:")) {
                formattedToWhatsapp = "whatsapp:" + (formattedToWhatsapp.startsWith("+") ? formattedToWhatsapp : "+" + formattedToWhatsapp);
            }
    
            if ("YOUR_TWILIO_ACCOUNT_SID".equals(accountSid) || accountSid == null || accountSid.isEmpty()) {
                System.out.println("[MOCK WHATSAPP] Sending to: " + formattedToWhatsapp);
            } else {
                try {
                    Message.creator(
                            new PhoneNumber(formattedToWhatsapp),
                            new PhoneNumber(fromWhatsappNumber),
                            messageBody)
                            .create();
                } catch (Exception e) {
                    System.err.println("Failed to send Twilio WhatsApp message: " + e.getMessage());
                }
            }
        }
    
        public boolean validateOtp(String phone, String otp) {
            String cleanPhone = phone.replaceAll("[^+\\d]", "");
            OtpData storedData = otpStorage.get(cleanPhone);
            
            if (storedData == null) {
                throw new RuntimeException("No OTP found for this identifier");
            }
    
            if (storedData.isExpired(OTP_EXPIRY_MS)) {
                otpStorage.remove(cleanPhone);
                throw new RuntimeException("OTP has expired");
            }
    
            if (storedData.getOtp().equals(otp)) {
                otpStorage.remove(cleanPhone);
                return true;
            }
            
            return false;
        }
    
        public void generateAndSendEmailOtp(String email) {
            String otpValue = generateOtpValue();
            String cleanEmail = email.toLowerCase().trim();
            
            // Store OTP with current timestamp
            otpStorage.put(cleanEmail, new OtpData(otpValue, System.currentTimeMillis()));
    
            // ALWAYS print to console for testing (Requirement #8)
            System.out.println("===========================================");
            System.out.println("[OTP GENERATED] For Email: " + cleanEmail);
            System.out.println("[OTP value] : " + otpValue);
            System.out.println("===========================================");
    
            String subject = "SERVICE HUB - Verification OTP";
            String text = "Your verification OTP is: " + otpValue + "\nValid for 5 minutes.";
            
            emailService.sendEmail(cleanEmail, subject, text);
        }
    
        public boolean validateEmailOtp(String email, String otp) {
            String cleanEmail = email.toLowerCase().trim();
            OtpData storedData = otpStorage.get(cleanEmail);
            
            if (storedData == null) {
                throw new RuntimeException("No OTP found for this email");
            }
    
            if (storedData.isExpired(OTP_EXPIRY_MS)) {
                otpStorage.remove(cleanEmail);
                throw new RuntimeException("OTP has expired");
            }
    
            if (storedData.getOtp().equals(otp)) {
                otpStorage.remove(cleanEmail);
                return true;
            }
            
            return false;
        }
    }

