package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Controller;

import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.UserProfileResponseDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.UserProfileUpdateDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")

public class UserProfileController {

    @Autowired
    private UserProfileService profileService;

    @GetMapping
    public ResponseEntity<UserProfileResponseDto> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            UserProfileResponseDto profile = profileService.getProfileByEmail(email);
            return ResponseEntity.ok(profile);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }

    @PostMapping
    public ResponseEntity<UserProfileResponseDto> createProfile(
            @Valid @RequestBody UserProfileUpdateDto profileDto,
            Authentication authentication) {

        String email = authentication.getName();
        UserProfileResponseDto profile = profileService.createProfile(email, profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponseDto> updateProfile(
            @Valid @RequestBody UserProfileUpdateDto profileDto,
            Authentication authentication) {

        String email = authentication.getName();
        UserProfileResponseDto profile = profileService.updateProfile(email, profileDto);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteProfile(Authentication authentication) {
        String email = authentication.getName();
        profileService.deleteProfile(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserProfileResponseDto>> searchProfiles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<UserProfileResponseDto> profiles = profileService.searchProfiles(keyword, pageable);
        return ResponseEntity.ok(profiles);
    }
}
