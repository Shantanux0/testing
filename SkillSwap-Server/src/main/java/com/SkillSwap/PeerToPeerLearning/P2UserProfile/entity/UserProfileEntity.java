package com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@AllArgsConstructor
public class UserProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserAuthEntity user;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "location")
    private String location;

    @Column(name = "website")
    private String website;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "skills")
    private String skills; // JSON string or comma-separated

    @Column(name = "interests")
    private String interests; // JSON string or comma-separated

    // NEW FIELDS FOR ENHANCED MATCHING

    // Skills to Learn
    @Column(name = "skills_to_learn", length = 1000)
    private String skillsToLearn; // What I want to learn

    // Scheduling
    @Column(name = "timezone", length = 50)
    private String timezone; // e.g., "America/New_York", "Asia/Kolkata"

    @Column(name = "hours_per_week")
    private Integer hoursPerWeek; // Available hours per week

    @Column(name = "availability_schedule", columnDefinition = "TEXT")
    private String availabilitySchedule; // JSON: {"Mon": ["9-12", "18-21"], "Tue": ["14-18"]}

    // Goals
    @Column(name = "learning_goal", length = 50)
    private String learningGoal; // JOB_PREP, CAREER_SWITCH, PERSONAL_PROJECT, EXPLORATION

    @Column(name = "goal_timeline", length = 20)
    private String goalTimeline; // URGENT, MEDIUM, FLEXIBLE, CASUAL

    // Teaching
    @Column(name = "teaching_motivation", length = 50)
    private String teachingMotivation; // LOVE_TEACHING, REINFORCE_KNOWLEDGE, BUILD_REPUTATION, NETWORKING

    @Column(name = "teaching_approach", length = 100)
    private String teachingApproach; // STEP_BY_STEP, PROJECT_BASED, PROBLEM_SOLVING, CONCEPT_FIRST

    // Learning Preferences
    @Column(name = "preferred_learning_method", length = 100)
    private String preferredLearningMethod; // VIDEO_CALL, SCREEN_SHARE, PAIR_PROGRAMMING, CODE_REVIEW, ASYNC

    @Column(name = "communication_pace", length = 20)
    private String communicationPace; // FAST, MODERATE, SLOW

    // Matching
    @Column(name = "preferred_language", length = 50)
    private String preferredLanguage; // English, Spanish, Hindi, etc.

    @Column(name = "domain_focus", length = 200)
    private String domainFocus; // WEB_DEV, MOBILE_DEV, DATA_SCIENCE, DEVOPS, GAME_DEV

    @Column(name = "profile_completeness_score")
    private Integer profileCompletenessScore; // 0-100

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors, getters, setters
    public UserProfileEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
