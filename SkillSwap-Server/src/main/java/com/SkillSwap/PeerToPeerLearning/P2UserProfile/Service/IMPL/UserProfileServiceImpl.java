package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service.IMPL;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.UserProfileResponseDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.UserProfileUpdateDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserProfileRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service.UserProfileService;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Transactional
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    @Autowired
    private UserProfileRepository profileRepository;

    @Autowired
    private UserAuthRepo userAuthRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseDto getProfileByEmail(String email) {
        UserAuthEntity user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserProfileEntity profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        return mapToResponseDto(profile);
    }

    @Override
    public UserProfileResponseDto updateProfile(String email, UserProfileUpdateDto profileDto) {
        UserAuthEntity user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserProfileEntity profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        updateProfileFields(profile, profileDto);
        UserProfileEntity savedProfile = profileRepository.save(profile);

        return mapToResponseDto(savedProfile);
    }

    @Override
    public UserProfileResponseDto createProfile(String email, UserProfileUpdateDto profileDto) {
        UserAuthEntity user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (profileRepository.existsByUserId(user.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists");
        }

        UserProfileEntity profile = new UserProfileEntity();
        profile.setUser(user);
        updateProfileFields(profile, profileDto);

        UserProfileEntity savedProfile = profileRepository.save(profile);
        return mapToResponseDto(savedProfile);
    }

    @Override
    public void deleteProfile(String email) {
        UserAuthEntity user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserProfileEntity profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        profileRepository.delete(profile);

    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponseDto> searchProfiles(String keyword, Pageable pageable) {
        Page<UserProfileEntity> profiles = profileRepository.findByKeyword(keyword, pageable);
        return profiles.map(this::mapToResponseDto);
    }

    private void updateProfileFields(UserProfileEntity profile, UserProfileUpdateDto dto) {
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setBio(dto.getBio());
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setPhoneNumber(dto.getPhoneNumber());
        profile.setLocation(dto.getLocation());
        profile.setWebsite(dto.getWebsite());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setSkills(dto.getSkills());
        profile.setInterests(dto.getInterests());

        // NEW MATCHING FIELDS
        profile.setSkillsToLearn(dto.getSkillsToLearn());
        profile.setTimezone(dto.getTimezone());
        profile.setHoursPerWeek(dto.getHoursPerWeek());
        profile.setAvailabilitySchedule(dto.getAvailabilitySchedule());
        profile.setLearningGoal(dto.getLearningGoal());
        profile.setGoalTimeline(dto.getGoalTimeline());
        profile.setTeachingMotivation(dto.getTeachingMotivation());
        profile.setTeachingApproach(dto.getTeachingApproach());
        profile.setPreferredLearningMethod(dto.getPreferredLearningMethod());
        profile.setCommunicationPace(dto.getCommunicationPace());
        profile.setPreferredLanguage(dto.getPreferredLanguage());
        profile.setDomainFocus(dto.getDomainFocus());

        // Calculate profile completeness
        profile.setProfileCompletenessScore(calculateProfileCompleteness(profile));
    }

    private UserProfileResponseDto mapToResponseDto(UserProfileEntity profile) {
        UserProfileResponseDto dto = new UserProfileResponseDto();
        dto.setId(profile.getId());
        dto.setEmail(profile.getUser().getEmail());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setBio(profile.getBio());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setLocation(profile.getLocation());
        dto.setWebsite(profile.getWebsite());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setSkills(profile.getSkills());
        dto.setInterests(profile.getInterests());
        dto.setVerified(profile.getUser().getIsAccountVerified());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());

        // NEW MATCHING FIELDS
        dto.setSkillsToLearn(profile.getSkillsToLearn());
        dto.setTimezone(profile.getTimezone());
        dto.setHoursPerWeek(profile.getHoursPerWeek());
        dto.setAvailabilitySchedule(profile.getAvailabilitySchedule());
        dto.setLearningGoal(profile.getLearningGoal());
        dto.setGoalTimeline(profile.getGoalTimeline());
        dto.setTeachingMotivation(profile.getTeachingMotivation());
        dto.setTeachingApproach(profile.getTeachingApproach());
        dto.setPreferredLearningMethod(profile.getPreferredLearningMethod());
        dto.setCommunicationPace(profile.getCommunicationPace());
        dto.setPreferredLanguage(profile.getPreferredLanguage());
        dto.setDomainFocus(profile.getDomainFocus());
        dto.setProfileCompletenessScore(profile.getProfileCompletenessScore());

        return dto;
    }

    /**
     * Calculate profile completeness score (0-100)
     */
    private int calculateProfileCompleteness(UserProfileEntity profile) {
        int totalFields = 26; // Total optional fields
        int filledFields = 0;

        // Required fields (3)
        if (profile.getFirstName() != null && !profile.getFirstName().isBlank())
            filledFields++;
        if (profile.getLastName() != null && !profile.getLastName().isBlank())
            filledFields++;
        if (profile.getSkills() != null && !profile.getSkills().isBlank())
            filledFields++;

        // Optional fields (23)
        if (profile.getBio() != null && !profile.getBio().isBlank())
            filledFields++;
        if (profile.getProfileImageUrl() != null)
            filledFields++;
        if (profile.getDateOfBirth() != null)
            filledFields++;
        if (profile.getPhoneNumber() != null)
            filledFields++;
        if (profile.getLocation() != null)
            filledFields++;
        if (profile.getWebsite() != null)
            filledFields++;
        if (profile.getLinkedinUrl() != null)
            filledFields++;
        if (profile.getGithubUrl() != null)
            filledFields++;
        if (profile.getInterests() != null)
            filledFields++;
        if (profile.getSkillsToLearn() != null)
            filledFields++;
        if (profile.getTimezone() != null)
            filledFields++;
        if (profile.getHoursPerWeek() != null)
            filledFields++;
        if (profile.getAvailabilitySchedule() != null)
            filledFields++;
        if (profile.getLearningGoal() != null)
            filledFields++;
        if (profile.getGoalTimeline() != null)
            filledFields++;
        if (profile.getTeachingMotivation() != null)
            filledFields++;
        if (profile.getTeachingApproach() != null)
            filledFields++;
        if (profile.getPreferredLearningMethod() != null)
            filledFields++;
        if (profile.getCommunicationPace() != null)
            filledFields++;
        if (profile.getPreferredLanguage() != null)
            filledFields++;
        if (profile.getDomainFocus() != null)
            filledFields++;

        return (int) ((filledFields / (double) totalFields) * 100);
    }

}
