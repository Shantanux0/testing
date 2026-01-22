package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserProfileResponseDto {
    private Long id;
    private String email; // From UserAuthEntity
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImageUrl;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String location;
    private String website;
    private String linkedinUrl;
    private String githubUrl;
    private String skills;
    private String interests;
    private boolean isVerified; // From UserAuthEntity
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // NEW FIELDS FOR ENHANCED MATCHING
    private String skillsToLearn;

    // Scheduling
    private String timezone;
    private Integer hoursPerWeek;
    private String availabilitySchedule;

    // Goals
    private String learningGoal;
    private String goalTimeline;

    // Teaching
    private String teachingMotivation;
    private String teachingApproach;

    // Learning Preferences
    private String preferredLearningMethod;
    private String communicationPace;

    // Matching
    private String preferredLanguage;
    private String domainFocus;
    private Integer profileCompletenessScore;

    // Skill proficiency details
    private java.util.List<SkillLevelDto> skillLevels;

}
