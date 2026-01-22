package com.SkillSwap.PeerToPeerLearning.P1Auth.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "tbl_user_auth")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAuthEntity {
    // Primary key: auto-incremented unique identifier for each user
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User-facing unique identifier (e.g., username, OAuth external ID)
    // Ensures no two users can have the same userId
    @Column(unique = true)
    private String userId;

    // User's full name, as provided during registration or profile update
    private String name;

    // User's email address (unique constraint: one account per email)
    @Column(unique = true)
    private String email;

    // Encrypted/hashed password for authentication (never stored as plain text!)
    private String password;

    // Indicates if the user's account has been verified (usually via email OTP)
    private Boolean isAccountVerified;

    // Temporary one-time password (OTP) for email verification
    private String verifyOtp;
    // Timestamp indicating when the verification OTP will expire
    private Long verifyOtpExpireAt;

    // Temporary OTP for password reset requests
    private String resetOtp;
    // Timestamp indicating when the password reset OTP will expire
    private Long resetOtpExpireAt;

    // Automatically set by Hibernate when the record is first created
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    // Automatically updated by Hibernate whenever the record is modified
    @UpdateTimestamp
    private Timestamp updatedAt;


}
