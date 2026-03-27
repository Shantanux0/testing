package com.SkillSwap.PeerToPeerLearning.P1Auth.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Our Platform");
        message.setText("Hello " + name + ",\n\nThanks for registering with us!\n\nRegards,\nSkillSwap Team");
        javaMailSender.send(message);

    }

    public void sendPasswordChangedEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("⚠️ Password Changed Successfully");

        // Get current time
        String dateTime = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));

        message.setText(
                "Hello,\n\n" +
                        "Your password was successfully changed on: " + dateTime + "\n\n" +
                        "⚠️ If you did not perform this action, please contact our support team immediately or reset your password again.\n\n"
                        +
                        "Stay secure,\n" +
                        "SkillSwap Team");

        javaMailSender.send(message);
    }

    public void sendResetOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP for resetting your password is " + otp
                + ". Use this OTP to proceed with resetting your password.");
        javaMailSender.send(message);

    }

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account Verification OTP");
        message.setText("Your OTP is " + otp + ". Verify your account using this OTP.");
        javaMailSender.send(message);

    }

    public void sendMatchFoundEmail(String toEmail, String name, String skillToLearn, String skillToTeach) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🎉 We found a Match for your Skill Swap!");
        message.setText("Hello " + name + ",\n\n" +
                "Great news! We found potential partners for your request to learn " + skillToLearn + " and teach "
                + skillToTeach + ".\n\n" +
                "Please visit the site to view your matches and start swapping skills!\n\n" +
                "Happy Learning,\n" +
                "SkillSwap Team");
        javaMailSender.send(message);
    }

    public void sendStillSearchingEmail(String toEmail, String name, String skillToLearn, String skillToTeach) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🔍 Still searching for your perfect match");
        message.setText("Hello " + name + ",\n\n" +
                "We are currently searching for the best partner for your request to learn " + skillToLearn
                + " and teach " + skillToTeach + ".\n\n" +
                "We'll notify you as soon as someone matches your criteria. Hang tight!\n\n" +
                "Best Regards,\n" +
                "SkillSwap Team");
        javaMailSender.send(message);
    }
}
