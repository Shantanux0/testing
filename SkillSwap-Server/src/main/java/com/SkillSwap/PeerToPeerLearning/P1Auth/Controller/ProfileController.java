package com.SkillSwap.PeerToPeerLearning.P1Auth.Controller;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Dto.ProfileRequest;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Dto.ProfileResponse;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Service.ProfileService;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Service.impl.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class ProfileController {
    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createProfile(request);
        // Trigger OTP generation and sending
        profileService.sendOtp(response.getEmail());
        return response;
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return profileService.getProfile(email);
    }
}
