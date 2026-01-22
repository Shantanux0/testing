package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.SkillLevelDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserSkillLevelRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserSkillLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserSkillLevelService {

    private final UserSkillLevelRepository skillLevelRepository;
    private final UserAuthRepo userAuthRepo;

    /**
     * Add or update a skill level for a user
     */
    public SkillLevelDto addOrUpdateSkillLevel(String email, SkillLevelDto dto) {
        UserAuthEntity user = userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check if skill level already exists
        UserSkillLevel skillLevel = skillLevelRepository
                .findByUserIdAndSkillName(user.getId(), dto.getSkillName())
                .orElse(UserSkillLevel.builder()
                        .user(user)
                        .skillName(dto.getSkillName())
                        .build());

        // Update fields
        skillLevel.setProficiencyLevel(dto.getProficiencyLevel());
        skillLevel.setYearsOfExperience(dto.getYearsOfExperience());
        skillLevel.setSelfRating(dto.getSelfRating());
        skillLevel.setProjectsCompleted(dto.getProjectsCompleted());
        skillLevel.setLastUsedDate(dto.getLastUsedDate());
        skillLevel.setWillingToTeach(dto.getWillingToTeach() != null ? dto.getWillingToTeach() : true);

        skillLevel = skillLevelRepository.save(skillLevel);

        return toDto(skillLevel);
    }

    /**
     * Get all skill levels for a user
     */
    public List<SkillLevelDto> getUserSkillLevels(String email) {
        UserAuthEntity user = userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return skillLevelRepository.findByUserId(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific skill level for a user
     */
    public SkillLevelDto getSkillLevel(String email, String skillName) {
        UserAuthEntity user = userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return skillLevelRepository.findByUserIdAndSkillName(user.getId(), skillName)
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Skill level not found for skill: " + skillName));
    }

    /**
     * Delete a skill level
     */
    public void deleteSkillLevel(String email, String skillName) {
        UserAuthEntity user = userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserSkillLevel skillLevel = skillLevelRepository.findByUserIdAndSkillName(user.getId(), skillName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Skill level not found for skill: " + skillName));

        skillLevelRepository.delete(skillLevel);
    }

    /**
     * Convert entity to DTO
     */
    private SkillLevelDto toDto(UserSkillLevel entity) {
        return SkillLevelDto.builder()
                .id(entity.getId())
                .skillName(entity.getSkillName())
                .proficiencyLevel(entity.getProficiencyLevel())
                .yearsOfExperience(entity.getYearsOfExperience())
                .selfRating(entity.getSelfRating())
                .projectsCompleted(entity.getProjectsCompleted())
                .lastUsedDate(entity.getLastUsedDate())
                .willingToTeach(entity.getWillingToTeach())
                .build();
    }
}
