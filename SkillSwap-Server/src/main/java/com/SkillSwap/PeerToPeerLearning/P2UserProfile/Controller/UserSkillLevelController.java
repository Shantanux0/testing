package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Controller;

import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.SkillLevelDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service.UserSkillLevelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile/skills")
@RequiredArgsConstructor
public class UserSkillLevelController {

    private final UserSkillLevelService skillLevelService;

    /**
     * Add or update a skill level
     */
    @PostMapping
    public ResponseEntity<SkillLevelDto> addOrUpdateSkillLevel(
            @Valid @RequestBody SkillLevelDto skillLevelDto,
            Authentication authentication) {

        String email = authentication.getName();
        SkillLevelDto result = skillLevelService.addOrUpdateSkillLevel(email, skillLevelDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Get all skill levels for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<SkillLevelDto>> getUserSkillLevels(Authentication authentication) {
        String email = authentication.getName();
        List<SkillLevelDto> skillLevels = skillLevelService.getUserSkillLevels(email);
        return ResponseEntity.ok(skillLevels);
    }

    /**
     * Get a specific skill level
     */
    @GetMapping("/{skillName}")
    public ResponseEntity<SkillLevelDto> getSkillLevel(
            @PathVariable String skillName,
            Authentication authentication) {

        String email = authentication.getName();
        SkillLevelDto skillLevel = skillLevelService.getSkillLevel(email, skillName);
        return ResponseEntity.ok(skillLevel);
    }

    /**
     * Delete a skill level
     */
    @DeleteMapping("/{skillName}")
    public ResponseEntity<Map<String, String>> deleteSkillLevel(
            @PathVariable String skillName,
            Authentication authentication) {

        String email = authentication.getName();
        skillLevelService.deleteSkillLevel(email, skillName);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Skill level deleted successfully");
        return ResponseEntity.ok(response);
    }
}
