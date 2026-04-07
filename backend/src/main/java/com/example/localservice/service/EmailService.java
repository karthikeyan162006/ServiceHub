package com.example.localservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        if (mailSender == null || fromEmail == null || fromEmail.isEmpty() || "your_email@gmail.com".equals(fromEmail)) {
            // Mock mode
            System.out.println("===========================================");
            System.out.println("[MOCK EMAIL] To: " + to);
            System.out.println("[MOCK EMAIL] Subject: " + subject);
            System.out.println("[MOCK EMAIL] Message: " + text);
            System.out.println("===========================================");
        } else {
            // Real email sending
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(to);
                message.setSubject(subject);
                message.setText(text);
                mailSender.send(message);
                System.out.println("Email sent successfully to " + to);
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
                throw new RuntimeException("Failed to send email");
            }
        }
    }
}
